import { Router } from "express";
import MessagingController from "./messagingController";

const MessagingRouter = Router();

MessagingRouter.use("/", MessagingController);

export default MessagingRouter;
