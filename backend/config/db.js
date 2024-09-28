import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI); // For debugging
    const conn = await mongoose.connect("mongodb+srv://sahayogeshwaran1:db4aUSjkZkX1AUNf@cluster1.fpl98.mongodb.net/mernpr", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`.red);
    process.exit(1);
  }
};

export default connectDB;
