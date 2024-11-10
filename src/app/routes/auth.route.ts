import { AuthController } from "@/controllers";
import { loginSchema, registerSchema } from "@/lib/validations";
import { validate } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.post("/register", validate(registerSchema), AuthController.register);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;
