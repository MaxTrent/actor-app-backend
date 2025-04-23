import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: User;
  }
}

declare module "express-serve-static-core" {
  export interface Request {
    user?: User;
  }
}

export interface User {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export {};
