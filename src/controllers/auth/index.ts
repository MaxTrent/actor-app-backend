import { Router } from "express";
import AuthController from "./authController";

const AuthRouter = Router();

AuthRouter.use("/", AuthController);

export default AuthRouter;
