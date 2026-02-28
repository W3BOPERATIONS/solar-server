import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import DeliveryBenchmarkPrice from '../models/DeliveryBenchmarkPrice.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected.');

        try {
            await DeliveryBenchmarkPrice.collection.dropIndex('deliveryType_1');
            console.log('Successfully dropped old unique index on deliveryType.');
        } catch (err) {
            console.log('Index might not exist or already dropped:', err.message);
        }

        // Optionally, clear existing benchmark prices as their schema changed drastically
        await DeliveryBenchmarkPrice.deleteMany({});
        console.log('Cleared old DeliveryBenchmarkPrice records to allow fresh data structure.');

        process.exit(0);
    } catch (err) {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    }
};

dropIndex();
