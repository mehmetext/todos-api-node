import { API } from "@/lib/constants";
import { Router } from "express";
import auth from "./auth.route";
import label from "./label.route";
import todos from "./todos.route";

const router: Router = Router();

router.use(API.ROUTES.TODOS, todos);
router.use(API.ROUTES.AUTH, auth);
router.use(API.ROUTES.LABELS, label);
export default router;
