import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const EMAILS_TO_KEEP = [
    'admin@solarkits.com',
    'dealer@solarkits.com',
    'franchise@solarkits.com',
    'dealermanager@solarkits.com',
    'franchisemanager@example.com'
];

const cleanupUsers = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCol = db.collection('users');

        console.log(`Deleting users except: ${EMAILS_TO_KEEP.join(', ')}`);

        const result = await usersCol.deleteMany({
            email: { $nin: EMAILS_TO_KEEP }
        });

        console.log(`Deleted ${result.deletedCount} extra users.`);

        const finalUsers = await usersCol.find({}).toArray();
        console.log(`\nFinal Users in database (${finalUsers.length}):`);
        finalUsers.forEach(u => console.log(`- ${u.email} (${u.role})`));

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Cleanup Failed:', error);
        process.exit(1);
    }
};

cleanupUsers();
