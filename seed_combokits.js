import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ComboKitAssignment from './models/ComboKitAssignment.js';
import SolarKit from './models/SolarKit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const seedAssignments = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected.');

        // Get solar kits to use as base data
        const solarKits = await SolarKit.find().limit(5);
        if (solarKits.length === 0) {
            console.log('No SolarKits found. Cannot seed from them.');
            process.exit(0);
        }

        // Generate dummy combo kits based on solar kits
        const dummyComboKits = solarKits.map(sk => ({
            name: sk.name,
            image: null,
            panelBrand: 'Adani',
            panelSkus: ['ADN-12345'],
            inverterBrand: 'Luminous',
            // Default fields as defined in the schema
        }));

        // Find all assignments that have an empty comboKits array
        const assignmentsToSeed = await ComboKitAssignment.find({
            $or: [
                { comboKits: { $exists: false } },
                { comboKits: { $size: 0 } }
            ]
        });

        console.log(`Found ${assignmentsToSeed.length} assignments needing seeds.`);

        for (const assign of assignmentsToSeed) {
            assign.comboKits = dummyComboKits;
            await assign.save();
        }

        console.log('Successfully seeded ComboKits to assignments.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedAssignments();
