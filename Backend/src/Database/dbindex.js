import mongoose from "mongoose";
import  {DB_Name}  from "../constant.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);
    console.log(`Database Connected  Successfully to DB Host : ${connection.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to database", error);
    process.exit(1)
  }
}

export default connectDB