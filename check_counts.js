
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TerraceType from './models/TerraceType.js';
import BuildingType from './models/BuildingType.js';
import StructureType from './models/StructureType.js';

dotenv.config({ path: './.env' });

const checkCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const terraceCount = await TerraceType.countDocuments();
        const buildingCount = await BuildingType.countDocuments();
        const structureCount = await StructureType.countDocuments();

        console.log(`Terrace Types: ${terraceCount}`);
        console.log(`Building Types: ${buildingCount}`);
        console.log(`Structure Types: ${structureCount}`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCounts();
