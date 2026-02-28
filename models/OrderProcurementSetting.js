import mongoose from 'mongoose';

const skuItemSchema = new mongoose.Schema({
    minRange: {
        type: Number,
        required: true,
        min: 0
    },
    maxRange: {
        type: Number,
        required: true,
        min: 0
    },
    comboKit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ComboKitAssignment'
    },
    supplierType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplierType',
        required: true
    }
});

const orderProcurementSettingSchema = new mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        },
        projectType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProjectType',
            required: true
        },
        subProjectType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubProjectType',
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BrandManufacturer',
            required: true
        },
        skuSelectionOption: {
            type: String,
            enum: ['ComboKit', 'Customize'],
            required: true,
            default: 'ComboKit'
        },
        skus: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SKU'
        }],
        skuItems: [skuItemSchema],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

export default mongoose.model('OrderProcurementSetting', orderProcurementSettingSchema);
