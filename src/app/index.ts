import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import "express-async-errors";
import helmet from "helmet";
import hpp from "hpp";
import { API } from "./lib/constants";
import corsOptions from "./lib/core/cors";
import env from "./lib/core/env";
import rateLimiter from "./lib/core/rate-limiter";
import { errorHandlerMiddleware, requestLoggerMiddleware } from "./middlewares";
import routes from "./routes";

// Initialize express app
const app: Application = express();

// Middlewares
app.use(helmet());
app.use(hpp());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware);

// Initialize routes
app.use(API.ROUTES.BASE, routes);

// Error handling middleware
app.use(errorHandlerMiddleware);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export default app;
