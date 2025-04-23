import ApiError from "common/api-error";
import httpStatus from "http-status";
import invitationModel, { IInvitation, IStatus } from "./models/invitationModel";

export class InvitationNamespace {
  public static async InviteActorToProjectByProducerId({
    producer_id,
    actor_id,
    project_id
  }: {
    producer_id: string;
    actor_id: string;
    project_id: string;
  }): Promise<IInvitation> {
    try {
      if (!producer_id || !actor_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "a user ID parameter is missing");
      }

      const invitation = await invitationModel.create({
        producer_id,
        actor_id,
        project_id
      });

      return invitation;
    } catch (error) {
      console.error("Error creating application with project", error);
      throw error;
    }
  }

  public static async InviteActorToRoleByProducerId({
    producer_id,
    actor_id,
    project_id,
    role_id
  }: {
    producer_id: string;
    actor_id: string;
    project_id: string;
    role_id: string;
  }): Promise<IInvitation> {
    try {
      if (!producer_id || !actor_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "a user ID parameter is missing");
      }

      const invitation = await invitationModel.create({
        producer_id,
        actor_id,
        project_id,
        role_id
      });

      return invitation;
    } catch (error) {
      console.error("Error creating application with project", error);
      throw error;
    }
  }

  public static async getAllInvitationsByActorId(actor_id: string): Promise<IInvitation[]> {
    try {
      if (!actor_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "actor ID is required");
      }

      const invitation = await invitationModel.find({ actor_id });

      if (!invitation) {
        throw new ApiError(httpStatus.NOT_FOUND, "No invitation found");
      }

      return invitation;
    } catch (error) {
      console.error("Error getting invitation", error);
      throw error;
    }
  }

  public static async acceptOrRejectInvitationRole({
    actor_id,
    role_id,
    status
  }: {
    actor_id: string;
    role_id: string;
    status: IStatus;
  }): Promise<IInvitation> {
    try {
      if (!actor_id || !role_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "actor ID or role ID is required");
      }

      if (!status) {
        throw new ApiError(httpStatus.BAD_REQUEST, "you have to accept or reject request");
      }

      const roleActorCheck = { actor_id, role_id };

      const invitation = await invitationModel.findOneAndUpdate(
        roleActorCheck,
        { status },
        { new: true }
      );

      if (!invitation) {
        throw new ApiError(httpStatus.NOT_FOUND, "Invitation not found");
      }

      return invitation;
    } catch (error) {
      console.error("Error accepting or rejecting invitation", error);
      throw error;
    }
  }

  public static async acceptOrRejectInvitationProject({
    actor_id,
    project_id,
    status
  }: {
    actor_id: string;
    project_id: string;
    status: IStatus;
  }): Promise<IInvitation> {
    try {
      if (!actor_id || !project_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "actor ID or role ID is required");
      }

      if (!status) {
        throw new ApiError(httpStatus.BAD_REQUEST, "you have to accept or reject request");
      }

      const roleActorCheck = { actor_id, project_id };

      const invitation = await invitationModel.findOneAndUpdate(
        roleActorCheck,
        { status },
        { new: true }
      );

      if (!invitation) {
        throw new ApiError(httpStatus.NOT_FOUND, "Invitation not found");
      }

      return invitation;
    } catch (error) {
      console.error("Error accepting or rejecting invitation", error);
      throw error;
    }
  }
}
