import { Router } from "express";
import todos from "./todos.route";

const router: Router = Router();

router.use("/todos", todos);

export default router;
