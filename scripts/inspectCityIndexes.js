import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const inspect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('cities');
        const indexes = await collection.indexes();
        console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

        const count = await collection.countDocuments();
        console.log('Total Cities:', count);

        const sample = await collection.find().limit(5).toArray();
        console.log('Sample Cities:', JSON.stringify(sample, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspect();
