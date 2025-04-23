import ApiError from "common/api-error";
import httpStatus from "http-status";
import roleModel, { IEndorsement, IGender, IRole, ISkinType } from "./models/roleModel";

export class RoleNamespace {
  public static async createNewRole({
    project_id,
    role_name
  }: {
    project_id: string;
    role_name: string;
  }): Promise<IRole> {
    try {
      if (!project_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Project ID is required");
      }

      if (!role_name) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Role name is required");
      }

      const role = await roleModel.create({
        project_id,
        role_name
      });

      return role;
    } catch (error) {
      console.error("Error creating role", error);
      throw error;
    }
  }

  public static async getAllRoles(project_id: string): Promise<IRole[]> {
    try {
      if (!project_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Project ID is required");
      }

      const roles = await roleModel.find({ project_id });
      if (!roles) {
        throw new ApiError(httpStatus.NOT_FOUND, "No roles found");
      }

      return roles;
    } catch (error) {
      console.error("Error getting roles", error);
      throw error;
    }
  }

  public static async getRole(role_id: string): Promise<IRole> {
    try {
      if (!role_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Role ID is required");
      }
      const role = await roleModel.findById(role_id);

      if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, "No role found with the given ID");
      }

      return role;
    } catch (error) {
      console.error("Error getting role with ID:", role_id, error);
      throw error;
    }
  }

  public static async updateRole({
    role_id,
    updateData
  }: {
    role_id: string;
    updateData: Partial<{
      role_name: string;
      gender: IGender;
      avg_rating: number;
      country: string;
      actor_lookalike: string;
      endorsement: IEndorsement;
      category: string;
      skin_type: ISkinType;
      distance: number;
      playable_age: string;
      height: string;
      cast_start: Date;
      cast_end: Date;
    }>;
  }): Promise<IRole | null> {
    try {
      if (!role_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "an ID parameter is missing");
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Update data is required");
      }

      const checkRole = await roleModel.findById(role_id);

      if (!checkRole) {
        throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
      }

      const updatedRole = await roleModel.findByIdAndUpdate(role_id, updateData, {
        new: true
      });

      return updatedRole;
    } catch (error) {
      console.error("Error updating role", error);
      throw error;
    }
  }

  public static async deleteRole(role_id: string) {
    try {
      if (!role_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Role ID is required");
      }

      const deletedRole = await roleModel.findOneAndDelete({ _id: role_id });

      if (!deletedRole) {
        throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
      }

      return deletedRole;
    } catch (error) {
      console.error("Error deleting role", error);
      throw error;
    }
  }
}
