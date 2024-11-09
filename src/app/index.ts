import express, { Application } from "express";
import { env } from "./lib/utils";
import { requestLogger } from "./middlewares";
import routes from "./routes";

// Initialize express app
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Initialize routes
app.use("/api", routes);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export default app;
