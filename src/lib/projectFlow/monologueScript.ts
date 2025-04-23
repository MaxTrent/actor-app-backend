import ApiError from "common/api-error";
import httpStatus from "http-status";
import monologueScriptModel, { IMonologueScript } from "./models/monologueScriptModel";

export class MonologueScriptNamespace {
  public static async createMonologueScriptByProjectId({
    project_id,
    script,
    title
  }: {
    project_id: string;
    script: string;
    title: string;
  }): Promise<IMonologueScript> {
    try {
      if (!project_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "project ID is required");
      }

      const monologueScript = await monologueScriptModel.create({
        project_id,
        script,
        title
      });

      return monologueScript;
    } catch (error) {
      console.error("Error creating monologue script with project", error);
      throw error;
    }
  }

  public static async createMonologueScriptByRoleId({
    role_id,
    script,
    title
  }: {
    role_id: string;
    script: string;
    title: string;
  }): Promise<IMonologueScript> {
    try {
      if (!role_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "role ID is required");
      }

      const monologueScript = await monologueScriptModel.create({
        role_id,
        script,
        title
      });

      return monologueScript;
    } catch (error) {
      console.error("Error creating monologue script with role", error);
      throw error;
    }
  }

  public static async getMonologueScriptByProjectId(project_id: string): Promise<IMonologueScript> {
    try {
      if (!project_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Project ID is required");
      }

      const monologueScript = await monologueScriptModel.findOne({
        project_id
      });

      if (!monologueScript) {
        throw new ApiError(httpStatus.NOT_FOUND, "Monologue script not found");
      }

      return monologueScript;
    } catch (error) {
      console.error("Error fetching monologue script by project ID", error);
      throw error;
    }
  }

  public static async getMonologueScriptByRoleId(role_id: string): Promise<IMonologueScript> {
    try {
      if (!role_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "role ID is required");
      }

      const monologueScript = await monologueScriptModel.findOne({
        role_id
      });

      if (!monologueScript) {
        throw new ApiError(httpStatus.NOT_FOUND, "Monologue script not found");
      }

      return monologueScript;
    } catch (error) {
      console.error("Error creating monologue script with role", error);
      throw error;
    }
  }
}
