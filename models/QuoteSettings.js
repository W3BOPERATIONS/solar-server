import mongoose from 'mongoose';

const quoteSettingsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    subProjectType: {
        type: String,
        required: true
    },
    quoteType: {
        type: String,
        required: true
    },
    cpType: {
        type: String,
        required: true
    },
    solarSettings: {
        projectKW: { type: Number, default: 0 },
        unitPerKW: { type: Number, default: 0 }
    },
    monthlyIsolation: [{
        month: String,
        isolation: Number,
        total: Number
    }],
    selectedPages: [String],
    colorSettings: {
        brandColor: { type: Boolean, default: false },
        backgroundColor: { type: Boolean, default: false },
        pageSequence: { type: Boolean, default: false }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('QuoteSettings', quoteSettingsSchema);
