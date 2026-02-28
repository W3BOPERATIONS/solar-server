import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const cleanupAll = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('cities');

        const indexes = await collection.indexes();
        console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

        for (const idx of indexes) {
            if (idx.name !== '_id_') {
                console.log(`Dropping index: ${idx.name}`);
                await collection.dropIndex(idx.name);
            }
        }

        console.log('All legacy indexes dropped. Mongoose will recreate them on next start.');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
};

cleanupAll();
