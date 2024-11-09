import { TodosController } from "@/controllers";
import { Router } from "express";

const router: Router = Router();

router.get("/", TodosController.getTodos);
router.get("/:id", TodosController.getTodoById);
router.post("/", /* authMiddleware, */ TodosController.createTodo);

export default router;
