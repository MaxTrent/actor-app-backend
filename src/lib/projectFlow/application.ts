import ApiError from "common/api-error";
import httpStatus from "http-status";
import applicationModel, { IApplication } from "./models/applicationModel";

export class ApplicationNamespace {
  public static async createNewApplicationByProjectId({
    actor_id,
    project_id,
    monologue_post
  }: {
    actor_id: string;
    project_id: string;
    monologue_post: string;
  }): Promise<IApplication> {
    try {
      if (!actor_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Actor ID is required");
      }

      if (!project_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Project ID is required");
      }

      const application = await applicationModel.create({
        actor_id,
        project_id,
        monologue_post
      });

      return application;
    } catch (error) {
      console.error("Error creating application with project", error);
      throw error;
    }
  }

  public static async createNewApplicationByRoleId({
    actor_id,
    role_id,
    monologue_post
  }: {
    actor_id: string;
    role_id: string;
    monologue_post: string;
  }): Promise<IApplication> {
    try {
      if (!actor_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Actor ID is required");
      }

      if (!role_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Project ID is required");
      }

      const application = await applicationModel.create({
        actor_id,
        role_id,
        monologue_post
      });

      return application;
    } catch (error) {
      console.error("Error creating application with project", error);
      throw error;
    }
  }

  public static async getAllApplicationsByActorId(actor_id: string): Promise<IApplication[]> {
    try {
      if (!actor_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Actor ID is required");
      }

      const applications = await applicationModel.find({ actor_id });

      if (!applications) {
        throw new ApiError(httpStatus.NOT_FOUND, "No applications found with this Actor");
      }

      return applications;
    } catch (error) {
      console.error("Error getting applications with Actor id", error);
      throw error;
    }
  }

  public static async getAllApplicationsByProjectId(project_id: string): Promise<IApplication[]> {
    try {
      if (!project_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "project ID is required");
      }

      const applications = await applicationModel.find({ project_id });

      if (!applications) {
        throw new ApiError(httpStatus.NOT_FOUND, "No applications found with this project");
      }

      return applications;
    } catch (error) {
      console.error("Error getting applications with project id", error);
      throw error;
    }
  }

  public static async getAllApplicationsByRoleId(role_id: string): Promise<IApplication[]> {
    try {
      if (!role_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "role ID is required");
      }

      const applications = await applicationModel.find({ role_id });

      if (!applications) {
        throw new ApiError(httpStatus.NOT_FOUND, "No applications found with role");
      }

      return applications;
    } catch (error) {
      console.error("Error getting applications with role id", error);
      throw error;
    }
  }
}
