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
