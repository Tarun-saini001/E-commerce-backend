import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false

const connectDB = async () => {
  try {
    if (isConnected) return
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.MONGO_DB_NAME,
      autoIndex: true,
    });
    isConnected = true
    console.log("white_check_mark: MongoDB connected:", process.env.MONGO_DB_NAME);

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;