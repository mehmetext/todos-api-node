import ApiResponse from "@/lib/core/api-response";
import { DEFAULT_PAGE_SIZE } from "@/lib/core/options";
import prisma from "@/lib/core/prisma";
import {
  CreateTodoInput,
  GetTodosInput,
  UpdateTodoInput,
} from "@/lib/validations";
import { Request, Response } from "express";

export default class TodosController {
  static async getTodos(
    req: Request<unknown, unknown, unknown, GetTodosInput["query"]>,
    res: Response
  ) {
    const { sort, q, page = 1 } = req.query;
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
          userId: req.user!.id,
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
          userId: req.user!.id,
          ...(q && {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          }),
        },
      }),
    ]);

    return ApiResponse.success(res, {
      pagination: {
        total,
        totalPage: Math.ceil(total / DEFAULT_PAGE_SIZE),
        hasNext: skip + DEFAULT_PAGE_SIZE < total,
        hasPrev: skip > 0,
      },
      todos,
    });
  }

  static async getTodoById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { deletedAt: null, id, userId: req.user!.id },
    });

    if (!todo) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    return ApiResponse.success(res, todo);
  }

  static async createTodo(
    req: Request<unknown, unknown, CreateTodoInput["body"]>,
    res: Response
  ) {
    const { title, content } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title,
        content,
        userId: req.user!.id,
      },
    });

    return ApiResponse.success(res, todo);
  }

  static async updateTodo(
    req: Request<{ id: string }, unknown, UpdateTodoInput["body"]>,
    res: Response
  ) {
    const { id } = req.params;
    const { title, content, completed } = req.body;

    const todoExists = await prisma.todo.findUnique({
      where: { deletedAt: null, id, userId: req.user!.id },
    });

    if (!todoExists) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: { title, content, completed },
    });

    return ApiResponse.success(res, todo);
  }

  static async deleteTodo(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const todoExists = await prisma.todo.findUnique({
      where: { deletedAt: null, id, userId: req.user!.id },
    });

    if (!todoExists) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    await prisma.todo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return ApiResponse.success(res, null);
  }
}
