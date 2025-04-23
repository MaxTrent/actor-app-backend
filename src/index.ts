import { createServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import { config } from "config";
import app from "app";
import logger from "config/logger";
import { initializeSocketIO } from "startup/socket.io";

let httpServer: Server = createServer(app);

// Set up Socket.io connnection
const io = new SocketIOServer(httpServer, {
  pingTimeout: 100000
});

// Initialize Socket.io
initializeSocketIO(io);

// Mount Socket.io instance on the app
app.set("io", io);

const startServer = () => {
  mongoose.connect(config.dbUrl).then(() => {
    logger.info("Connected to MongoDB");
    httpServer.listen(config.port, () => {
      logger.info(`🚀 Server running at http://localhost:${config.port}`);
    });
  });
};

const exitHandler = () => {
  if (httpServer) {
    httpServer.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (httpServer) {
    httpServer.close();
  }
});

startServer();
