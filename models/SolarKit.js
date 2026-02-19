import mongoose from 'mongoose';

const solarKitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    kw: {
        type: String,
        required: true,
        // e.g., '5-10 kW'
    },
    inverter: {
        type: String,
        required: true,
    },
    panels: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    warranty: {
        type: String,
        required: true,
    },
    efficiency: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    panelBrand: {
        type: String,
        required: true,
    },
    inverterBrand: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['In-Stock', 'Out-of-Stock'],
        default: 'In-Stock',
    },
    type: {
        type: String,
        enum: ['Hybrid', 'On-Grid', 'Off-Grid'],
        required: true,
    },
    category: {
        type: String,
        enum: ['Roof Top', 'Ground Mount', 'Carport'],
        required: true,
        default: 'Roof Top',
    },
    subCategory: {
        type: String,
        enum: ['Commercial', 'Residential', 'Industrial', 'Mega'],
        required: true,
        default: 'Residential',
    },
    commissionRate: {
        type: Number,
        default: 0,
    },
    panelWatt: {
        type: String,
        required: true,
    },
    technology: {
        type: String,
        required: true,
    },
    priceBreakdown: [{
        dcCapacity: String,
        numberOfPanels: Number,
        price: Number
    }]
}, {
    timestamps: true,
});

const SolarKit = mongoose.model('SolarKit', solarKitSchema);

export default SolarKit;
