import ApiResponse from "@/lib/core/api-response";
import todos from "@/lib/static/todos";
import { CreateTodoInput, UpdateTodoInput } from "@/lib/validations";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export default class TodosController {
  static async getTodos(req: Request, res: Response) {
    const filteredTodos = todos.filter((todo) => todo.userId === req.user!.id);

    return ApiResponse.success(res, filteredTodos);
  }

  static getTodoById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const todo = todos.find((todo) => todo.id === id);

    if (!todo || todo.userId !== req.user!.id) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    return ApiResponse.success(res, todo);
  }

  static createTodo(req: Request<{}, {}, CreateTodoInput>, res: Response) {
    const { title, content } = req.body;

    const todo = {
      id: uuidv4(),
      title,
      content,
      userId: req.user!.id,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    todos.push(todo);

    return ApiResponse.success(res, todo);
  }

  static updateTodo(
    req: Request<{ id: string }, {}, UpdateTodoInput>,
    res: Response
  ) {
    const { id } = req.params;
    const { title, content, completed } = req.body;

    const todo = todos.find((todo) => todo.id === id);

    if (!todo || todo.userId !== req.user!.id) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    todo.title = title ?? todo.title;
    todo.content = content ?? todo.content;
    todo.completed = completed ?? todo.completed;
    todo.updatedAt = new Date();

    return ApiResponse.success(res, todo);
  }

  static deleteTodo(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const todo = todos.find((todo) => todo.id === id);

    if (!todo || todo.userId !== req.user!.id) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    // Remove the todo from the array
    // todos = todos.filter((todo) => todo.id !== id);

    return ApiResponse.success(res, null);
  }
}
