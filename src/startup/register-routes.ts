import { Express } from "express";
import router from "routes/v1";

// Register all routes with application
export default function registerRoutes(app: Express) {
  app.get("/status", (req, res) => {
    res.json({
      success: true,
      message: "OK",
      timestamp: new Date().toISOString(),
      IP: req.ip,
      URL: req.originalUrl
    });
  });
  app.use("/v1/api", router);
}
