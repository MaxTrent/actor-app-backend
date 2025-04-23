import { NextFunction, Request, Response, Router } from "express";
import { UserProfileNamespace } from "../../lib/profile/userProfile";
import ResponseNamespace from "../../lib/utils/responses_namespace";
import { auth } from "middlewares/auth";
import { handleControllerError } from "lib/utils/error";
import { userProfileValidation } from "validations";
import { validate } from "middlewares/validate";
import { uploadProfilePicture } from "middlewares/image-upload";

class UserProfileController {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public async createActorProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { profession, first_name, last_name, actual_age, playable_age, gender, skin_type } =
        req.body;

      const userId = req.user.id;

      const responseCreateActor = await UserProfileNamespace.createActorProfile({
        userId,
        profession,
        first_name,
        last_name,
        actual_age,
        playable_age,
        gender,
        skin_type
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseCreateActor,
        200,
        "Actor profile created successfully"
      );
    } catch (error) {
      console.log("Error creating actor's profile: ", error);
      handleControllerError(error, "Error creating actor's profile", next);
    }
  }

  public async createProducerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        profession,
        first_name,
        last_name,
        film_maker_profile,
        company_name,
        company_email,
        company_phone_number,
        address,
        city,
        state,
        country
      } = req.body;

      const profile_picture = req.file;
      const userId = req.user.id;

      const responseCreateProducer = await UserProfileNamespace.createProducerProfile({
        userId,
        profession,
        first_name,
        last_name,
        film_maker_profile,
        company_name,
        company_email,
        company_phone_number,
        address,
        city,
        state,
        country,
        profile_picture
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        { responseCreateProducer },
        200,
        "Producer profile created successfully"
      );
    } catch (error) {
      console.log("Error creating producer's profile: ", error);
      handleControllerError(error, "Error creating producer's profile", next);
    }
  }

  public async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const responseGetUser = await UserProfileNamespace.getUserProfile({ userId });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseGetUser,
        200,
        "User profile retrieved successfully"
      );
    } catch (error) {
      console.log("Error retrieving user profile: ", error);
      handleControllerError(error, "Error retrieving user profile", next);
    }
  }

  public async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { updateData } = req.body;
      const responseUpdateUser = await UserProfileNamespace.updateUserProfile({
        userId: req.user.id,
        updateData
      });
      return ResponseNamespace.sendSuccessMessage(
        res,
        responseUpdateUser,
        200,
        "User profile updated successfully"
      );
    } catch (error) {
      console.log("Error updating user profile: ", error);
      handleControllerError(error, "Error updating user profile", next);
    }
  }

  public async checkProfileComplete(req: Request, res: Response, next: NextFunction) {
    try {
      const { field_name } = req.body;
      const responseUpdateUser = await UserProfileNamespace.checkProfileComplete({
        userId: req.user.id,
        field_name
      });
      return ResponseNamespace.sendSuccessMessage(
        res,
        responseUpdateUser,
        200,
        "User profile field checked successfully"
      );
    } catch (error) {
      console.log("Error checking user profile field: ", error);
      handleControllerError(error, "Error checking user profile field", next);
    }
  }

  public async returnProfileFieldValues(req: Request, res: Response, next: NextFunction) {
    try {
      const responseUpdateUser = await UserProfileNamespace.returnProfileFieldValues({
        userId: req.user.id
      });
      return ResponseNamespace.sendSuccessMessage(
        res,
        responseUpdateUser,
        200,
        "User profile field checked successfully"
      );
    } catch (error) {
      console.log("Error checking user profile field: ", error);
      handleControllerError(error, "Error checking user profile field", next);
    }
  }

  init() {
    this.router.post(
      "/profile/create/actor",
      auth,
      validate(userProfileValidation.createActorProfile),
      this.createActorProfile
    );
    this.router.post(
      "/profile/create/producer",
      auth,
      // validate(userProfileValidation.createProducerProfile),
      uploadProfilePicture.single("profile_picture"),
      this.createProducerProfile
    );
    this.router.get("/profile/get/:userId", auth, this.getUserProfile);
    this.router.post(
      "/profile/update",
      auth,
      validate(userProfileValidation.updateUserProfile),
      this.updateUserProfile
    );
    this.router.get("/profile/check", auth, this.checkProfileComplete);
    this.router.get("/profile/return", auth, this.returnProfileFieldValues);
  }
}

export default new UserProfileController().router;
