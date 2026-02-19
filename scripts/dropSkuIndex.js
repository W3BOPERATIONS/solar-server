import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import InventoryItem from '../models/InventoryItem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
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
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const dropSkuIndex = async () => {
    await connectDB();

    try {
        console.log('🛠️ Dropping unique index on "sku"...');

        // List indexes to find the name
        const indexes = await InventoryItem.collection.indexes();
        console.log('Current Indexes:', indexes);

        const skuIndex = indexes.find(idx => idx.key.sku === 1 && Object.keys(idx.key).length === 1);

        if (skuIndex) {
            await InventoryItem.collection.dropIndex(skuIndex.name);
            console.log(`✅ Dropped index: ${skuIndex.name}`);
        } else {
            console.log('⚠️ SKU unique index not found (maybe already dropped or named differently).');
            // Try dropping by name 'sku_1' just in case
            try {
                await InventoryItem.collection.dropIndex('sku_1');
                console.log('✅ Dropped index by name: sku_1');
            } catch (e) {
                console.log('ℹ️ Could not drop sku_1 (likely didn\'t exist).');
            }
        }

        console.log('🔄 Re-syncing indexes to create new compound index...');
        await InventoryItem.syncIndexes();
        console.log('✅ Indexes synced.');

    } catch (err) {
        console.error('❌ Failed to drop index:', err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

dropSkuIndex();
