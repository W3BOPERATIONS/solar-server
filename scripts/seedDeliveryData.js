import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import State from '../models/State.js';
import Cluster from '../models/Cluster.js';
import District from '../models/District.js';
import City from '../models/City.js';

dotenv.config();

const seedDeliveryData = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/solarkit';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // 1. Setup Locations
        let state = await State.findOne({ name: 'Gujarat' });
        if (!state) state = await State.create({ name: 'Gujarat', code: 'GJ', country: new mongoose.Types.ObjectId() }); // Dummy country ID if needed

        let city = await City.findOne({ state: state._id });
        if (!city) city = await City.create({ name: 'Rajkot', state: state._id });

        let district = await District.findOne({ state: state._id });
        if (!district) district = await District.create({ name: 'Rajkot', state: state._id, city: city._id });

        let cluster = await Cluster.findOne({ state: state._id });
        if (!cluster) cluster = await Cluster.create({ name: 'South', state: state._id, district: district._id });

        console.log(`📍 Location ensured: ${state.name} > ${cluster.name} > ${district.name}`);

        // 2. Setup Users
        let deliveryPartner = await User.findOne({ role: 'delivery_manager' });
        if (!deliveryPartner) {
            deliveryPartner = await User.create({
                name: 'Fast Logistics',
                email: 'logistics@example.com',
                password: 'password123',
                role: 'delivery_manager',
                phone: '1234567890',
                state: state.name
            });
        }

        let customer = await User.findOne({ email: 'customer@example.com' });
        if (!customer) {
            customer = await User.create({
                name: 'Demo Customer',
                email: 'customer@example.com',
                password: 'password123',
                role: 'dealer',
                phone: '9876543210',
                state: state.name
            });
        }

        // 3. Create Orders & Deliveries
        await Delivery.deleteMany({}); // Clear old data for clean dashboard test
        await Order.deleteMany({ orderNumber: { $regex: /DEL-/ } });

        const deliveryTypes = ['prime', 'regular', 'express', 'bulk'];
        const statuses = ['pending', 'scheduled', 'in_transit', 'delivered'];
        const categories = ['Solar Rooftop', 'Solar Street Light', 'Solar Pump'];
        const projectTypes = ['Up To 3KW', 'Below 3KW', 'Customized Kit', 'ComboKit'];

        const deliveries = [];

        for (let i = 0; i < 20; i++) {
            const type = deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];

            // Random Date within last 3 months
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 90));

            // Create Order first
            const order = await Order.create({
                orderNumber: `DEL-ORD-${1000 + i}`,
                user: customer._id,
                totalAmount: 15000 + Math.random() * 50000,
                subTotal: 10000,
                status: 'confirmed',
                items: [],
                projectType: projectType // Store project type in Order too
            });

            deliveries.push({
                deliveryNumber: `DEL-${1000 + i}`,
                order: order._id,
                deliveryPartner: deliveryPartner._id,
                deliveryType: type,
                scheduledDate: new Date(), // Today
                actualDeliveryDate: status === 'delivered' ? date : null,
                status: status,
                deliveryCost: 500 + Math.random() * 2000,
                distance: 10 + Math.random() * 100, // km
                state: state._id, // Link as Object ID
                cluster: cluster._id,
                district: district._id,
                city: city._id,
                category: category,
                projectType: projectType,
                timeline: 'May 2025', // Static timeline string for now or dynamic
                createdAt: date // For timeline filtering
            });
        }

        await Delivery.insertMany(deliveries);
        console.log(`🚚 Seeded ${deliveries.length} deliveries.`);
        console.log('✅ Seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDeliveryData();
