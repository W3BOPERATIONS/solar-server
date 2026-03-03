import mongoose from 'mongoose';

const installerAgencyPlanSchema = new mongoose.Schema({
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    minimumRating: { type: Number, default: 0 },
    planColor: { type: String, default: '#0070cc' }, // For top banner branding

    // Eligibility Requirements
    eligibility: {
        kyc: { type: Boolean, default: false },
        agreement: { type: Boolean, default: false }
    },
    coverage: { type: String, default: 'District' }, // e.g. District, State, Cluster

    // Sub User
    userLimits: { type: Number, default: 10 },
    subUser: {
        supervisor: { type: Boolean, default: false },
    },

    // Project Type Vise Installation Capacity (Array of rows)
    assignedProjectTypes: [{
        category: { type: String },
        subCategory: { type: String },
        projectType: { type: String },
        subProjectType: { type: String },
        capacity: { type: String },
        daysRequiredUnit: { type: String, default: 'Weeks' },
        daysRequiredVal: { type: String },
        active: { type: Boolean, default: false }
    }],

    // Solar Installation Points
    solarInstallationPoints: [{
        typeLabel: { type: String }, // e.g. Residential, Commercial up to 100 Kw
        points: { type: Number, default: 0 },
        periodInMonth: { type: Number, default: 0 },
        claimInMonth: { type: Number, default: 0 }
    }],

    // Solar Installation Charges
    solarInstallationCharges: [{
        typeLabel: { type: String }, // e.g. Residential, Commercial up to 100 Kw
        charges: { type: Number, default: 0 }
    }],

    // Pricing & Target (Right Summary Card)
    signupFees: { type: Number, default: 0 },
    yearlyTargetKw: { type: Number, default: 0 },
    incentive: { type: Number, default: 0 },
    depositFees: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model('InstallerAgencyPlan', installerAgencyPlanSchema);
