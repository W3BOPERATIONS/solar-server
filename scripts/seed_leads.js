import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import User from '../models/User.js';
import District from '../models/District.js';
import Cluster from '../models/Cluster.js';

console.log('CWD:', process.cwd());
// Adjust path to .env since we are running from server root but file is in scripts/
// Actually, if we run via npm script "node scripts/seed_leads.js", CWD is server/
// So .env is in ./
dotenv.config({ path: './.env' });

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGODB_URI ? 'URI found' : 'URI MISSING');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        console.log('Finding dealer...');
        // 1. Find a Dealer
        const dealer = await User.findOne({ role: 'dealer' });
        if (!dealer) {
            console.log('No dealer found! Please create a dealer user first.');
            process.exit(1);
        }
        console.log(`Seeding data for dealer: ${dealer.name} (${dealer.email})`);

        console.log('Finding District...');
        // 2. Find a District & Cluster
        const district = await District.findOne();
        if (!district) {
            console.log('No district found! Please create a district first.');
            process.exit(1);
        }
        console.log(`Found District: ${district.name}`);

        console.log('Finding Cluster...');
        const cluster = await Cluster.findOne();
        console.log(`Found Cluster: ${cluster ? cluster.name : 'None'}`);
        // Cluster is optional in my logic but good to have.

        // 3. Create Leads
        const leadsData = [
            {
                name: 'Test Lead New',
                mobile: '9999999901',
                whatsapp: '9999999901',
                email: 'new@test.com',
                district: district._id,
                city: cluster ? cluster._id : null,
                solarType: 'Residential',
                subType: 'onGrid',
                kw: '3',
                billAmount: 1500,
                status: 'New',
                dealer: dealer._id,
                history: [{ action: 'Created (Seed)', by: dealer._id }]
            },
            {
                name: 'Test Lead Survey Done',
                mobile: '9999999902',
                whatsapp: '9999999902',
                email: 'survey@test.com',
                district: district._id,
                city: cluster ? cluster._id : null,
                solarType: 'Residential',
                subType: 'offGrid',
                kw: '5',
                billAmount: 2500,
                status: 'SurveyCompleted', // Should appear in Project Quote
                dealer: dealer._id,
                history: [{ action: 'Created (Seed)', by: dealer._id }]
            },
            {
                name: 'Test Lead Quote Ready',
                mobile: '9999999903',
                whatsapp: '9999999903',
                email: 'quote@test.com',
                district: district._id,
                city: cluster ? cluster._id : null,
                solarType: 'Commercial',
                subType: 'onGrid',
                kw: '10',
                billAmount: 5000,
                status: 'QuoteGenerated', // Should appear in Project Signup
                dealer: dealer._id,
                history: [{ action: 'Created (Seed)', by: dealer._id }]
            }
        ];

        await Lead.insertMany(leadsData);
        console.log('Successfully seeded 3 leads!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedData();
