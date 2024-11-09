import { TodosController } from "@/controllers";
import {
  createTodoSchema,
  getTodosSchema,
  updateTodoSchema,
} from "@/lib/validations";
import { authMiddleware, validate } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.use(authMiddleware);

router.get("/", validate(getTodosSchema), TodosController.getTodos);
router.get("/:id", TodosController.getTodoById);
router.post("/", validate(createTodoSchema), TodosController.createTodo);
router.put("/:id", validate(updateTodoSchema), TodosController.updateTodo);
router.delete("/:id", TodosController.deleteTodo);

export default router;
