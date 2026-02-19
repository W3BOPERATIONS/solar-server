import mongoose from 'mongoose';

let isConnected = false; // Track connection status

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "solar-erp",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState;

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
