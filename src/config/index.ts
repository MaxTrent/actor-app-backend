import dotenv from "dotenv";
import vine, { errors } from "@vinejs/vine";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });

let envVars: any;

async function getEnvVars() {
  try {
    const envSchema = vine.object({
      NODE_ENV: vine.enum(["development", "production"]),
      DB_CONNECTION_URL: vine.string(),
      PORT: vine.number(),
      SENDGRID_API_KEY: vine.string(),
      SENDER_EMAIL: vine.string().email(),
      OPENAI_API_KEY: vine.string(),
      ACCESS_TOKEN_SECRET: vine.string(),
      REFRESH_TOKEN_SECRET: vine.string(),
      TWILIO_AUTH_TOKEN: vine.string(),
      TWILIO_ACCOUNT_SID: vine.string(),
      TWILIO_PHONE_NUMBER: vine.string(),
      CLOUDINARY_CLOUD_NAME: vine.string(),
      CLOUDINARY_API_KEY: vine.string(),
      CLOUDINARY_API_SECRET: vine.string(),
      CLOUDINARY_POSTS_FOLDER: vine.string(),
      CLOUDINARY_PROFILE_PIC_FOLDER: vine.string(),
      CLOUDINARY_PROJECTS_FOLDER: vine.string()
    });

    const validator = vine.compile(envSchema);
    envVars = await validator.validate(process.env);
    return envVars;
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new Error(`Env config vaildation error 👨‍💻: ${JSON.stringify(error.messages)}`);
    }
  }
}

envVars = await getEnvVars();

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  dbUrl: envVars.DB_CONNECTION_URL,
  sendgridApiKey: envVars.SENDGRID_API_KEY,
  sendgridSender: envVars.SENDER_EMAIL,
  OPENAI_API_KEY: envVars.OPENAI_API_KEY,
  accessTokenSecret: envVars.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: envVars.REFRESH_TOKEN_SECRET,
  senderEmail: envVars.SENDER_EMAIL,
  twilioAuthToken: envVars.TWILIO_AUTH_TOKEN,
  twilioAccountId: envVars.TWILIO_ACCOUNT_SID,
  twilioPhoneNumber: envVars.TWILIO_PHONE_NUMBER,
  cloudinaryCloudName: envVars.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: envVars.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET,
  cloudinaryPostsFolder: envVars.CLOUDINARY_POSTS_FOLDER,
  cloudinaryProfilePictureFolder: envVars.CLOUDINARY_PROFILE_PIC_FOLDER,
  cloudinaryProjectsFolder: envVars.CLOUDINARY_PROJECTS_FOLDER
};

export { config };
