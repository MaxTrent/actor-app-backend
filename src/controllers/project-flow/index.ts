import { Router } from "express";
import ProjectController from "./projectController";
import RoleController from "./roleController";
import MonologueScriptController from "./monologueScriptController";

export const ProjectRouter = Router();
export const RoleRouter = Router();
export const MonologueScriptRouter = Router();

ProjectRouter.use("/", ProjectController);
RoleRouter.use("/", RoleController);
MonologueScriptRouter.use("/", MonologueScriptController);
