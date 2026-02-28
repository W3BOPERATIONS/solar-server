import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CountryMaster from '../models/CountryMaster.js';
import Country from '../models/Country.js';

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const masterCount = await CountryMaster.countDocuments({});
        console.log(`Total Master Countries: ${masterCount}`);

        // Simulate activation 
        const canadaMaster = await CountryMaster.findOne({ name: 'Canada' });
        if (canadaMaster) {
            console.log(`Found Canada Master: ${canadaMaster._id}`);

            // Find or create in Country
            let canada = await Country.findOne({ name: 'Canada' });
            if (!canada) {
                canada = await Country.create({
                    name: 'Canada',
                    code: 'CA',
                    isActive: true
                });
                console.log('Activated Canada for verification');
            } else {
                console.log('Canada was already activated');
            }
        }

        const activeCountries = await Country.find({ isActive: true });
        console.log('Active Countries List:', activeCountries.map(c => c.name).join(', '));

        // Test deactivation
        if (canadaMaster) {
            let canada = await Country.findOne({ name: 'Canada' });
            if (canada) {
                canada.isActive = false;
                await canada.save();
                console.log('Deactivated Canada for verification');

                const canadaAfter = await Country.findById(canada._id);
                console.log(`Canada isActive after deactivation: ${canadaAfter.isActive}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verify();
