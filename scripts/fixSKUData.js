import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import SKU from '../models/SKU.js';
import Brand from '../models/Brand.js';
import ProjectType from '../models/ProjectType.js';
import Category from '../models/Category.js';

dotenv.config();

const fixSKUs = async () => {
    try {
        await connectDB();

        console.log('Fetching master data...');
        const brands = await Brand.find({ status: 'Active' });
        const projectTypes = await ProjectType.find({ status: true });
        const categories = await Category.find({ status: true });

        if (brands.length === 0 || projectTypes.length === 0) {
            console.log('No brands or project types found. Cannot update SKUs accurately.');
            // process.exit(1); // Don't exit, just try with defaults or skip
        }

        const skus = await SKU.find({});
        console.log(`Found ${skus.length} SKUs.`);

        const technologies = ['Mono Perc', 'Polycrystalline', 'Thin Film', 'Bifacial'];
        const wattages = [330, 400, 440, 540, 550];
        const productTypes = ['Solar Panels', 'Inverter', 'Battery', 'Accessories'];

        let updatedCount = 0;

        for (const sku of skus) {
            let updates = {};

            if (!sku.technology) {
                updates.technology = technologies[Math.floor(Math.random() * technologies.length)];
            }
            if (!sku.wattage) {
                updates.wattage = wattages[Math.floor(Math.random() * wattages.length)];
            }
            if (!sku.productType) {
                // Try to guess from description or random
                updates.productType = productTypes[0]; // Default to Solar Panels
            }
            if (!sku.brand && brands.length > 0) {
                updates.brand = brands[Math.floor(Math.random() * brands.length)]._id;
            }
            if (!sku.projectType && projectTypes.length > 0) {
                updates.projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)].name; // Store name as String based on SKU model update?
                // Wait, SKU model projectType is String.
            }
            if (!sku.category && categories.length > 0) {
                updates.category = categories[Math.floor(Math.random() * categories.length)].name;
            }

            if (Object.keys(updates).length > 0) {
                await SKU.findByIdAndUpdate(sku._id, updates);
                updatedCount++;
            }
        }

        console.log(`Updated ${updatedCount} SKUs with missing data.`);
        process.exit();
    } catch (error) {
        console.error('Error fixing SKUs:', error);
        process.exit(1);
    }
};

fixSKUs();
