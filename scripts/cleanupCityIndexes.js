import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('cities');

        console.log('Dropping legacy indexes...');
        try {
            await collection.dropIndex('name_1_zone_1');
            console.log('Dropped name_1_zone_1');
        } catch (e) {
            console.log('name_1_zone_1 did not exist or already dropped');
        }

        try {
            await collection.dropIndex('name_1_zones_1'); // If I created this one without areaType
            console.log('Dropped name_1_zones_1');
        } catch (e) { }

        // List remaining
        const indexes = await collection.indexes();
        console.log('Remaining Indexes:', JSON.stringify(indexes, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanup();
