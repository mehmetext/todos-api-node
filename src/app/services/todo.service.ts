import { API } from "@/lib/constants";
import prisma from "@/lib/core/prisma";
import { generateRandomHexColor } from "@/lib/utils";
import {
  CreateTodoInput,
  GetTodosInput,
  UpdateTodoInput,
} from "@/lib/validations";
import { Prisma } from "@prisma/client";

export default class TodoService {
  static async getTodos(userId: string, query: GetTodosInput["query"]) {
    const { sort, q, page = 1 } = query;
    const labels = query.labels?.split(",");

    const skip = (page - 1) * API.PAGINATION.DEFAULT_PAGE_SIZE;

    const whereClause: Prisma.TodoWhereInput = {
      deletedAt: null,
      userId,
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
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
          ...(sort === "ascByCreatedAt" && { createdAt: "asc" }),
          ...(sort === "descByCreatedAt" && { createdAt: "desc" }),
          ...(sort === "ascByUpdatedAt" && { updatedAt: "asc" }),
          ...(sort === "descByUpdatedAt" && { updatedAt: "desc" }),
          ...(sort === "ascByCompleted" && { completed: "asc" }),
          ...(sort === "descByCompleted" && { completed: "desc" }),
          ...(sort === "ascByTitle" && { title: "asc" }),
          ...(sort === "descByTitle" && { title: "desc" }),
          ...(sort === "ascByContent" && { content: "asc" }),
          ...(sort === "descByContent" && { content: "desc" }),
        },
        skip,
        take: API.PAGINATION.DEFAULT_PAGE_SIZE,
      }),
      prisma.todo.count({ where: whereClause }),
    ]);

    return {
      pagination: {
        total,
        totalPage: Math.ceil(total / API.PAGINATION.DEFAULT_PAGE_SIZE),
        hasNext: skip + API.PAGINATION.DEFAULT_PAGE_SIZE < total,
        hasPrev: skip > 0,
      },
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
