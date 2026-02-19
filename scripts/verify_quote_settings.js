import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import QuoteSettings from '../models/QuoteSettings.js';
import SurveyBOM from '../models/SurveyBOM.js';
import TerraceType from '../models/TerraceType.js';
import StructureType from '../models/StructureType.js';
import BuildingType from '../models/BuildingType.js';
import Discom from '../models/Discom.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');

const result = dotenv.config({ path: envPath });

const logFile = path.join(__dirname, 'verification_error.txt');

const verifyQuoteSettings = async () => {
    console.log('🚀 Starting Quote Settings Verification...');

    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is undefined. Check .env file.');
        }

        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected');

        // 1. Create Terrace Type
        const terrace = await TerraceType.create({ name: 'Verification Terrace' });
        console.log(`✅ Terrace Type Created: ${terrace.name}`);

        // 2. Create Building Type
        const building = await BuildingType.create({ name: 'Verification Building' });
        console.log(`✅ Building Type Created: ${building.name}`);

        // 3. Create Structure Type
        const structure = await StructureType.create({ name: 'Verification Structure' });
        console.log(`✅ Structure Type Created: ${structure.name}`);

        // 4. Create Quote Setting
        const quoteSetting = await QuoteSettings.create({
            category: 'Verification Category',
            subCategory: 'Verification Sub',
            projectType: 'Verification Project',
            subProjectType: 'Verification SubProject',
            quoteType: 'Quick Quote',
            cpType: 'Basic',
            solarSettings: { projectKW: 5, unitPerKW: 4 },
            monthlyIsolation: [{ month: 'Jan', isolation: 100, total: 2000 }]
        });
        console.log(`✅ Quote Setting Created: ${quoteSetting._id}`);

        // 5. Create Survey BOM
        const surveyBOM = await SurveyBOM.create({
            category: 'Verification Category',
            subCategory: 'Verification Sub',
            projectType: 'Verification Project',
            subProjectType: 'Verification SubProject',
            terraceType: 'Verification Terrace',
            buildingType: 'Verification Building',
            structureType: 'Verification Structure',
            pipes: [{ product: 'Pipe A', formulaItem: 'Panel', formulaQty: 2, price: 100 }]
        });
        console.log(`✅ Survey BOM Created: ${surveyBOM._id}`);

        console.log('🎉 Verification Complete: All core models are functional.');

        // Cleanup
        await TerraceType.deleteOne({ _id: terrace._id });
        await BuildingType.deleteOne({ _id: building._id });
        await StructureType.deleteOne({ _id: structure._id });
        await QuoteSettings.deleteOne({ _id: quoteSetting._id });
        await SurveyBOM.deleteOne({ _id: surveyBOM._id });
        console.log('🧹 Cleanup Complete');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        fs.writeFileSync(logFile, `Error: ${error.message}\nStack: ${error.stack}`);
        process.exit(1);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        console.log('👋 Disconnected');
        process.exit(0);
    }
};

verifyQuoteSettings();
