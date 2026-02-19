import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import InventoryItem from '../models/InventoryItem.js';

dotenv.config();

const debugCreate = async () => {
    try {
        await connectDB();

        const payload = {
            warehouse: '6990bc40e8f1832def13c011',
            state: '698ec22074ad511677c36f84',
            cluster: '698ec24a74ad511677c36fcb',
            district: '698ec23d74ad511677c36fac',
            itemName: 'djhdjke',
            category: 'Accessories',
            subCategory: '',
            projectType: 'Residential',
            subProjectType: '',
            brand: '698ec10da5b202f82dc483dc',
            technology: 'Thin Film',
            wattage: 400,
            productType: 'Accessories',
            sku: 'Panel-500-DEBUG-' + Date.now(), // Ensure unique
            quantity: 522,
            price: 0,
            // Mock req.user.id
            createdBy: '698ec10da5b202f82dc483dc' // Using brand ID as a valid ObjectId for testing
        };

        console.log('Attempting to save item:', payload);

        const newItem = new InventoryItem(payload);
        await newItem.save();

        console.log('SUCCESS: Item saved successfully!');
        process.exit();
    } catch (error) {
        console.error('FAILURE: Error saving item:', error);
        process.exit(1);
    }
};

debugCreate();
