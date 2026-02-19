import mongoose from 'mongoose';

const skuSchema = new mongoose.Schema(
    {
        skuCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
        },
        category: {
            type: String,
        },
        projectType: {
            type: String,
        },
        productType: {
            type: String,
        },
        subCategory: {
            type: String,
        },
        subProjectType: {
            type: String,
        },
        technology: {
            type: String,
        },
        wattage: {
            type: Number,
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

export default mongoose.model('SKU', skuSchema);
