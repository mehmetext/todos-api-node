import ApiResponse from "@/lib/core/api-response";
import {
  CreateTodoInput,
  GetTodosInput,
  UpdateTodoInput,
} from "@/lib/validations";
import { TodoService } from "@/services";
import { Request, Response } from "express";

export default class TodosController {
  static async getTodos(
    req: Request<unknown, unknown, unknown, GetTodosInput["query"]>,
    res: Response
  ) {
    const todos = await TodoService.getTodos(req.user!.id, req.query);
    return ApiResponse.success(res, todos);
  }

  static async getTodoById(req: Request<{ id: string }>, res: Response) {
    const todo = await TodoService.getTodoById(req.user!.id, req.params.id);

    if (!todo) return ApiResponse.notFound(res, "Todo not found");

    return ApiResponse.success(res, todo);
  }

  static async createTodo(
    req: Request<unknown, unknown, CreateTodoInput["body"]>,
    res: Response
  ) {
    const todo = await TodoService.createTodo(req.user!.id, req.body);

    return ApiResponse.success(res, todo);
  }

  static async updateTodo(
    req: Request<{ id: string }, unknown, UpdateTodoInput["body"]>,
    res: Response
  ) {
    const todo = await TodoService.updateTodo(
      req.user!.id,
      req.params.id,
      req.body
    );

    if (!todo) return ApiResponse.notFound(res, "Todo not found");

    return ApiResponse.success(res, todo);
  }

  static async deleteTodo(req: Request<{ id: string }>, res: Response) {
    const todo = await TodoService.deleteTodo(req.user!.id, req.params.id);

    if (!todo) return ApiResponse.notFound(res, "Todo not found");

    return ApiResponse.success(res, null);
  }
}
