import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import InventoryItem from '../models/InventoryItem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

if (!process.env.MONGODB_URI) {
    const rootEnvPath = path.resolve(process.cwd(), 'server/.env');
    dotenv.config({ path: rootEnvPath });
}

const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!connStr) throw new Error('MongoDB URI not found');
        await mongoose.connect(connStr);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const checkIndexes = async () => {
    await connectDB();
    try {
        const indexes = await InventoryItem.collection.indexes();
        console.log('Current Indexes:');
        console.log(JSON.stringify(indexes, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

checkIndexes();
