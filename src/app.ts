import express from "express";
import { registerErrorHandlers } from "middlewares/error-handler";
import bootstrap from "startup/bootstrap";
import registerRoutes from "startup/register-routes";

const app = express();

// initialize application
bootstrap(app);

// register routes
registerRoutes(app);

// error handlers
registerErrorHandlers(app);

export default app;
