import mongoose from 'mongoose';
import Project from './server/models/Project.js';
import Lead from './server/models/Lead.js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Create a dummy Lead
        const lead = await Lead.create({
            name: 'Test Customer',
            mobile: '9876543210',
            email: 'test@example.com',
            district: null, // As per schema constraints if any, simplified for test
            city: null,
            solarType: 'Residential',
            kw: 5,
            status: 'Signed'
        });
        console.log('Dummy Lead created:', lead._id);

        // 2. Create Project (Simulate signProject logic partially or just create directly to test schema)
        // Since signProject logic is in controller, I will test the Schema and Model mostly here.
        const project = await Project.create({
            projectName: lead.name,
            category: 'Residential',
            mobile: lead.mobile,
            email: lead.email,
            address: 'Test Address',
            consumerNumber: 'C12345',
            authorizedPersonName: 'Auth Person',
            isActive: true
        });

        console.log('Project created with new fields:', project._id);
        console.log('Mobile:', project.mobile);
        console.log('Email:', project.email);
        console.log('Address:', project.address);

        if (project.mobile === '9876543210' && project.email === 'test@example.com') {
            console.log('VERIFICATION PASSED: New fields saved correctly.');
        } else {
            console.error('VERIFICATION FAILED: Fields not saved.');
        }

        // Cleanup
        await Project.findByIdAndDelete(project._id);
        await Lead.findByIdAndDelete(lead._id);
        console.log('Cleanup done.');

    } catch (error) {
        console.error('Verification Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verify();
