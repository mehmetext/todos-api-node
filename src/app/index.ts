import express, { Application } from "express";
import { env } from "./lib/utils";
import { requestLoggerMiddleware } from "./middlewares";
import routes from "./routes";

// Initialize express app
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware);

// Initialize routes
app.use("/api", routes);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export default app;
