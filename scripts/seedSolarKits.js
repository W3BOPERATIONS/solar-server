import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js'; // Adjust path as needed
import SolarKit from '../models/SolarKit.js';

dotenv.config();

const solarKits = [
    {
        name: 'Premium Solar Kit Pro',
        brand: 'Luminous',
        kw: '5-10 kW',
        inverter: 'Luminous 8kVA Hybrid',
        panels: '16 x 500W Mono PERC',
        price: 32500,
        warranty: '12 years',
        efficiency: '23%',
        description: 'Perfect for large homes with high energy consumption. Includes smart monitoring and battery backup.',
        panelBrand: 'Adani',
        inverterBrand: 'Vsole',
        status: 'In-Stock',
        type: 'Hybrid',
        category: 'Roof Top',
        subCategory: 'Commercial',
        commissionRate: 12.5,
        panelWatt: '500W',
        technology: 'Topcon',
        priceBreakdown: [
            { dcCapacity: '1 kW', numberOfPanels: 2, price: 65000 },
            { dcCapacity: '2 kW', numberOfPanels: 4, price: 130000 },
            { dcCapacity: '3 kW', numberOfPanels: 6, price: 195000 },
            { dcCapacity: '5 kW', numberOfPanels: 10, price: 260000 },
            { dcCapacity: '8 kW', numberOfPanels: 16, price: 325000 },
        ]
    },
    {
        name: 'Economy Solar Kit',
        brand: 'Microtek',
        kw: '5-10 kW',
        inverter: 'Microtek 5.2kVA On-Grid',
        panels: '13 x 400W Poly',
        price: 18500,
        warranty: '10 years',
        efficiency: '21%',
        description: 'Cost-effective solution for medium consumption homes. Reliable performance with basic features.',
        panelBrand: 'Waree',
        inverterBrand: 'Microtek',
        status: 'In-Stock',
        type: 'On-Grid',
        category: 'Roof Top',
        subCategory: 'Commercial',
        commissionRate: 10.0,
        panelWatt: '400W',
        technology: 'Bifacial',
        priceBreakdown: [
            { dcCapacity: '1 kW', numberOfPanels: 3, price: 37000 },
            { dcCapacity: '2 kW', numberOfPanels: 5, price: 74000 },
            { dcCapacity: '3 kW', numberOfPanels: 6, price: 111000 },
            { dcCapacity: '5 kW', numberOfPanels: 13, price: 185000 },
        ]
    },
    {
        name: 'Commercial Solar Kit',
        brand: 'Huawei',
        kw: '10-15 kW',
        inverter: 'Huawei 15kVA Hybrid',
        panels: '30 x 500W Topcon',
        price: 67500,
        warranty: '15 years',
        efficiency: '24%',
        description: 'Industrial grade solution for commercial establishments. High efficiency and durability.',
        panelBrand: 'Canadian Solar',
        inverterBrand: 'Huawei',
        status: 'Out-of-Stock',
        type: 'Hybrid',
        category: 'Ground Mount',
        subCategory: 'Mega',
        commissionRate: 15.0,
        panelWatt: '500W',
        technology: 'Topcon',
        priceBreakdown: [
            { dcCapacity: '5 kW', numberOfPanels: 10, price: 225000 },
            { dcCapacity: '10 kW', numberOfPanels: 20, price: 450000 },
            { dcCapacity: '15 kW', numberOfPanels: 30, price: 675000 },
        ]
    },
    {
        name: 'Off-Grid Home Kit',
        brand: 'Luminous',
        kw: '1-5 kW',
        inverter: 'Luminous 3kVA Off-Grid',
        panels: '6 x 500W Bifacial',
        price: 12500,
        warranty: '10 years',
        efficiency: '22%',
        description: 'Perfect for areas with frequent power cuts. Battery backup included.',
        panelBrand: 'Adani',
        inverterBrand: 'Luminous',
        status: 'In-Stock',
        type: 'Off-Grid',
        category: 'Roof Top',
        subCategory: 'Residential',
        commissionRate: 9.0,
        panelWatt: '500W',
        technology: 'Bifacial',
        priceBreakdown: [
            { dcCapacity: '1 kW', numberOfPanels: 2, price: 25000 },
            { dcCapacity: '2 kW', numberOfPanels: 4, price: 50000 },
            { dcCapacity: '3 kW', numberOfPanels: 6, price: 125000 },
        ]
    },
    {
        name: 'Small Hybrid Kit',
        brand: 'Microtek',
        kw: '1-5 kW',
        inverter: 'Microtek 2.5kVA Hybrid',
        panels: '5 x 500W Topcon',
        price: 9500,
        warranty: '10 years',
        efficiency: '21%',
        description: 'Compact hybrid solution for small homes and offices.',
        panelBrand: 'Waree',
        inverterBrand: 'Microtek',
        status: 'In-Stock',
        type: 'Hybrid',
        category: 'Roof Top',
        subCategory: 'Residential',
        commissionRate: 8.5,
        panelWatt: '500W',
        technology: 'Topcon',
        priceBreakdown: [
            { dcCapacity: '1 kW', numberOfPanels: 2, price: 19000 },
            { dcCapacity: '2 kW', numberOfPanels: 4, price: 38000 },
            { dcCapacity: '2.5 kW', numberOfPanels: 5, price: 95000 },
        ]
    },
    {
        name: 'Industrial Solar Kit',
        brand: 'Huawei',
        kw: '15+ kW',
        inverter: 'Huawei 20kVA Hybrid',
        panels: '40 x 500W Topcon',
        price: 85000,
        warranty: '15 years',
        efficiency: '24%',
        description: 'Heavy duty solution for industrial applications.',
        panelBrand: 'Canadian Solar',
        inverterBrand: 'Huawei',
        status: 'In-Stock',
        type: 'Hybrid',
        category: 'Ground Mount',
        subCategory: 'Industrial',
        commissionRate: 18.0,
        panelWatt: '500W',
        technology: 'Topcon',
        priceBreakdown: [
            { dcCapacity: '15 kW', numberOfPanels: 30, price: 675000 },
            { dcCapacity: '20 kW', numberOfPanels: 40, price: 850000 },
        ]
    },
];

const seedSolarKits = async () => {
    try {
        await connectDB();

        await SolarKit.deleteMany(); // Clear existing
        console.log('Cleared existing solar kits');

        await SolarKit.insertMany(solarKits);
        console.log('Solar kits seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding solar kits:', error);
        process.exit(1);
    }
};

seedSolarKits();
