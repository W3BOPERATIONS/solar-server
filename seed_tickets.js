import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const CategorySchema = new mongoose.Schema({ name: String, isActive: { type: Boolean, default: true } });
const ProjectTypeSchema = new mongoose.Schema({ name: String, isActive: { type: Boolean, default: true } });
const UserSchema = new mongoose.Schema({ name: String, email: String, role: String, state: String, district: String, createdBy: mongoose.Schema.Types.ObjectId });
const ProjectSchema = new mongoose.Schema({ projectName: String, dealer: mongoose.Schema.Types.ObjectId, isActive: { type: Boolean, default: true }, status: String, installationDate: Date, email: String, mobile: String });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProjectType = mongoose.models.ProjectType || mongoose.model('ProjectType', ProjectTypeSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Seed Categories
        const categories = ['Solar Panel', 'Inverter', 'Battery', 'BOS Kit'];
        for (const catName of categories) {
            const exists = await Category.findOne({ name: catName });
            if (!exists) {
                await Category.create({ name: catName });
                console.log(`Created Category: ${catName}`);
            }
        }

        // 2. Seed Project Types
        const projectTypes = ['Residential', 'Commercial', 'Industrial', 'Agricultural'];
        for (const ptName of projectTypes) {
            const exists = await ProjectType.findOne({ name: ptName });
            if (!exists) {
                await ProjectType.create({ name: ptName });
                console.log(`Created Project Type: ${ptName}`);
            }
        }

        // 3. Ensure a Dealer and Project exist for the Manager
        const manager = await User.findOne({ email: 'dealermanager@gmail.com' });
        if (manager) {
            let dealer = await User.findOne({ role: 'dealer', $or: [{ createdBy: manager._id }, { state: manager.state, district: manager.district }] });
            if (!dealer) {
                dealer = await User.create({
                    name: 'Sample Dealer',
                    email: 'sampledealer@gmail.com',
                    role: 'dealer',
                    state: manager.state || 'Maharashtra',
                    district: manager.district || 'Pune',
                    createdBy: manager._id
                });
                console.log('Created Sample Dealer');
            }

            const projectExists = await Project.findOne({ dealer: dealer._id });
            if (!projectExists) {
                await Project.create({
                    projectName: 'Test Customer Pune',
                    dealer: dealer._id,
                    status: 'Installation',
                    installationDate: new Date(),
                    email: 'customer@example.com',
                    mobile: '9876543210'
                });
                console.log('Created Sample Project for Dealer');
            }
        }

        console.log('Seed completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
