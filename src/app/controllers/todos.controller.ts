import ApiResponse from "@/lib/core/api-response";
import todos from "@/lib/static/todos";
import {
  CreateTodoInput,
  GetTodosInput,
  UpdateTodoInput,
} from "@/lib/validations";
import { Todo } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export default class TodosController {
  static async getTodos(
    req: Request<{}, {}, {}, GetTodosInput["query"]>,
    res: Response
  ) {
    const { sort } = req.query;

    const filteredTodos = todos
      .filter((todo) => todo.userId === req.user!.id)
      .filter(
        (todo) =>
          todo.title
            .toLocaleLowerCase()
            .includes(req.query.q?.toLocaleLowerCase() ?? "") ||
          todo.content
            ?.toLocaleLowerCase()
            .includes(req.query.q?.toLocaleLowerCase() ?? "")
      );

    if (sort) {
      filteredTodos.sort((a, b) => {
        if (sort === "ascByCreatedAt") {
          return a.createdAt.getTime() - b.createdAt.getTime();
        } else if (sort === "descByCreatedAt") {
          return b.createdAt.getTime() - a.createdAt.getTime();
        } else if (sort === "ascByCompleted") {
          return a.completed ? 1 : -1;
        } else if (sort === "descByCompleted") {
          return b.completed ? 1 : -1;
        } else if (sort === "ascByTitle") {
          return a.title.localeCompare(b.title);
        } else if (sort === "descByTitle") {
          return b.title.localeCompare(a.title);
        } else if (sort === "ascByContent") {
          return (a.content ?? "").localeCompare(b.content ?? "");
        } else if (sort === "descByContent") {
          return (b.content ?? "").localeCompare(a.content ?? "");
        }

        return 0;
      });
    }

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

  static createTodo(
    req: Request<{}, {}, CreateTodoInput["body"]>,
    res: Response
  ) {
    const { title, content } = req.body;

    const todo: Todo = {
      id: uuidv4(),
      title,
      content: content ?? null,
      userId: req.user!.id,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    todos.push(todo);

    return ApiResponse.success(res, todo);
  }

  static updateTodo(
    req: Request<{ id: string }, {}, UpdateTodoInput["body"]>,
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
