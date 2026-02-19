import mongoose from 'mongoose';

const supplierTypeSchema = new mongoose.Schema(
    {
        typeName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('SupplierType', supplierTypeSchema);
