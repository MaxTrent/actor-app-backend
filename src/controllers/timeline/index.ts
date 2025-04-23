import { Router } from "express";
import TimelineController from "./timelineController";

const TimelineRouter = Router();

TimelineRouter.use("/", TimelineController);

export default TimelineRouter;
