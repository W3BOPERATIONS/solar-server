import mongoose from 'mongoose';

const socialMediaCampaignSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
        enum: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Google', 'Other']
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    cluster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cluster',
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    quarter: {
        type: String,
        enum: ['January-March', 'April-June', 'July-September', 'October-December'],
        required: true
    },
    budget: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

export default mongoose.model('SocialMediaCampaign', socialMediaCampaignSchema);
