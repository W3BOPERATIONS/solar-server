import mongoose from 'mongoose';

const discomSchema = new mongoose.Schema({
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    projects: [{
        category: String,
        subCategory: String,
        projectType: String,
        subProjectType: String,
        unitPrice: Number,
        billTariff: Number
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Discom', discomSchema);
