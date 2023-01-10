import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${connect.connection.host}`.cyan.underline)
  } catch (error) { 
    console.log(error)
    process.exit();
  }
};

export default connectDB;