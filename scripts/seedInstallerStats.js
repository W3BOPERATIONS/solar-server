import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Statistics from '../models/Statistics.js';
import User from '../models/User.js';
import State from '../models/State.js';
import Cluster from '../models/Cluster.js';
import District from '../models/District.js';

dotenv.config();

const seedInstallerStats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solarkit');
        console.log('✅ Database connected successfully');

        // Clear existing installer stats
        await Statistics.deleteMany({ role: 'installer' });
        console.log('🗑️ Existing installer statistics cleared');

        const installers = await User.find({ role: 'installer' });
        if (installers.length === 0) {
            console.log('No installers found. Creating dummy installers...');
            const dummyInstallers = [
                { name: 'John Smith', email: 'john@example.com', password: 'password123', role: 'installer', phone: '1234567890', state: 'Gujarat' },
                { name: 'Sarah Johnson', email: 'sarah@example.com', password: 'password123', role: 'installer', phone: '1234567891', state: 'Gujarat' },
                { name: 'Michael Brown', email: 'michael@example.com', password: 'password123', role: 'installer', phone: '1234567892', state: 'Maharashtra' },
                { name: 'Emily Davis', email: 'emily@example.com', password: 'password123', role: 'installer', phone: '1234567893', state: 'Maharashtra' },
                { name: 'Robert Wilson', email: 'robert@example.com', password: 'password123', role: 'installer', phone: '1234567894', state: 'Delhi' }
            ];
            for (const inst of dummyInstallers) {
                await User.create(inst);
            }
            console.log('✅ Dummy installers created');
        }

        const allInstallers = await User.find({ role: 'installer' });
        const states = await State.find();
        if (states.length === 0) {
            console.log('No states found. Please seed locations first.');
            process.exit(1);
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const year = '2024';

        const newStats = [];

        for (const installer of allInstallers) {
            // Find a state for the installer
            const state = await State.findOne({ name: installer.state }) || states[0];
            const cluster = await Cluster.findOne({ state: state._id });
            const district = await District.findOne({ state: state._id });

            for (const month of months) {
                const assigned = Math.floor(Math.random() * 20) + 10;
                const completed = Math.floor(Math.random() * (assigned - 5)) + 5;
                const inProgress = Math.floor(Math.random() * (assigned - completed));
                const overdue = assigned - completed - inProgress;
                const rate = Math.round((completed / assigned) * 100);
                const rating = (Math.random() * 1.5 + 3.5).toFixed(1);

                newStats.push({
                    user: installer._id,
                    role: 'installer',
                    totalAssigned: assigned,
                    inProgress: inProgress,
                    completed: completed,
                    overdue: overdue,
                    completionRate: rate,
                    rating: parseFloat(rating),
                    state: state.name,
                    cluster: cluster?.name || 'General',
                    district: district?.name || 'Main',
                    month: month,
                    year: year
                });
            }
        }

        await Statistics.insertMany(newStats);
        console.log(`✅ Successfully seeded ${newStats.length} installer statistics records`);
        console.log(`📊 Fetched chart records: ${newStats.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedInstallerStats();
