import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const ROLES_TO_PRESERVE = ['admin', 'dealer', 'franchisee', 'dealerManager', 'franchiseeManager'];

const clearBusinessData = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        for (const col of collections) {
            const collectionName = col.name;

            if (collectionName === 'users') {
                console.log(`Preserving specific users in collection: ${collectionName}`);
                const result = await db.collection(collectionName).deleteMany({
                    role: { $nin: ROLES_TO_PRESERVE }
                });
                console.log(`Deleted ${result.deletedCount} users with non-preserved roles.`);
            } else {
                console.log(`Dropping collection: ${collectionName}`);
                try {
                    await db.collection(collectionName).drop();
                } catch (dropError) {
                    // Ignore error if collection doesn't exist (shouldn't happen with listCollections but safe)
                    if (dropError.code !== 26) {
                        console.error(`Error dropping ${collectionName}:`, dropError.message);
                    }
                }
            }
        }

        console.log('\nCleanup Complete.');
        console.log('Preserved User Roles:', ROLES_TO_PRESERVE.join(', '));

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Cleanup Failed:', error);
        process.exit(1);
    }
};

clearBusinessData();
