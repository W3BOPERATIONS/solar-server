import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Lead from './models/Lead.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

dotenv.config();

const cleanupData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Find the Demo Dealer Manager
        const managerEmail = 'dealermanager@example.com';
        const dealerManager = await User.findOne({ email: managerEmail });

        if (!dealerManager) {
            console.log(`Dealer Manager with email ${managerEmail} not found. Nothing to clean up.`);
            process.exit(0);
        }

        console.log(`Found Dealer Manager: ${dealerManager.name} (${dealerManager._id})`);

        // 2. Find all Dealers created by this manager
        const dealers = await User.find({ createdBy: dealerManager._id, role: 'dealer' });
        const dealerIds = dealers.map(d => d._id);

        console.log(`Found ${dealers.length} dealers associated with this manager.`);

        // 3. Find all IDs that we should use for cleaning (manager + its dealers)
        const allRelevantUserIds = [dealerManager._id, ...dealerIds];

        // 4. Cleanup Leads
        const leadDeleteResult = await Lead.deleteMany({ dealer: { $in: allRelevantUserIds } });
        console.log(`Deleted ${leadDeleteResult.deletedCount} leads.`);

        // 5. Cleanup Projects
        const projectDeleteResult = await Project.deleteMany({ dealerId: { $in: allRelevantUserIds } });
        console.log(`Deleted ${projectDeleteResult.deletedCount} projects.`);

        // 6. Cleanup Tasks
        const taskDeleteResult = await Task.deleteMany({ assignedTo: { $in: allRelevantUserIds } });
        console.log(`Deleted ${taskDeleteResult.deletedCount} tasks.`);

        // 7. Delete the Dealers
        const dealerDeleteResult = await User.deleteMany({ _id: { $in: dealerIds } });
        console.log(`Deleted ${dealerDeleteResult.deletedCount} dealers.`);

        // 8. Delete the Manager
        await User.deleteOne({ _id: dealerManager._id });
        console.log(`Deleted Dealer Manager: ${managerEmail}`);

        console.log('Cleanup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup error:', error);
        process.exit(1);
    }
};

cleanupData();
