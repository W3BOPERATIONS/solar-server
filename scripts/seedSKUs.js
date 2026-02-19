import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import SKU from '../models/SKU.js';
import Brand from '../models/Brand.js';
import ProjectType from '../models/ProjectType.js';
// We might need Category model if we want to ensure consistency, but string matching is used in frontend.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

if (!process.env.MONGODB_URI) {
    const rootEnvPath = path.resolve(process.cwd(), 'server/.env');
    dotenv.config({ path: rootEnvPath });
}

const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!connStr) throw new Error('MongoDB URI not found');
        await mongoose.connect(connStr);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const seedSKUs = async () => {
    await connectDB();

    try {
        console.log('🧹 Clearing old SKU data...');
        // await SKU.deleteMany({}); // Optional: clear all SKUs if you want a clean slate
        // For now, let's upsert or just create active ones.

        // 1. Ensure Brands exist
        const brandsData = [
            { brandName: 'Luminous', status: 'Active' },
            { brandName: 'Tata Power', status: 'Active' },
            { brandName: 'Waaree', status: 'Active' },
            { brandName: 'Adani', status: 'Active' },
            { brandName: 'Exide', status: 'Active' },
            { brandName: 'Solis', status: 'Active' },
            { brandName: 'Growatt', status: 'Active' },
            { brandName: 'Livguard', status: 'Active' }
        ];

        const brands = {};
        for (const b of brandsData) {
            let brand = await Brand.findOne({ brandName: b.brandName });
            if (!brand) {
                brand = await Brand.create(b);
                console.log(`Created Brand: ${b.brandName}`);
            }
            brands[b.brandName] = brand;
        }

        // 2. Ensure Project Types exist (for mapping)
        // Common types: Residential, Commercial, Industrial, Agricultural
        // We just need their names to match SKU.projectType
        const projectTypes = ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Utility'];

        // We won't create ProjectTypes here as they likely exist, but we will use these names.

        // 3. Define SKU Data
        // Structure: skuCode, name/desc, brand, productType, projectType, subProjectType, technology, wattage

        const skuData = [
            // Solar Panels
            {
                skuCode: 'LUM-540-MONO',
                description: 'Luminous 540W Mono Perc Half Cut',
                brand: brands['Luminous']._id,
                productType: 'Solar Panels',
                category: 'Solar Panels',
                projectType: 'Residential',
                subProjectType: 'Rooftop',
                subCategory: 'Mono Perc',
                technology: 'Mono Perc',
                wattage: 540
            },
            {
                skuCode: 'WAR-550-BIF',
                description: 'Waaree 550W Bifacial Module',
                brand: brands['Waaree']._id,
                productType: 'Solar Panels',
                category: 'Solar Panels',
                projectType: 'Commercial',
                subProjectType: 'Ground Mount',
                subCategory: 'Bifacial',
                technology: 'Bifacial',
                wattage: 550
            },
            {
                skuCode: 'ADA-400-POLY',
                description: 'Adani 400W Polycrystalline',
                brand: brands['Adani']._id,
                productType: 'Solar Panels',
                category: 'Solar Panels',
                projectType: 'Agricultural',
                subProjectType: 'Pump',
                subCategory: 'Polycrystalline',
                technology: 'Polycrystalline',
                wattage: 400
            },
            {
                skuCode: 'TAT-450-MONO',
                description: 'Tata Power 450W Mono Module',
                brand: brands['Tata Power']._id,
                productType: 'Solar Panels',
                category: 'Solar Panels',
                projectType: 'Residential',
                subProjectType: 'Rooftop',
                subCategory: 'Mono Perc',
                technology: 'Mono Perc',
                wattage: 450
            },

            // Inverters
            {
                skuCode: 'SOL-5K-HYB',
                description: 'Solis 5kW Hybrid Inverter',
                brand: brands['Solis']._id,
                productType: 'Inverters',
                category: 'Inverters',
                projectType: 'Residential',
                subProjectType: 'Rooftop',
                subCategory: 'Hybrid',
                technology: 'Hybrid',
                wattage: 5000
            },
            {
                skuCode: 'GRO-10K-ON',
                description: 'Growatt 10kW On-Grid Inverter',
                brand: brands['Growatt']._id,
                productType: 'Inverters',
                category: 'Inverters',
                projectType: 'Commercial',
                subProjectType: 'Rooftop',
                subCategory: 'On-Grid',
                technology: 'On-Grid',
                wattage: 10000
            },
            {
                skuCode: 'LUM-3K-OFF',
                description: 'Luminous 3kW Off-Grid Inverter',
                brand: brands['Luminous']._id,
                productType: 'Inverters',
                category: 'Inverters',
                projectType: 'Residential',
                subProjectType: 'Rooftop',
                subCategory: 'Off-Grid',
                technology: 'Off-Grid',
                wattage: 3000
            },

            // Batteries
            {
                skuCode: 'EXI-150-TALL',
                description: 'Exide 150Ah Tall Tubular Battery',
                brand: brands['Exide']._id,
                productType: 'Batteries',
                category: 'Batteries',
                projectType: 'Residential',
                subProjectType: 'Backup',
                subCategory: 'Tubular',
                technology: 'Lead Acid',
                wattage: 12 // Nominal voltage usually, but field is wattage. IDK how it maps. Putting dummy 12.
            },
            {
                skuCode: 'LIV-200-GEL',
                description: 'Livguard 200Ah Gel Battery',
                brand: brands['Livguard']._id,
                productType: 'Batteries',
                category: 'Batteries',
                projectType: 'Residential',
                subProjectType: 'Backup',
                subCategory: 'Gel',
                technology: 'Gel',
                wattage: 12
            },
            {
                skuCode: 'TAT-LIT-5K',
                description: 'Tata 5kWh Lithium Ion Battery',
                brand: brands['Tata Power']._id,
                productType: 'Batteries',
                category: 'Batteries',
                projectType: 'Residential',
                subProjectType: 'Hybrid',
                subCategory: 'Lithium',
                technology: 'Lithium Ion',
                wattage: 5000
            }
        ];

        console.log(`📦 Seeding ${skuData.length} SKUs...`);

        for (const s of skuData) {
            // Upsert: Update if exists, Insert if not
            await SKU.findOneAndUpdate(
                { skuCode: s.skuCode },
                s,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`   Processed SKU: ${s.skuCode}`);
        }

        console.log('✅ SKU Seeding Completed Successfully!');

    } catch (err) {
        console.error('❌ SKU Seeding Failed:', err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedSKUs();
