import mongoose from 'mongoose';
import Project from './models/Project.js';
import ProjectJourneyStage from './models/ProjectJourneyStage.js';
import dotenv from 'dotenv';
dotenv.config();

const uri = 'mongodb+srv://w3bfranceoperations_db_user:BpXlfVpX5yF9eaeA@cluster0.p7gs1gy.mongodb.net/solarkit?appName=Cluster0';

async function run() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const stats = await Project.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$statusStage', count: { $sum: 1 } } }
        ]);
        console.log('PROJECT STATUS STAGES in DB:', JSON.stringify(stats, null, 2));

        const stages = await ProjectJourneyStage.find();
        console.log('JOURNEY STAGES defined:', JSON.stringify(stages, null, 2));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
