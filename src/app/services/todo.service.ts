import { DEFAULT_PAGE_SIZE } from "@/lib/core/options";
import prisma from "@/lib/core/prisma";
import {
  CreateTodoInput,
  GetTodosInput,
  UpdateTodoInput,
} from "@/lib/validations";

export default class TodoService {
  static async getTodos(userId: string, query: GetTodosInput["query"]) {
    const { sort, q, page = 1 } = query;
    const skip = (page - 1) * DEFAULT_PAGE_SIZE;

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          deletedAt: null,
          userId,
          ...(q && {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          }),
        },
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
        take: DEFAULT_PAGE_SIZE,
      }),
      prisma.todo.count({
        where: {
          deletedAt: null,
          userId,
          ...(q && {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          }),
        },
      }),
    ]);

    return {
      pagination: {
        total,
        totalPage: Math.ceil(total / DEFAULT_PAGE_SIZE),
        hasNext: skip + DEFAULT_PAGE_SIZE < total,
        hasPrev: skip > 0,
      },
      todos,
    };
  }

  static async getTodoById(userId: string, id: string) {
    return prisma.todo.findUnique({ where: { deletedAt: null, id, userId } });
  }

  static async createTodo(userId: string, data: CreateTodoInput["body"]) {
    return prisma.todo.create({ data: { ...data, userId } });
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
