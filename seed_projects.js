import mongoose from 'mongoose';
import Project from './models/Project.js';
import User from './models/User.js';
import State from './models/State.js';

mongoose.connect('mongodb+srv://w3bfranceoperations_db_user:BpXlfVpX5yF9eaeA@cluster0.p7gs1gy.mongodb.net/solarkit?appName=Cluster0').then(async () => {

    const demoDealer = await User.findOne({ name: 'Demo Dealer' });
    let state = await State.findOne();
    if (!state) {
        state = await State.create({ name: 'Test State', isActive: true });
    }

    if (demoDealer) {
        // Find existing projects or create new ones
        const projectCount = await Project.countDocuments({ dealer: demoDealer._id });
        if (projectCount === 0) {
            console.log('No projects found for demo dealer, creating an active test project...');

            await Project.create({
                projectId: 'PROJ-TEST-100',
                dealer: demoDealer._id,
                projectName: 'Test Customer A',
                category: 'Residential',
                projectType: 'On-Grid',
                totalKW: 5,
                dueDate: new Date(),
                state: state._id,
                status: 'Verification',
                isActive: true,
                email: 'customer1@example.com',
                mobile: '9876543210',
                installationDate: new Date(),
            });

            await Project.create({
                projectId: 'PROJ-TEST-101',
                dealer: demoDealer._id,
                projectName: 'John Smith Residence',
                category: 'Commercial',
                projectType: 'Hybrid',
                totalKW: 10,
                dueDate: new Date(),
                state: state._id,
                status: 'Completed',
                isActive: true,
                email: 'johnsmith@example.com',
                mobile: '8887776665',
                installationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            });

            console.log('Projects created successfully.');
        } else {
            console.log(`Found ${projectCount} projects for the demo dealer.`);
        }
    } else {
        console.log('Demo dealer not found.');
    }

    process.exit(0);
}).catch(console.error);
