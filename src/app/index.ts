import express, { Application } from "express";
import env from "./utils/env.util";

const app: Application = express();

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export default app;
