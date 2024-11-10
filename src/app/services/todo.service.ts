import { API } from "@/lib/constants";
import prisma from "@/lib/core/prisma";
import {
  calculatePagination,
  generateRandomHexColor,
  getPaginationSkip,
} from "@/lib/utils";
import {
  CreateTodoInput,
  GetTodosInput,
  UpdateTodoInput,
} from "@/lib/validations";
import { Prisma, Todo } from "@prisma/client";
import { CacheService } from ".";

export default class TodoService {
  private static readonly CACHE_PREFIX = "todos";
  private static readonly CACHE_TTL = 60 * 5; // 5 minutes

  private static async invalidateCache(userId: string) {
    await CacheService.delByPattern(`${this.CACHE_PREFIX}:${userId}:*`);
  }

  static async getTodos(userId: string, query: GetTodosInput["query"]) {
    const listCacheKey = CacheService.generateKey(
      this.CACHE_PREFIX,
      userId,
      "list",
      JSON.stringify(query)
    );
    const countCacheKey = CacheService.generateKey(
      this.CACHE_PREFIX,
      userId,
      "count",
      JSON.stringify(query)
    );

    const cachedTodos = await CacheService.get<Todo[]>(listCacheKey);
    const cachedTotal = await CacheService.get<number>(countCacheKey);

    if (cachedTodos && cachedTotal) {
      return {
        pagination: calculatePagination(cachedTotal, query.page),
        todos: cachedTodos,
      };
    }

    const labels = query.labels?.split(",");

    const whereClause: Prisma.TodoWhereInput = {
      deletedAt: null,
      userId,
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" } },
          { content: { contains: query.q, mode: "insensitive" } },
        ],
      }),
      ...(labels && {
        labels: {
          some: { id: { in: labels } },
        },
      }),
    };

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
          labels: { select: { id: true, name: true, color: true } },
        },
        where: whereClause,
        orderBy: {
          ...(query.sort === "ascByCreatedAt" && { createdAt: "asc" }),
          ...(query.sort === "descByCreatedAt" && { createdAt: "desc" }),
          ...(query.sort === "ascByUpdatedAt" && { updatedAt: "asc" }),
          ...(query.sort === "descByUpdatedAt" && { updatedAt: "desc" }),
          ...(query.sort === "ascByCompleted" && { completed: "asc" }),
          ...(query.sort === "descByCompleted" && { completed: "desc" }),
          ...(query.sort === "ascByTitle" && { title: "asc" }),
          ...(query.sort === "descByTitle" && { title: "desc" }),
          ...(query.sort === "ascByContent" && { content: "asc" }),
          ...(query.sort === "descByContent" && { content: "desc" }),
          ...(!query.sort && { createdAt: "desc" }),
        },
        skip: getPaginationSkip(query.page),
        take: API.PAGINATION.DEFAULT_PAGE_SIZE,
      }),
      prisma.todo.count({ where: whereClause }),
    ]);

    await Promise.all([
      CacheService.set(listCacheKey, todos, this.CACHE_TTL),
      CacheService.set(countCacheKey, total, this.CACHE_TTL),
    ]);

    return {
      pagination: calculatePagination(total, query.page),
      todos,
    };
  }

  static async getTodoById(userId: string, id: string) {
    const todoCacheKey = CacheService.generateKey(
      this.CACHE_PREFIX,
      userId,
      id
    );

    const cachedTodo = await CacheService.get<Todo>(todoCacheKey);

    if (cachedTodo) return cachedTodo;

    const todo = await prisma.todo.findUnique({
      where: { deletedAt: null, id, userId },
      include: { labels: { select: { id: true, name: true, color: true } } },
    });

    if (!todo) return null;

    await CacheService.set(todoCacheKey, todo, this.CACHE_TTL);

    return todo;
  }

  static async createTodo(userId: string, data: CreateTodoInput["body"]) {
    const todo = await prisma.todo.create({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        labels: { select: { id: true, name: true, color: true } },
      },
      data: {
        title: data.title,
        content: data.content,
        userId: userId,
        labels: {
          connect: data.labels
            .filter((label) => label.id && !label.name)
            .map((label) => ({ id: label.id })),
          create: data.labels
            .filter((label) => !label.id && label.name)
            .map((label) => ({
              name: label.name!,
              color: generateRandomHexColor(),
              userId,
            })),
        },
      },
    });

    await this.invalidateCache(userId);

    return todo;
  }

  static async updateTodo(
    userId: string,
    id: string,
    data: UpdateTodoInput["body"]
  ) {
    const todoExists = await this.getTodoById(userId, id);
    if (!todoExists) return null;

    const todo = await prisma.todo.update({
      where: { deletedAt: null, id, userId },
      data: { ...data, updatedAt: new Date() },
    });

    await this.invalidateCache(userId);

    return todo;
  }

  static async deleteTodo(userId: string, id: string) {
    const todoExists = await this.getTodoById(userId, id);
    if (!todoExists) return null;

    const todo = await prisma.todo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.invalidateCache(userId);

    return todo;
  }
}
