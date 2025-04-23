import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import { successHandler, errorHandler } from "middlewares/morgan";

export default function bootstrap(app: Express) {
  // Set security HTTP headers
  app.use(helmet());
  app.use(successHandler);
  app.use(errorHandler);
  // parse json body
  app.use(express.json());
  // parse url encoded body
  app.use(express.urlencoded({ extended: true }));
  // static assets
  app.use(express.static("public"));
  // sanitize request data
  app.use(mongoSanitize());
  // gzip compression
  app.use(compression());
  // parse cookies
  app.use(cookieParser());
  // enable cors
  app.use(cors());
  app.options("*", cors());
}
