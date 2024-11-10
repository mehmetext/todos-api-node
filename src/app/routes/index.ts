import { API } from "@/lib/constants";
import { Router } from "express";
import auth from "./auth.route";
import todos from "./todos.route";

const router: Router = Router();

router.use(API.ROUTES.TODOS, todos);
router.use(API.ROUTES.AUTH, auth);

export default router;
