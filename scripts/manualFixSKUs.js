import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import SKU from '../models/SKU.js';
import Brand from '../models/Brand.js';
import ProjectType from '../models/ProjectType.js';
import Category from '../models/Category.js';

dotenv.config();

const manualFix = async () => {
    try {
        await connectDB();

        // Fetch masters
        const brand = await Brand.findOne({ brandName: 'Adani Solar' });
        const category = await Category.findOne({ name: 'Commercial' }) || await Category.findOne({});
        const projectType = await ProjectType.findOne({ name: 'Residential' }) || await ProjectType.findOne({});

        console.log('Target Masters:', {
            brand: brand?._id,
            category: category?.name,
            projectType: projectType?.name
        });

        const skus = await SKU.find({});
        console.log(`Found ${skus.length} SKUs to update.`);

        for (const sku of skus) {
            const update = {
                technology: 'Thin Film',
                wattage: 400,
                productType: 'Accessories', // Match user screenshot
                brand: brand?._id, // Match user screenshot
                category: category?.name || 'Commercial',
                projectType: projectType?.name || 'Residential'
            };

            // Force update with strict: false to bypass schema if needed (though schema is updated)
            await SKU.collection.updateOne(
                { _id: sku._id },
                { $set: update }
            );
            console.log(`Updated SKU ${sku.skuCode}`);
        }

        console.log('Manual fix complete.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

manualFix();
