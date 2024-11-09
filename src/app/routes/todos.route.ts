import { TodosController } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.get("/", TodosController.getTodos);
router.get("/:id", TodosController.getTodoById);
router.post("/", authMiddleware, TodosController.createTodo);

export default router;
