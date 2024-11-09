import { TodosController } from "@/controllers";
import { createTodoSchema, updateTodoSchema } from "@/lib/validations";
import { validate } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.get("/", TodosController.getTodos);
router.get("/:id", TodosController.getTodoById);
router.post("/", validate(createTodoSchema), TodosController.createTodo);
router.put("/:id", validate(updateTodoSchema), TodosController.updateTodo);

export default router;
