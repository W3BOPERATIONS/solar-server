import mongoose from 'mongoose';

const franchiseePlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        price: {
            type: Number,
            required: true,
        },
        priceDescription: {
            type: String,
            default: 'signup fees',
        },
        yearlyTargetKw: {
            type: Number,
            default: 0,
        },
        cashbackAmount: {
            type: Number,
            default: 0,
        },
        accessType: {
            type: String,
            default: '',
        },
        userLimit: {
            type: Number, // -1 for unlimited
            default: 1,
        },
        userDescription: {
            type: String,
            default: ''
        },
        projectTypes: [{
            name: String,
            image: String
        }],
        features: [{
            type: String,
        }],
        documents: [{
            type: String,
        }],
        depositFees: {
            type: Number,
            default: 0,
        },
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State',
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        colorArgs: {
            buttonColor: String,
            headerColor: String,
            iconColor: String,
            bgColor: String
        }
    },
    {
        timestamps: true,
    }
);

// Unique plan name per state
franchiseePlanSchema.index({ name: 1, state: 1 }, { unique: true });

export default mongoose.model('FranchiseePlan', franchiseePlanSchema);
