import { LabelController } from "@/controllers";
import { createLabelSchema } from "@/lib/validations";
import { authMiddleware, validate } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.use(authMiddleware);

router.get("/", LabelController.getLabels);
router.get("/:id", LabelController.getLabelById);
router.post("/", validate(createLabelSchema), LabelController.createLabel);
router.put("/:id", validate(createLabelSchema), LabelController.updateLabel);
router.delete("/:id", LabelController.deleteLabel);

export default router;
