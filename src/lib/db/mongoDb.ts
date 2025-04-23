import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { config } from "../../config/index";

export const connectMongoDB = async () => {
  console.log("connecting to mongo");
  let connection;
  try {
    connection = await mongoose.connect(config.dbUrl);
    console.log("connected to database successfully!!");
    return connection;
  } catch (err) {
    console.log("Error connecting to mongo", err.message);
  }
};
