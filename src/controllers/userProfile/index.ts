import { Router } from "express";
import UserProfileController from "./userProfileController";

const UserProfileRouter = Router();

UserProfileRouter.use("/user-profile", UserProfileController);

export default UserProfileRouter;
