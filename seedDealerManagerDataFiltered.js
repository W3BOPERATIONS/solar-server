import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Lead from './models/Lead.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the first Dealer Manager
        let dealerManager = await User.findOne({ role: 'dealerManager' });
        if (!dealerManager) {
            dealerManager = await User.create({
                name: 'Demo Dealer Manager',
                email: 'dealermanager@example.com',
                phone: '9999988888',
                password: 'password123',
                role: 'dealerManager',
                state: 'Gujarat',
                status: 'approved'
            });
            console.log('Created Demo Dealer Manager');
        }

        console.log(`Seeding data for Dealer Manager: ${dealerManager.name} (${dealerManager._id})`);

        // Create a Dealer under this manager
        const dealerEmail = `dealer_${Date.now()}@example.com`;
        const dealer = await User.create({
            name: 'Seeded Dealer',
            email: dealerEmail,
            phone: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
            password: 'password123',
            role: 'dealer',
            state: 'Gujarat',
            status: 'approved',
            createdBy: dealerManager._id
        });
        console.log('Created Dealer under Manager');

        // Create a Lead for this Dealer
        const lead = await Lead.create({
            name: 'Rahul Patel',
            mobile: '9876543210',
            state: 'Gujarat',
            district: new mongoose.Types.ObjectId(),
            city: new mongoose.Types.ObjectId(),
            rural: false,
            sourceOfMedia: 'website',
            profession: 'Business',
            solarType: 'B2B',
            kw: 5,
            dealer: dealer._id,
            status: 'New'
        });
        console.log('Created Lead');

        // Create a Demo Task for the Dealer Manager
        const task = await Task.create({
            title: 'Follow up with seeded lead',
            description: 'Discuss solar panel installation.',
            status: 'Pending',
            assignedTo: dealerManager._id,
            createdBy: dealerManager._id
        });
        console.log('Created Task');

        // Create a Project for this Dealer
        const project = await Project.create({
            projectName: 'Rahul Residential Solar',
            projectId: `PRJ${Date.now()}`,
            category: 'Residential',
            projectType: 'On Grid',
            dealerId: dealer._id,
            state: new mongoose.Types.ObjectId(),
            totalKW: 5,
            totalAmount: 250000,
            commission: 15000,
            status: 'InProgress',
            installationDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        console.log('Created Project');

        // Create a completed project to show commission
        const completedProject = await Project.create({
            projectName: 'Sharma Commercial Setup',
            projectId: `PRJ${Date.now() + 1}`,
            category: 'Commercial',
            projectType: 'On Grid',
            dealerId: dealer._id,
            state: new mongoose.Types.ObjectId(),
            totalKW: 15,
            totalAmount: 750000,
            commission: 45000,
            status: 'Completed',
            installationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        });
        console.log('Created Completed Project');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        if (error.errors) {
            console.log('Validation Errors');
            import('fs').then(fs => fs.writeFileSync('mongoose-error.json', JSON.stringify(error, null, 2)));
        } else {
            console.error('Seeding error:', error);
        }
        setTimeout(() => process.exit(1), 1000);
    }
};

seedData();
