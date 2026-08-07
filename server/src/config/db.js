import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseReplicaSet, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

export default connectDB;