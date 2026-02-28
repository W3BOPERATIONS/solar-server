import mongoose from 'mongoose';
import ProjectJourneyStage from './models/ProjectJourneyStage.js';
import dotenv from 'dotenv';
dotenv.config();

const uri = 'mongodb+srv://w3bfranceoperations_db_user:BpXlfVpX5yF9eaeA@cluster0.p7gs1gy.mongodb.net/solarkit?appName=Cluster0';

const stages = [
    { name: 'Consumer Registered', order: 1 },
    { name: 'Application Submission', order: 2 },
    { name: 'Feasibility Check', order: 3 },
    { name: 'Meter Charge', order: 4 },
    { name: 'Vendor Selection', order: 5 },
    { name: 'Work Start', order: 6 },
    { name: 'Solar Installation', order: 7 },
    { name: 'PCR', order: 8 },
    { name: 'Commissioning', order: 9 },
    { name: 'Meter Change', order: 10 },
    { name: 'Meter Inspection', order: 11 },
    { name: 'Subsidy Request', order: 12 },
    { name: 'Subsidy Disbursal', order: 13 }
];

async function seed() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        for (const stageData of stages) {
            await ProjectJourneyStage.findOneAndUpdate(
                { name: stageData.name },
                { ...stageData, status: 'Active' },
                { upsert: true, new: true }
            );
        }

        console.log('Stages seeded successfully');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seed();
