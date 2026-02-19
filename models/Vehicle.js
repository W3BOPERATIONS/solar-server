import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String, // e.g., 'Open Truck', 'Container Truck'
            required: true,
        },
        deliveryType: {
            type: String, // e.g., 'Prime', 'Regular'
            required: true,
        },
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        capacity: {
            type: String, // e.g., '10 Tons' (keeping as string as per frontend or mix) - User said 'Capacity / Cost per KM' in req.
            // Frontend uses capacity as string/number input.
            required: true,
        },
        costPerKm: {
            type: Number,
            default: 0, // Frontend didn't show this in the form explicitly in my read, but User Req asked for it.
        },
        kw: {
            type: Number, // Solar Panel Capacity
        },
        range: {
            type: Number, // Maximum Range
        },
        orderType: {
            type: String, // 'Combokit', 'CustomKit'
        },
        locationType: {
            type: String, // 'Rural', 'Urban'
        },
        image: {
            type: String, // URL or Base64
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);
