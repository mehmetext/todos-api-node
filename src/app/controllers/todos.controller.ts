import { Request, Response } from "express";
import ApiResponse from "@/lib/core/api-response";
import todos from "@/lib/static/todos";
import wait from "@/lib/utils/wait.util";

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
}
