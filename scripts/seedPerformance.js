import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Country from '../models/Country.js';
import State from '../models/State.js';
import City from '../models/City.js';
import District from '../models/District.js';
import Cluster from '../models/Cluster.js';
import UserPerformance from '../models/UserPerformance.js';

dotenv.config();

const seedData = async () => {
    try {
        console.log("🚀 Connecting to database for seeding...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database connected successfully");

        // Clear existing test performance data
        await UserPerformance.deleteMany({ role: { $in: ['dealer_manager', 'dealer_manager_trainee'] } });
        console.log("🧹 Cleared old performance data");

        // 1. Seed Country
        let india = await Country.findOne({ name: 'India' });
        if (!india) {
            india = await Country.create({ name: 'India', code: 'IN' });
            console.log("✅ Created Country: India");
        }

        // 2. Seed States
        let gujarat = await State.findOne({ name: 'Gujarat' });
        if (!gujarat) {
            gujarat = await State.create({ name: 'Gujarat', code: 'GJ', country: india._id });
            console.log("✅ Created State: Gujarat");
        }

        // 3. Seed Cities for Gujarat
        const cities = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'];
        const cityDocs = [];
        for (const name of cities) {
            let city = await City.findOne({ name, state: gujarat._id });
            if (!city) {
                city = await City.create({ name, state: gujarat._id, country: india._id });
                console.log(`✅ Created City: ${name}`);
            }
            cityDocs.push(city);
        }

        // 4. Seed Districts for Gujarat (Matching cities for simplicity)
        const districtDocs = [];
        for (const name of cities) {
            let district = await District.findOne({ name, state: gujarat._id });
            const city = cityDocs.find(c => c.name === name);
            if (!district) {
                district = await District.create({ name, state: gujarat._id, country: india._id, city: city._id });
                console.log(`✅ Created District: ${name}`);
            }
            districtDocs.push(district);
        }

        // 5. Seed Clusters for Rajkot
        const clusters = ['Rajkot North', 'Rajkot South', 'Rajkot West'];
        const rajkotDist = districtDocs.find(d => d.name === 'Rajkot');
        const clusterDocs = [];
        for (const name of clusters) {
            let cluster = await Cluster.findOne({ name, district: rajkotDist._id });
            if (!cluster) {
                cluster = await Cluster.create({ name, district: rajkotDist._id, state: gujarat._id, country: india._id });
                console.log(`✅ Created Cluster: ${name}`);
            }
            clusterDocs.push(cluster);
        }

        // 6. Find or Create a test User
        let testUser = await User.findOne({ email: 'demodealer@example.com' });
        if (!testUser) {
            testUser = await User.create({
                name: 'Demo Dealer Manager',
                email: 'demodealer@example.com',
                password: 'password123',
                phone: '1234567890',
                state: 'Gujarat',
                role: 'dealer',
                status: 'active'
            });
            console.log("✅ Created Test User: Demo Dealer Manager");
        }

        // 7. Seed Performance Data
        const performances = [
            {
                userId: testUser._id,
                role: 'dealer_manager',
                stateId: gujarat._id,
                districtId: rajkotDist._id,
                clusterId: clusterDocs[0]._id,
                leads: 150,
                demos: 120,
                signups: 45,
                sales: 30,
                orderKW: 150,
                orderRs: 7500000,
                achieved: 45,
                target: 50,
                conversions: 30,
                status: 'Performer'
            },
            {
                userId: testUser._id,
                role: 'dealer_manager_trainee',
                stateId: gujarat._id,
                districtId: rajkotDist._id,
                clusterId: clusterDocs[1]._id,
                leads: 80,
                demos: 60,
                signups: 15,
                sales: 10,
                orderKW: 50,
                orderRs: 2500000,
                achieved: 15,
                target: 20,
                conversions: 18.7,
                status: 'Active'
            },
            {
                userId: testUser._id,
                role: 'dealer',
                stateId: gujarat._id,
                districtId: rajkotDist._id,
                clusterId: clusterDocs[2]._id,
                leads: 120,
                demos: 90,
                signups: 25,
                sales: 18,
                orderKW: 90,
                orderRs: 4500000,
                achieved: 18,
                target: 25,
                conversions: 20.8,
                status: 'Performer'
            }
        ];

        await UserPerformance.insertMany(performances);
        console.log("🚀 Seeded User Performance records!");

        const count = await UserPerformance.countDocuments();
        console.log(`📈 Total Performance Records: ${count}`);

        console.log("✅ Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
