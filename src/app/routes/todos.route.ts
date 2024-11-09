import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Todos endpoint",
  });
});

export default router;
