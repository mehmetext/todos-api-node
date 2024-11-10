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
import { Prisma } from "@prisma/client";

export default class TodoService {
  static async getTodos(userId: string, query: GetTodosInput["query"]) {
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

    return {
      pagination: calculatePagination(total, query.page),
      todos,
    };
  }

  static async getTodoById(userId: string, id: string) {
    return prisma.todo.findUnique({
      where: { deletedAt: null, id, userId },
      include: { labels: { select: { id: true, name: true, color: true } } },
    });
  }

  static async createTodo(userId: string, data: CreateTodoInput["body"]) {
    return prisma.todo.create({
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
  }

  static async updateTodo(
    userId: string,
    id: string,
    data: UpdateTodoInput["body"]
  ) {
    const todoExists = await this.getTodoById(userId, id);
    if (!todoExists) return null;

    return prisma.todo.update({
      where: { deletedAt: null, id, userId },
      data: { ...data, updatedAt: new Date() },
    });
  }

  static async deleteTodo(userId: string, id: string) {
    const todoExists = await this.getTodoById(userId, id);
    if (!todoExists) return null;

    return prisma.todo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
