import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixUsers = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCol = db.collection('users');
        const users = await usersCol.find({}).toArray();

        console.log(`Analyzing ${users.length} users...`);

        for (const user of users) {
            let needsUpdate = false;
            const updateFields = {};

            // Check State
            if (user.state && typeof user.state === 'string') {
                console.log(`User ${user.email}: Invalid state format "${user.state}". Setting to null.`);
                updateFields.state = null;
                needsUpdate = true;
            }

            // Check City
            if (user.city && typeof user.city === 'string') {
                console.log(`User ${user.email}: Invalid city format "${user.city}". Setting to null.`);
                updateFields.city = null;
                needsUpdate = true;
            }

            // Check District
            if (user.district && typeof user.district === 'string') {
                console.log(`User ${user.email}: Invalid district format "${user.district}". Setting to null.`);
                updateFields.district = null;
                needsUpdate = true;
            }

            // Check Cluster
            if (user.cluster && typeof user.cluster === 'string') {
                console.log(`User ${user.email}: Invalid cluster format "${user.cluster}". Setting to null.`);
                updateFields.cluster = null;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await usersCol.updateOne({ _id: user._id }, { $set: updateFields });
            }
        }

        console.log('\nUser repair complete.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Repair Failed:', error);
        process.exit(1);
    }
};

fixUsers();
