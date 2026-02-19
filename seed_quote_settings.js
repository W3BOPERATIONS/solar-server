
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TerraceType from './models/TerraceType.js';
import BuildingType from './models/BuildingType.js';
import StructureType from './models/StructureType.js';

dotenv.config({ path: './.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Terrace Types
        const terraceTypes = ['Flat', 'Slanted', 'Shed'];
        for (const name of terraceTypes) {
            await TerraceType.findOneAndUpdate(
                { name },
                { name, isActive: true },
                { upsert: true, new: true }
            );
        }
        console.log('Terrace Types seeded');

        // Building Types
        const buildingTypes = [
            { name: 'Residential', floorLimit: 3 },
            { name: 'Commercial', floorLimit: 10 },
            { name: 'Industrial', floorLimit: 2 },
            { name: 'Villa', floorLimit: 3 },
            { name: 'Apartment', floorLimit: 20 },
            { name: 'Tenement', floorLimit: 3 }
        ];
        for (const type of buildingTypes) {
            await BuildingType.findOneAndUpdate(
                { name: type.name },
                type,
                { upsert: true, new: true }
            );
        }
        console.log('Building Types seeded');

        // Structure Types
        const structureTypes = ['Standard', 'Elevated', 'High Rise'];
        for (const name of structureTypes) {
            await StructureType.findOneAndUpdate(
                { name },
                { name, isActive: true },
                { upsert: true, new: true }
            );
        }
        console.log('Structure Types seeded');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
