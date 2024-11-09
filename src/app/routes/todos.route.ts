import { TodosController } from "@/controllers";
import ApiResponse from "@/lib/core/api-response";
import { Router, Request } from "express";

const router: Router = Router();

router.get("/", async (req, res) => {
  const todos = await TodosController.getTodos();
  return ApiResponse.success(res, todos);
});

router.get("/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const todo = await TodosController.getTodoById(id);

  if (!todo) {
    return ApiResponse.notFound(res, "Todo not found");
  }

  return ApiResponse.success(res, todo);
});

export default router;
