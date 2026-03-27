import mongoose from 'mongoose';

const installerVendorPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        countryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
            default: null
        },
        stateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State',
            default: null
        },
        clusterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cluster',
            default: null
        },
        districtId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District',
            default: null
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
            type: Map,
            of: Number,
            default: new Map()
        },
        rates: {
            resOnGrid: { type: String, default: "0" },
            resOffGrid: { type: String, default: "0" },
            comOnGrid: { type: String, default: "0" },
            comOffGrid: { type: String, default: "0" }
        },
        weeklyKWAssign: {
            type: Map,
            of: String,
            default: new Map()
        }
    },
    {
        timestamps: true
    }
);

// Unique index dropped in favor of logical uniqueness handled in controller
// installerVendorPlanSchema.index({ name: 1, districtId: 1 }, { unique: true });

export default mongoose.model('InstallerVendorPlan', installerVendorPlanSchema);
