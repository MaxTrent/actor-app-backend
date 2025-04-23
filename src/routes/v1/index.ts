import { Router } from "express";
import EngagementsRouter from "controllers/engagements";
import UsersRouter from "controllers/users";
import AuthRouter from "controllers/auth";
import UserProfileRouter from "controllers/userProfile";
import TimelineRouter from "controllers/timeline";
import MessagingRouter from "controllers/messaging";
import { ProjectRouter, RoleRouter, MonologueScriptRouter } from "controllers/project-flow";

const router = Router();

router.use("/users", UsersRouter);
router.use("/actions", EngagementsRouter);
router.use("/auth", AuthRouter);
router.use("/onboard", UserProfileRouter);
router.use("/timeline", TimelineRouter);
router.use("/messaging", MessagingRouter);
router.use("/project-flow", ProjectRouter, RoleRouter, MonologueScriptRouter);

export default router;
