import { NextFunction, Request, Response, Router } from "express";
import ResponseNamespace from "../../lib/utils/responses_namespace";
import { auth } from "middlewares/auth";
import { handleControllerError } from "lib/utils/error";
import { ProjectNamespace } from "lib/projectFlow/project";
import { validate } from "middlewares/validate";
import { projectFlowValidation } from "validations";
import { uploadProjectThumbnail } from "middlewares/image-upload";
import { checkIfUserIsProducer } from "middlewares/checkUserProfession";

class ProjectController {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public async createNewProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { project_name, description } = req.body;
      const thumbnail = req.file;
      const producer_id = req.user.id;

      const responseCreateProject = await ProjectNamespace.createNewProject({
        producer_id,
        project_name,
        description,
        thumbnail: thumbnail
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseCreateProject,
        200,
        "Project created successfully"
      );
    } catch (error) {
      console.log("Error creating project: ", error);
      handleControllerError(error, "Error creating project", next);
    }
  }

  public async getAllProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const producer_id = req.params.producer_id;
      const responseGetProject = await ProjectNamespace.getAllProjects(producer_id);

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseGetProject,
        200,
        "Project retrieved successfully"
      );
    } catch (error) {
      console.log("Error getting all projects: ", error);
      handleControllerError(error, "Error getting all projects", next);
    }
  }

  public async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project_id = req.params.project_id;
      const responseGetProject = await ProjectNamespace.getProject(project_id);

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseGetProject,
        200,
        "Project retrieved successfully"
      );
    } catch (error) {
      console.log("Error getting project: ", error);
      handleControllerError(error, "Error getting project", next);
    }
  }

  public async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { project_name, description, project_id } = req.body;
      const producer_id = req.user.id;
      const thumbnail = req.file;

      const responseUpdateProject = await ProjectNamespace.updateProject({
        project_id,
        producer_id,
        thumbnail,
        project_name,
        description
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseUpdateProject,
        200,
        "Project updated successfully"
      );
    } catch (error) {
      console.log("Error updating projects: ", error);
      handleControllerError(error, "Error updating projects", next);
    }
  }

  public async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project_id = req.body.project_id;
      const producer_id = req.user.id;

      const responseDeleteProject = await ProjectNamespace.deleteProject({
        project_id,
        producer_id
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responseDeleteProject,
        200,
        "Project deleted successfully"
      );
    } catch (error) {
      console.log("Error deleting projects: ", error);
      handleControllerError(error, "Error deleting projects", next);
    }
  }

  public async publishProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { project_id, cast_start, cast_end } = req.body;
      const producer_id = req.user.id;

      const responsePublishProject = await ProjectNamespace.publishProject({
        project_id,
        producer_id,
        cast_start,
        cast_end
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        responsePublishProject,
        200,
        "Project published successfully"
      );
    } catch (error) {
      console.log("Error publishing projects: ", error);
      handleControllerError(error, "Error publishing projects", next);
    }
  }

  init() {
    this.router.post(
      "/project/create",
      auth,
      uploadProjectThumbnail.single("thumbnail"),
      this.createNewProject.bind(this)
    );
    this.router.get(
      "/project/get/all/:producer_id",
      auth,
      validate(projectFlowValidation.getAllProjects),
      this.getAllProjects
    );
    this.router.get(
      "/project/get/:project_id",
      auth,
      validate(projectFlowValidation.getProject),
      this.getProject
    );
    this.router.put(
      "/project/update",
      auth,
      validate(projectFlowValidation.updateProject),
      uploadProjectThumbnail.single("thumbnail"),
      checkIfUserIsProducer,
      this.updateProject
    );
    this.router.delete(
      "/project/delete",
      auth,
      checkIfUserIsProducer,
      validate(projectFlowValidation.deleteProject),
      this.deleteProject
    );
    this.router.put(
      "/project/publish",
      auth,
      checkIfUserIsProducer,
      validate(projectFlowValidation.publishProject),
      this.publishProject
    );
  }
}

export default new ProjectController().router;
