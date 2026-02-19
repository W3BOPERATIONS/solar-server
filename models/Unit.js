import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema(
    {
        unitName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        symbol: {
            type: String,
            required: true,
            unique: true,
            trim: true,
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

export default mongoose.model('Unit', unitSchema);
