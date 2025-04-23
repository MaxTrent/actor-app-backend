import ApiError from "common/api-error";
import httpStatus from "http-status";
import projectModel, { IProject } from "./models/projectModel";
import MediaUpload from "lib/engagements/models/mediaUpload";

export class ProjectNamespace {
  public static async createNewProject({
    producer_id,
    project_name,
    description,
    thumbnail
  }: {
    producer_id: string;
    project_name: string;
    description: string;
    thumbnail: any;
  }): Promise<IProject> {
    try {
      console.log("thumbnail", thumbnail);

      if (!producer_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
      }

      if (!thumbnail || !thumbnail.path || !thumbnail.size || !thumbnail.filename) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Thumbnail information is missing or incomplete"
        );
      }

      const imageUrl = thumbnail.path;
      const fileSize = (thumbnail.size / 1000000).toFixed(2); // Use toFixed(2) instead of toPrecision(2)
      const resourceId = thumbnail.filename;

      if (isNaN(Number(fileSize))) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid file size");
      }

      const mediaUpload = await MediaUpload.create({
        user_id: producer_id,
        cloud_provider: "cloudinary",
        resource_id: resourceId,
        media_type: "image",
        image_url: imageUrl,
        file_size: Number(fileSize), // Ensure file_size is a number
        uploaded_at: new Date()
      });

      const newProject = await projectModel.create({
        producer_id,
        project_name,
        description,
        thumbnail: mediaUpload.image_url
      });

      return newProject;
    } catch (error) {
      console.error("Error creating project", error);
      throw error;
    }
  }

  public static async getAllProjects(producer_id: string): Promise<IProject[]> {
    try {
      if (!producer_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
      }

      const projects = await projectModel.find({ producer_id });
      if (!projects) {
        throw new ApiError(httpStatus.NOT_FOUND, "No projects found with id " + producer_id);
      }
      return projects;
    } catch (error) {
      console.error("Error getting projects:", error);
      throw error;
    }
  }

  public static async getProject(project_id: string): Promise<IProject> {
    try {
      console.log("project_id", project_id);
      if (!project_id || project_id.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "project ID is required");
      }

      const project = await projectModel.findById(project_id);
      if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "project not found");
      }
      return project;
    } catch (error) {
      console.error("Error getting that project:", error);
      throw error;
    }
  }

  public static async updateProject({
    producer_id,
    project_id,
    thumbnail,
    project_name,
    description
  }: {
    producer_id: string;
    project_id: string;
    thumbnail: any;
    project_name: string;
    description: string;
  }): Promise<IProject> {
    try {
      if (!project_id || !producer_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "an ID parameter is missing");
      }

      const findProject = await projectModel.findOne({ producer_id, _id: project_id });

      if (!findProject) {
        throw new ApiError(httpStatus.BAD_REQUEST, "project not found with parameters");
      }

      const imageUrl = thumbnail.path;
      const fileSize = (thumbnail.size / 1000000).toPrecision(2);
      const resourceId = thumbnail.filename;

      const mediaUpload = await MediaUpload.create({
        user_id: producer_id,
        cloud_provider: "cloudinary",
        resource_id: resourceId,
        media_type: "image",
        image_url: imageUrl,
        file_size: fileSize,
        uploaded_at: new Date()
      });

      const updatedProject = await projectModel.findOneAndUpdate(
        { producer_id, _id: project_id },
        { project_name, description, thumbnail: mediaUpload.image_url },
        {
          new: true
        }
      );

      return updatedProject;
    } catch (error) {
      console.error("Error updating project with id:", error);
      throw error;
    }
  }

  public static async deleteProject({
    producer_id,
    project_id
  }: {
    producer_id: string;
    project_id: string;
  }): Promise<IProject> {
    try {
      if (!project_id || !producer_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "an ID parameter is missing");
      }
      const project = await projectModel.findOne({ producer_id, _id: project_id });

      if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "No project found with id " + producer_id);
      }

      const deletedProject = await projectModel.findOneAndDelete({ _id: project_id, producer_id });
      return deletedProject;
    } catch (error) {
      console.error("Error deleting project with id:", error);
      throw error;
    }
  }

  public static async publishProject({
    producer_id,
    project_id,
    cast_start,
    cast_end
  }: {
    producer_id: string;
    project_id: string;
    cast_start: string;
    cast_end: string;
  }): Promise<IProject> {
    try {
      if (!project_id || !producer_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "An ID parameter is missing");
      }

      if (!cast_start || !cast_end) {
        throw new ApiError(httpStatus.BAD_REQUEST, "A cast date must be set");
      }
      console.log("producer_id", producer_id, "producer_id", project_id);
      const project = await projectModel.findOne({ producer_id, _id: project_id });

      if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "No project found with the given ID");
      }

      const publishedProject = await projectModel.findOneAndUpdate(
        { _id: project_id, producer_id },
        { published: true, cast_start, cast_end },
        { new: true }
      );

      return publishedProject;
    } catch (error) {
      console.error(
        "Error publishing project with ID:",
        project_id,
        "Producer ID:",
        producer_id,
        error
      );
      throw error;
    }
  }
}
