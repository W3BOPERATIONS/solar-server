import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Models
import SupplierVendor from '../models/SupplierVendor.js';
import VendorOrder from '../models/VendorOrder.js';
import State from '../models/State.js';
import Cluster from '../models/Cluster.js';
import SupplierType from '../models/SupplierType.js';
import District from '../models/District.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try loading from current directory first (since we run from server/)
dotenv.config();

// If not found, try explicit path relative to script
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: join(__dirname, '../.env') });
}

const seedData = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // 1. Get Location Data
        const state = await State.findOne();
        if (!state) {
            console.error('No State found. Please seed locations first.');
            process.exit(1);
        }

        // Find a district in this state
        const district = await District.findOne({ state: state._id });
        if (!district) {
            console.error(`No District found for state ${state.name}.`);
            process.exit(1);
        }

        // Find a cluster in this district or state
        let cluster = await Cluster.findOne({ district: district._id });
        if (!cluster) {
            cluster = await Cluster.findOne({ state: state._id });
        }

        if (!cluster) {
            console.error('No Cluster found. Please seed locations first.');
            process.exit(1);
        }

        console.log(`Using State: ${state.name}, District: ${district.name}, Cluster: ${cluster.name}`);

        // 2. Clear existing Orders
        await VendorOrder.deleteMany({});
        console.log('Cleared existing Vendor Orders');

        // 3. Ensure SupplierType exists
        let supplierType = await SupplierType.findOne({ typeName: 'Solar Components' });
        if (!supplierType) {
            try {
                supplierType = await SupplierType.create({ typeName: 'Solar Components', description: 'Panels, Inverters, etc.' });
                console.log('Created SupplierType: Solar Components');
            } catch (err) {
                // If it exists (race condition or other), try fetching again
                console.log('SupplierType creation failed (likely exists), fetching...');
                supplierType = await SupplierType.findOne({ typeName: 'Solar Components' });
            }
        }

        if (!supplierType) {
            console.error('Could not get SupplierType');
            process.exit(1);
        }

        // 4. Create/Get Vendors
        const vendorNames = ['SunPower Solutions', 'BrightSolar', 'SolarMax Vendors', 'GreenVolt Pvt Ltd', 'EcoSun Enterprises'];
        let vendors = [];

        for (const name of vendorNames) {
            try {
                let vendor = await SupplierVendor.findOne({ name });
                if (!vendor) {
                    // Check if email exists?
                    const email = `${name.replace(/\s/g, '').toLowerCase()}@example.com`;
                    const existingEmail = await SupplierVendor.findOne({ email });

                    if (existingEmail) {
                        console.log(`Vendor with email ${email} exists but name differs. Using existing vendor.`);
                        vendor = existingEmail;
                    } else {
                        vendor = await SupplierVendor.create({
                            name,
                            supplierTypeId: supplierType._id,
                            contact: '9876543210',
                            email: email,
                            status: Math.random() > 0.2 ? 'Active' : 'Inactive',
                            state: state._id,
                            cluster: cluster._id,
                            district: district._id
                        });
                        console.log(`Created Vendor: ${name}`);
                    }
                } else {
                    console.log(`Found Vendor: ${name}`);
                }
                vendors.push(vendor);
            } catch (err) {
                console.error(`Error processing vendor ${name}:`, err.message);
            }
        }

        if (vendors.length === 0) {
            console.error('No vendors available to create orders.');
            process.exit(1);
        }

        // 5. Create Orders
        const statuses = ['Delivered', 'In Transit', 'Delayed', 'Pending'];
        const brands = ['Adani', 'Waaree', 'Vikram', 'Tata Power', 'RenewSys'];
        const products = ['Solar Panel 320W', 'Inverter 5KW', 'Solar Battery 150AH', 'Mounting Structure', 'Cables'];

        const orders = [];

        for (let i = 0; i < 20; i++) {
            const vendor = vendors[Math.floor(Math.random() * vendors.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const product = products[Math.floor(Math.random() * products.length)];

            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 45));

            orders.push({
                orderNo: `#ORD-${1000 + i}`,
                vendorId: vendor._id,
                brand,
                product,
                deliveryDate: date,
                status,
                stateId: state._id,
                clusterId: cluster._id,
                transactionValue: Math.floor(Math.random() * 500000) + 50000,
                createdAt: date
            });
        }

        await VendorOrder.insertMany(orders);
        console.log(`Created ${orders.length} Vendor Orders`);

        console.log('Seeding Completed Successfully');
        process.exit(0);

    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
