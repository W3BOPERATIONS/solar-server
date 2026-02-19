
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Lead from './models/Lead.js';
import Project from './models/Project.js';
import District from './models/District.js';
import State from './models/State.js';
import Cluster from './models/Cluster.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const seedDealerData = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('📦 Connected to MongoDB');

        // 1. Find or Create a Dealer User
        let dealer = await User.findOne({ email: 'dealer@solarkits.com' });
        if (!dealer) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            dealer = await User.create({
                name: 'Demo Dealer',
                email: 'dealer@solarkits.com',
                password: hashedPassword,
                role: 'dealer',
                isActive: true
            });
            console.log('👤 Created Dealer: dealer@solarkits.com');
        } else {
            console.log('👤 Found Dealer: dealer@solarkits.com');
        }

        // 2. Get Location Data (Assuming some exists, otherwise create placeholders)
        let state = await State.findOne();
        if (!state) {
            state = await State.create({ name: 'Gujarat', gst: 18 });
            console.log('📍 Created State: Gujarat');
        }

        let district = await District.findOne({ state: state._id });
        if (!district) {
            district = await District.create({ name: 'Ahmedabad', state: state._id });
            console.log('📍 Created District: Ahmedabad');
        }

        let cluster = await Cluster.findOne({ district: district._id });
        if (!cluster) {
            cluster = await Cluster.create({ name: 'Ahmedabad East', district: district._id, state: state._id });
            console.log('📍 Created Cluster: Ahmedabad East');
        }

        // 3. Clear existing test data (optional, but good for "clean" start if requested)
        // await Lead.deleteMany({ email: { $in: ['resid_new@test.com', 'comm_new@test.com', 'resid_signed@test.com', 'comm_signed@test.com'] } });
        // await Project.deleteMany({ projectName: { $in: ['Residential Project A', 'Commercial Project B'] } });
        // console.log('🧹 Cleared previous test data');

        // 4. Create Leads
        const leads = [
            {
                name: 'Test Lead New Residential',
                mobile: '9999900001',
                email: 'resid_new@test.com',
                solarType: 'Residential',
                subType: 'Solar Rooftop',
                kw: '5',
                district: district._id,
                city: cluster._id,
                dealer: dealer._id,
                status: 'New'
            },
            {
                name: 'Test Lead New Commercial',
                mobile: '9999900002',
                email: 'comm_new@test.com',
                solarType: 'Commercial',
                subType: 'Solar Panel',
                kw: '50',
                district: district._id,
                city: cluster._id,
                dealer: dealer._id,
                status: 'New'
            },
            // Leads that will be "converted" to projects
            {
                name: 'Test Lead Signed Residential',
                mobile: '9999900003',
                email: 'resid_signed@test.com',
                solarType: 'Residential',
                subType: 'Solar Rooftop',
                kw: '10',
                district: district._id,
                city: cluster._id,
                dealer: dealer._id,
                status: 'ProjectSigned' // logic should be tested via frontend/controller, but here we simulate the result
            },
            {
                name: 'Test Lead Signed Commercial',
                mobile: '9999900004',
                email: 'comm_signed@test.com',
                solarType: 'Commercial',
                subType: 'Solar Panel',
                kw: '100',
                district: district._id,
                city: cluster._id,
                dealer: dealer._id,
                status: 'ProjectSigned'
            }
        ];

        for (const leadData of leads) {
            // Upsert to avoid duplicates on multiple runs
            const lead = await Lead.findOneAndUpdate(
                { email: leadData.email },
                leadData,
                { upsert: true, new: true }
            );
            console.log(`📄 Processed Lead: ${lead.name} (${lead.status})`);

            // If "ProjectSigned", ensure a project exists
            if (lead.status === 'ProjectSigned') {
                const projectId = `PROJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                const projectData = {
                    projectId: projectId, // Unique ID
                    projectName: `${lead.name} Project`,
                    category: lead.solarType,
                    projectType: 'On-Grid',
                    totalKW: Number(lead.kw),
                    state: state._id,
                    district: district._id,
                    cluster: cluster._id,
                    status: 'Consumer Registered',
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    createdBy: dealer._id
                };

                // Check if project already exists for this lead concept (using raw matching logic since no direct link in schema yet beside name derivation or we could add leadId to project)
                // For seeding, we'll just check by name to avoid dupes
                const existingProject = await Project.findOne({ projectName: projectData.projectName });
                if (!existingProject) {
                    await Project.create(projectData);
                    console.log(`🏗️  Created Project: ${projectData.projectName}`);
                } else {
                    console.log(`🏗️  Project already exists: ${projectData.projectName}`);
                }
            }
        }

        console.log('✅ Seeding Completed Successfully');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seedDealerData();
