import { NextFunction, Request, Response, Router } from "express";
import ResponseNamespace from "../../lib/utils/responses_namespace";
import { auth } from "middlewares/auth";
import { handleControllerError } from "lib/utils/error";
import { checkIfUserIsProducer } from "middlewares/checkUserProfession";
import { validate } from "middlewares/validate";
import { RoleNamespace } from "lib/projectFlow/role";
import { projectFlowValidation } from "validations";

class RoleController {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public async createNewRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { project_id, role_name } = req.body;

      const responseCreateRole = await RoleNamespace.createNewRole({
        project_id,
        role_name
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseCreateRole,
        200,
        "Role created successfully"
      );
    } catch (error) {
      console.log("Error creating role: ", error);
      handleControllerError(error, "Error creating role", next);
    }
  }

  public async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const project_id = req.params.project_id;
      const responseGetRoles = await RoleNamespace.getAllRoles(project_id);

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseGetRoles,
        200,
        "Roles retrieved successfully"
      );
    } catch (error) {
      console.log("Error getting all roles: ", error);
      handleControllerError(error, "Error getting all roles", next);
    }
  }

  public async getRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role_id = req.params.role_id;

      const responseGetRole = await RoleNamespace.getRole(role_id);

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseGetRole,
        200,
        "Role retrieved successfully"
      );
    } catch (error) {
      console.log("Error getting role: ", error);
      handleControllerError(error, "Error getting role", next);
    }
  }

  public async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { updateData, role_id } = req.body;

      const responseUpdateRole = await RoleNamespace.updateRole({
        role_id,
        updateData
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseUpdateRole,
        200,
        "Role updated successfully"
      );
    } catch (error) {
      console.log("Error updating role: ", error);
      handleControllerError(error, "Error updating role", next);
    }
  }

  public async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role_id = req.body.role_id;

      const responseDeleteRole = await RoleNamespace.deleteRole(role_id);

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseDeleteRole,
        200,
        "Role deleted successfully"
      );
    } catch (error) {
      console.log("Error deleting roles: ", error);
      handleControllerError(error, "Error deleting roles", next);
    }
  }

  init() {
    this.router.post(
      "/role/create",
      validate(projectFlowValidation.createNewRole),
      auth,
      checkIfUserIsProducer,
      this.createNewRole
    );
    this.router.get(
      "/role/get/all/:project_id",
      validate(projectFlowValidation.getAllRoles),
      auth,
      this.getAllRoles
    );
    this.router.get(
      "/role/get/:role_id",
      validate(projectFlowValidation.getRole),
      auth,
      this.getRole
    );
    this.router.put(
      "/role/update",
      validate(projectFlowValidation.updateRole),
      auth,
      checkIfUserIsProducer,
      this.updateRole
    );
    this.router.delete(
      "/role/delete",
      validate(projectFlowValidation.deleteRole),
      auth,
      checkIfUserIsProducer,
      this.deleteRole
    );
  }
}

export default new RoleController().router;
