import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MONGODB CONNECTED SUCCESSFULLY");
  await mongoose.disconnect();
} catch (error) {
  console.error("MONGODB CONNECTION FAILED:");
  console.error(error);
}