import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Warehouse from '../models/Warehouse.js';
import State from '../models/State.js';
import District from '../models/District.js';
import Cluster from '../models/Cluster.js';

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try resolving .env from server root (one level up from scripts)
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Fallback: try loading from CWD/server/.env if running from root
if (!process.env.MONGODB_URI) {
    const rootEnvPath = path.resolve(process.cwd(), 'server/.env');
    console.log('Fallback: Loading .env from:', rootEnvPath);
    dotenv.config({ path: rootEnvPath });
}

const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!connStr) throw new Error('MongoDB URI not found in environment variables');

        await mongoose.connect(connStr);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('🧹 Clearing old inventory data...');
        // Optional: clear if you want fresh start
        // await mongoose.connection.db.dropCollection('inventoryitems').catch(() => {});
        // await mongoose.connection.db.dropCollection('products').catch(() => {});
        // await mongoose.connection.db.dropCollection('skus').catch(() => {});
        // await mongoose.connection.db.dropCollection('brands').catch(() => {});
        // await mongoose.connection.db.dropCollection('orders').catch(() => {});

        console.log('📍 Fetching location data...');
        const state = await State.findOne({ name: 'Gujarat' });
        const district = await District.findOne({ state: state?._id });
        const cluster = await Cluster.findOne({ district: district?._id });
        const city = await mongoose.model('City').findOne({ state: state?._id });

        if (!state || !district || !cluster) {
            console.log('❌ Location data missing. Please run location seeder first.');
            process.exit(1);
        }

        console.log('🏷️ Seeding Metadata (Brand, Category, Unit, SKU)...');

        let brand = await mongoose.model('Brand').findOne({ brandName: 'Luminous' });
        if (!brand) brand = await mongoose.model('Brand').create({ brandName: 'Luminous', status: 'Active' });

        let tata = await mongoose.model('Brand').findOne({ brandName: 'Tata' });
        if (!tata) tata = await mongoose.model('Brand').create({ brandName: 'Tata', status: 'Active' });

        let category = await mongoose.model('Category').findOne({ name: 'Solar Panels' });
        // Need project type for category
        if (!category) {
            const pt = await mongoose.model('ProjectType').findOne({});
            if (pt) category = await mongoose.model('Category').create({ name: 'Solar Panels', projectTypeId: pt._id });
        }

        let unit = await mongoose.model('Unit').findOne({ symbol: 'Nos' });
        if (!unit) unit = await mongoose.model('Unit').create({ unitName: 'Numbers', symbol: 'Nos' });

        // Create SKUs
        const skus = [];
        const skuCodes = ['SOL-500W', 'BAT-150AH', 'INV-5KVA'];
        for (const code of skuCodes) {
            let s = await mongoose.model('SKU').findOne({ skuCode: code });
            if (!s) s = await mongoose.model('SKU').create({ skuCode: code, description: code });
            skus.push(s);
        }

        console.log('📦 Seeding Products...');
        // Products are catalog definitions
        const products = [];
        if (category && unit && skus.length > 0) {
            const pData = [
                { name: 'Luminous Solar Panel 500W', skuId: skus[0]._id, categoryId: category._id, unitId: unit._id },
                { name: 'Tata Battery 150Ah', skuId: skus[1]._id, categoryId: category._id, unitId: unit._id },
            ];

            for (const p of pData) {
                let prod = await Product.findOne({ name: p.name });
                if (!prod) {
                    prod = await Product.create({
                        ...p,
                        stateId: state._id,
                        cityId: city?._id || district._id, // Fallback if city missing but usually valid
                        districtId: district._id
                    });
                }
                products.push(prod);
            }
        }

        console.log('🏭 Seeding Inventory Items (Stock)...');
        // Inventory Items are the actual stock at a location
        await mongoose.model('InventoryItem').create([
            {
                itemName: 'Luminous Solar Panel 500W',
                brand: brand._id,
                category: 'solarpanel', // String field in InventoryItem
                sku: skus[0].skuCode,
                quantity: 150,
                price: 12000,
                minLevel: 20,
                state: state._id,
                district: district._id,
                cluster: cluster._id,
                city: city?._id
            },
            {
                itemName: 'Tata Battery 150Ah',
                brand: tata._id,
                category: 'battery',
                sku: skus[1].skuCode,
                quantity: 5, // Low stock
                price: 15000,
                minLevel: 10,
                state: state._id,
                district: district._id,
                cluster: cluster._id,
                city: city?._id
            },
            {
                itemName: 'Luminous Inverter 5kVA',
                brand: brand._id,
                category: 'inverter',
                sku: skus[2].skuCode,
                quantity: 12,
                price: 45000,
                minLevel: 5,
                state: state._id,
                district: district._id,
                cluster: cluster._id,
                city: city?._id
            }
        ]);

        console.log('🚚 Seeding Orders...');
        if (products.length > 0) {
            // Create a user for orders if none exists
            const user = await mongoose.model('User').findOne({});

            const orderData = [];
            for (let i = 0; i < 6; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);

                orderData.push({
                    orderNumber: `ORD-${Date.now()}-${i}`,
                    user: user?._id || new mongoose.Types.ObjectId(), // Just to populate
                    customer: {
                        name: `Customer ${i}`,
                        state: state._id,
                        district: district._id,
                        cluster: cluster._id
                    },
                    items: [
                        { product: products[0]._id, quantity: Math.floor(Math.random() * 5) + 1, price: 12000, total: 12000 }
                    ],
                    subTotal: 12000,
                    totalAmount: 12000,
                    status: 'delivered',
                    createdAt: date,
                    updatedAt: date
                });
            }
            await Order.create(orderData);
        }

        console.log('✅ Verified Inventory Seed Completed!');
        console.log('👉 Dashboard Check:');
        console.log('   - Total items should appear in summary.');
        console.log('   - Low stock alerts (Tata Battery).');
        console.log('   - Value calculation based on Quantity * Price.');

    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedData();
