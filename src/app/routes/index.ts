import { Router } from "express";
import auth from "./auth.route";
import todos from "./todos.route";

const router: Router = Router();

router.use("/todos", todos);
router.use("/auth", auth);

export default router;
