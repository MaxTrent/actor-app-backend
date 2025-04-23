import { Router } from "express";
import EngagementsController from "./engagementsController";

const EngagementsRouter = Router();

EngagementsRouter.use("/engagements", EngagementsController);

export default EngagementsRouter;
