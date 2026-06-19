import mongoose from "mongoose";

/*
  Connect to MongoDB
*/

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      "Connected to MongoDB successfully"
    );
  } catch (error) {
    console.error(
      "MongoDB Connection Error:",
      error.message
    );

    process.exit(1);
  }
};

export default connectDB;