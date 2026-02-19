import mongoose from 'mongoose';

const priceMasterSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            unique: true, // One price master entry per product
        },
        basePrice: {
            type: Number,
            required: true,
            default: 0
        },
        tax: {
            type: Number,
            required: true,
            default: 0 // Percentage
        },
        discount: {
            type: Number,
            default: 0 // Flat or Percentage? Plan implied flat reduction or we store final.
        },
        finalPrice: {
            type: Number,
            required: true,
            default: 0
        },
        status: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model('PriceMaster', priceMasterSchema);
