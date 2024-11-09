import { TodosController } from "@/controllers";
import { createTodoSchema } from "@/lib/validations";
import { validate } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.get("/", TodosController.getTodos);
router.get("/:id", TodosController.getTodoById);
router.post("/", validate(createTodoSchema), TodosController.createTodo);

export default router;
