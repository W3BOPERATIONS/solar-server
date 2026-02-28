import mongoose from 'mongoose';

const amcPlanSchema = new mongoose.Schema({
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMCService'
    }],
    planName: {
        type: String,
        required: true,
        default: 'Basic Plan'
    },
    category: {
        type: String,
        default: 'Solar Rooftop'
    },
    subCategory: {
        type: String,
        default: 'Residential'
    },
    projectType: {
        type: String,
        default: '3-5 kW'
    },
    subProjectType: {
        type: String,
        default: 'On-Grid'
    },
    monthlyCharge: {
        type: Number,
        default: 0
    },
    yearlyCharge: {
        type: Number,
        default: 0
    },
    annualVisits: {
        type: Number,
        default: 4
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model('AMCPlan', amcPlanSchema);
