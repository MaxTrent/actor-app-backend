import { NextFunction, Request, Response, Router } from "express";
import ResponseNamespace from "../../lib/utils/responses_namespace";
import { auth } from "middlewares/auth";
import { handleControllerError } from "lib/utils/error";
import { MonologueScriptNamespace } from "lib/projectFlow/monologueScript";
import { validate } from "middlewares/validate";
import { projectFlowValidation } from "validations";
import { checkIfUserIsProducer } from "middlewares/checkUserProfession";

class MonologueScriptController {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public async createMonologueScriptByProjectId(req: Request, res: Response, next: NextFunction) {
    try {
      const { project_id, script, title } = req.body;

      const responseCreateMonologueScript =
        await MonologueScriptNamespace.createMonologueScriptByProjectId({
          project_id,
          script,
          title
        });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseCreateMonologueScript,
        200,
        "Monologue script created successfully"
      );
    } catch (error) {
      console.log("Error creating monologue script: ", error);
      handleControllerError(error, "Error creating monologue script", next);
    }
  }

  public async createMonologueScriptByRoleId(req: Request, res: Response, next: NextFunction) {
    try {
      const { role_id, script, title } = req.body;

      const responseCreateMonologueScript =
        await MonologueScriptNamespace.createMonologueScriptByRoleId({
          role_id,
          script,
          title
        });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseCreateMonologueScript,
        200,
        "Monologue script created successfully"
      );
    } catch (error) {
      console.log("Error creating monologue script: ", error);
      handleControllerError(error, "Error creating monologue script", next);
    }
  }

  public async getMonologueScriptByProjectId(req: Request, res: Response, next: NextFunction) {
    try {
      const project_id = req.params.project_id;

      const responseGetMonologueScript =
        await MonologueScriptNamespace.getMonologueScriptByProjectId(project_id);

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseGetMonologueScript,
        200,
        "Monologue script created successfully"
      );
    } catch (error) {
      console.log("Error getting monologue script: ", error);
      handleControllerError(error, "Error getting monologue script", next);
    }
  }

  public async getMonologueScriptByRoleId(req: Request, res: Response, next: NextFunction) {
    try {
      const role_id = req.params.role_id;

      const responseGetMonologueScript =
        await MonologueScriptNamespace.getMonologueScriptByRoleId(role_id);

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseGetMonologueScript,
        200,
        "Monologue script created successfully"
      );
    } catch (error) {
      console.log("Error getting monologue script: ", error);
      handleControllerError(error, "Error getting monologue script", next);
    }
  }

  init() {
    this.router.post(
      "/monologue-script/project/create",
      auth,
      checkIfUserIsProducer,
      validate(projectFlowValidation.createMonologueScriptByProjectId),
      this.createMonologueScriptByProjectId
    );
    this.router.post(
      "/monologue-script/role/create",
      auth,
      checkIfUserIsProducer,
      validate(projectFlowValidation.createMonologueScriptByRoleId),
      this.createMonologueScriptByRoleId
    );
    this.router.get(
      "/monologue-script/project/get/:project_id",
      auth,
      validate(projectFlowValidation.getMonologueScriptByProjectId),
      this.getMonologueScriptByProjectId
    );
    this.router.get(
      "/monologue-script/role/get/:role_id",
      auth,
      validate(projectFlowValidation.getMonologueScriptByRoleId),
      this.getMonologueScriptByRoleId
    );
  }
}

export default new MonologueScriptController().router;
