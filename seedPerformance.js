import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import State from './models/State.js';
import District from './models/District.js';
import Cluster from './models/Cluster.js';
import UserPerformance from './models/UserPerformance.js';
import connectDB from './config/database.js';

dotenv.config();

const seedPerformanceData = async () => {
    await connectDB();

    try {
        // Clear existing performance data
        await UserPerformance.deleteMany({});

        const states = await State.find({});
        const districts = await District.find({});
        const clusters = await Cluster.find({});
        const users = await User.find({});

        if (states.length === 0 || users.length === 0) {
            console.log('Please ensure you have users and states in the database first.');
            process.exit();
        }

        const performanceData = [];

        // Create 20 random performance records
        for (let i = 0; i < 20; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const state = states[Math.floor(Math.random() * states.length)];
            const district = districts.filter(d => d.stateId?.toString() === state._id.toString())[0] || districts[0];
            const cluster = clusters.filter(c => c.districtId?.toString() === district?._id.toString())[0] || clusters[0];

            performanceData.push({
                userId: user._id,
                role: user.role === 'admin' ? 'franchise_manager' : user.role,
                stateId: state._id,
                districtId: district?._id,
                clusterId: cluster?._id,
                leads: Math.floor(Math.random() * 50) + 10,
                demos: Math.floor(Math.random() * 30) + 5,
                signups: Math.floor(Math.random() * 15) + 2,
                conversions: Math.floor(Math.random() * 40) + 10,
                target: 100000,
                achieved: Math.floor(Math.random() * 120000),
                performancePercent: Math.floor(Math.random() * 100),
                status: ['Performer', 'Active', 'Inactive'][Math.floor(Math.random() * 3)],
                orderKW: Math.floor(Math.random() * 50),
                orderRs: Math.floor(Math.random() * 100000),
                date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
            });
        }

        await UserPerformance.insertMany(performanceData);
        console.log('Performance data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedPerformanceData();
