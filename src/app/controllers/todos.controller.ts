import ApiResponse from "@/lib/core/api-response";
import prisma from "@/lib/core/prisma";
import {
  CreateTodoInput,
  GetTodosInput,
  UpdateTodoInput,
} from "@/lib/validations";
import { Request, Response } from "express";

export default class TodosController {
  static async getTodos(
    req: Request<{}, {}, {}, GetTodosInput["query"]>,
    res: Response
  ) {
    const { sort, q } = req.query;

    const todos = await prisma.todo.findMany({
      where: {
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
        ...(sort === "ascByCompleted" && { completed: "asc" }),
        ...(sort === "descByCompleted" && { completed: "desc" }),
        ...(sort === "ascByTitle" && { title: "asc" }),
        ...(sort === "descByTitle" && { title: "desc" }),
        ...(sort === "ascByContent" && { content: "asc" }),
        ...(sort === "descByContent" && { content: "desc" }),
      },
    });

    return ApiResponse.success(res, todos);
  }

  static async getTodoById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id, userId: req.user!.id },
    });

    if (!todo) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    return ApiResponse.success(res, todo);
  }

  static async createTodo(
    req: Request<{}, {}, CreateTodoInput["body"]>,
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
    req: Request<{ id: string }, {}, UpdateTodoInput["body"]>,
    res: Response
  ) {
    const { id } = req.params;
    const { title, content, completed } = req.body;

    const todoExists = await prisma.todo.findUnique({
      where: { id, userId: req.user!.id },
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
      where: { id, userId: req.user!.id },
    });

    if (!todoExists) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    await prisma.todo.delete({ where: { id } });

    return ApiResponse.success(res, null);
  }
}
