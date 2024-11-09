import todos from "@/lib/static/todos";
import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.json(todos);
});

export default router;
