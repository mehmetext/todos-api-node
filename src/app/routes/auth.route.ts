import { AuthController } from "@/controllers";
import { loginSchema } from "@/lib/validations";
import { validate } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.post("/login", validate(loginSchema), AuthController.login);

export default router;
