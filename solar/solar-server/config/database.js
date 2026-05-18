import mongoose from 'mongoose';
import https from 'https';

let cachedConnection = null;
let cachedConnectionPromise = null;

const getPublicIP = () => {
  return new Promise((resolve) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).ip);
        } catch (e) {
          resolve('Could not fetch IP');
        }
      });
    }).on('error', () => resolve('Could not fetch IP (network error)'));
  });
};

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState >= 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  cachedConnectionPromise = mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

  try {
    const conn = await cachedConnectionPromise;
    cachedConnection = conn.connection;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return cachedConnection;
  } catch (error) {
    cachedConnectionPromise = null;
    console.error(`Error connecting to MongoDB: ${error.message}`);

    if (error.message.includes('Could not connect to any servers') || error.message.includes('IP address')) {
      const publicIP = await getPublicIP();
      console.log('\n--------------------------------------------------------------');
      console.log('DIAGNOSTIC: This usually means your IP is NOT whitelisted in MongoDB Atlas.');
      console.log(`Your current Public IP is: ${publicIP}`);
      console.log('To fix this:');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Navigate to "Network Access" under the Security section.');
      console.log('3. Click "Add IP Address" and then "Add Current IP Address".');
      console.log('4. Alternatively, add 0.0.0.0/0 to allow access from anywhere (for development only).');
      console.log('--------------------------------------------------------------\n');
    }

    throw error;
  }
};
export default connectDB;

