import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MongoDBURI = process.env.MONGODB_URI;

export const connectMongoDb = async () => {
  try {
    if (!MongoDBURI) {
      throw new Error("❌ MONGO_URI is missing in environment variables");
    }
    await mongoose.connect(MongoDBURI);
    console.log("🛜 MongoDB connected successfully!");
  } catch (error) {
    console.error("🚨 MongoDB connection failed:", error);
    process.exit(1);
  }
};
