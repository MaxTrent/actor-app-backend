import { Router } from "express";
import OnboardingController from "./onboardingController";

const UsersRouter = Router();

UsersRouter.use("/onboarding", OnboardingController);

export default UsersRouter;
