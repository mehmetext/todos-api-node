import express, { Application } from "express";
import routes from "./routes";
import { env } from "./lib/utils";

// Initialize express app
const app: Application = express();

// Initialize routes
app.use("/api", routes);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export default app;
