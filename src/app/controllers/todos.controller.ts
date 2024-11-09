import ApiResponse from "@/lib/core/api-response";
import todos from "@/lib/static/todos";
import wait from "@/lib/utils/wait.util";
import { CreateTodoInput, UpdateTodoInput } from "@/lib/validations";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export default class TodosController {
  static async getTodos(req: Request, res: Response) {
    await wait(200);
    return ApiResponse.success(res, todos);
  }

  static getTodoById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
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

    if (!todo) {
      return ApiResponse.notFound(res, "Todo not found");
    }

    todo.title = title ?? todo.title;
    todo.content = content ?? todo.content;
    todo.completed = completed ?? todo.completed;
    todo.updatedAt = new Date();

    return ApiResponse.success(res, todo);
  }
}
