import mongoose from 'mongoose';
import dotenv from 'dotenv';
import State from '../models/State.js';
import District from '../models/District.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

const setupData = async () => {
    try {
        await connectDB();

        console.log('Checking for existing location data...');

        let state = await State.findOne();
        if (!state) {
            console.log('No State found. Creating Test State...');
            state = await State.create({
                name: 'Test State',
                code: 'TS',
                country: new mongoose.Types.ObjectId() // Dummy country ID if needed, or valid one if enforced
            });
            console.log('Created State:', state.name);
        } else {
            console.log('Using existing State:', state.name);
        }

        let district = await District.findOne({ state: state._id });
        if (!district) {
            console.log('No District found for State. Creating Test District...');
            district = await District.create({
                name: 'Test District',
                code: 'TD',
                state: state._id,
                country: state.country
            });
            console.log('Created District:', district.name);
        } else {
            console.log('Using existing District:', district.name);
        }

        console.log('Setup Complete.');
        process.exit(0);
    } catch (error) {
        console.error('Setup Failed:', error);
        process.exit(1);
    }
};

setupData();
