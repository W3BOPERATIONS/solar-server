import mongoose from 'mongoose';

const deliveryBenchmarkPriceSchema = new mongoose.Schema(
    {
        deliveryType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeliveryType',
            required: true,
        },
        benchmarkPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    { timestamps: true }
);

// Prevent duplicate benchmark prices for the same delivery type
deliveryBenchmarkPriceSchema.index({ deliveryType: 1 }, { unique: true });

export default mongoose.model('DeliveryBenchmarkPrice', deliveryBenchmarkPriceSchema);
