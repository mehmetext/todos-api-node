import { TodosController } from "@/controllers";
import { Router, Request } from "express";

const router: Router = Router();

router.get("/", TodosController.getTodos);
router.get("/:id", TodosController.getTodoById);

export default router;
