import todos from "@/lib/static/todos";
import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.json(todos);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
  }

  res.json(todo);
});

export default router;
