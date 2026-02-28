import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const inspectUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const users = await db.collection('users').find({}).toArray();

        console.log(`Total Users: ${users.length}`);

        users.forEach(user => {
            console.log(`User: ${user.email}, Role: ${user.role}`);
            console.log(`  State: ${typeof user.state === 'string' ? `"${user.state}" (STRING)` : user.state}`);
            console.log(`  City: ${typeof user.city === 'string' ? `"${user.city}" (STRING)` : user.city}`);
        });

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Inspection Failed:', error);
        process.exit(1);
    }
};

inspectUsers();
