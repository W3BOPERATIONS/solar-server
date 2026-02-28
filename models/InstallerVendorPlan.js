import mongoose from 'mongoose';

const installerVendorPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        stateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State',
            required: true
        },
        clusterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cluster',
            required: true
        },
        districtId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District',
            required: true
        },
        requirements: [{
            type: String
        }],
        coverage: {
            type: String,
            default: "1 District"
        },
        projectTypes: [{
            type: String
        }],
        subscription: {
            type: String,
            default: "0"
        },
        paymentMethods: [{
            type: String
        }],
        teams: {
            residential: { type: Number, default: 0 },
            commercial: { type: Number, default: 0 }
        },
        rates: {
            resOnGrid: { type: String, default: "0" },
            resOffGrid: { type: String, default: "0" },
            comOnGrid: { type: String, default: "0" },
            comOffGrid: { type: String, default: "0" }
        },
        weeklyKWAssign: {
            residential: { type: String, default: "0" },
            commercial: { type: String, default: "0" }
        }
    },
    {
        timestamps: true
    }
);

// Unique index for plan name within same district
installerVendorPlanSchema.index({ name: 1, districtId: 1 }, { unique: true });

export default mongoose.model('InstallerVendorPlan', installerVendorPlanSchema);
