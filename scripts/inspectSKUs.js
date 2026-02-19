import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import SKU from '../models/SKU.js';
import Brand from '../models/Brand.js';

dotenv.config();

const inspectSKUs = async () => {
    try {
        await connectDB();
        const skus = await SKU.find({}).populate('brand');
        console.log('--- SKU INSPECTION ---');
        skus.forEach(sku => {
            console.log(`SKU: ${sku.skuCode} | Brand: ${sku.brand?.brandName} | Cat: ${sku.category} | PType: ${sku.projectType} | Type: ${sku.productType} | Tech: ${sku.technology} | Watt: ${sku.wattage}`);
        });
        console.log('----------------------');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

inspectSKUs();
