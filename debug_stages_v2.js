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

        const allProjects = await Project.find({ isActive: true }).select('projectName status statusStage category projectType subCategory subProjectType');
        console.log('--- All Active Projects in DB ---');
        allProjects.forEach(p => {
            console.log(`- ${p.projectName}: [${p.status}] (StageID: ${p.statusStage}), Cat: ${p.category}, Type: ${p.projectType}`);
        });

        const stages = await ProjectJourneyStage.find();
        console.log('\n--- Defined Journey Stages ---');
        stages.forEach(s => console.log(`Name: "${s.name}", Title: "${s.title || 'N/A'}", ID: ${s._id}`));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
