import ApiResponse from "@/lib/core/api-response";
import todos from "@/lib/static/todos";
import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  return ApiResponse.success(res, todos);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return ApiResponse.notFound(res, "Todo not found");
  }

  return ApiResponse.success(res, todo);
});

export default router;
