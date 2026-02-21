import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        mobile: {
            type: String,
            required: true,
            trim: true
        },
        whatsapp: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        state: {
            type: String
        },
        district: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District',
            required: true
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cluster' // Using Cluster as City based on frontend usage
        },
        solarType: {
            type: String,
            required: true
        },
        subType: {
            type: String
        },
        kw: {
            type: String,
            required: true
        },
        billAmount: {
            type: Number,
            default: 0
        },
        rural: {
            type: String
        },
        sourceOfMedia: {
            type: String
        },
        profession: {
            type: String
        },
        status: {
            type: String,
            enum: ['New', 'SurveyPending', 'SurveyCompleted', 'QuoteGenerated', 'ProjectStart', 'ProjectSigned', 'Converted'],
            default: 'New'
        },
        dealer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        history: [{
            action: String,
            date: { type: Date, default: Date.now },
            by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }],

        quote: {
            totalAmount: Number,
            commission: Number,
            netAmount: Number,
            systemSize: String,
            generatedAt: Date
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
