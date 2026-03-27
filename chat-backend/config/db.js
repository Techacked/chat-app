import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("Database Error: MONGO_URI is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database Error:", err.message);
    console.error("Hint: check MongoDB credentials, DB name and network access (IP whitelist)");
    process.exit(1);
  }
};

export default connectDB;
