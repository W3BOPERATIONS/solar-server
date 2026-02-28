import mongoose from 'mongoose';

const installerAgencyPlanSchema = new mongoose.Schema({
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    name: { type: String, required: true, trim: true },
    eligibility: {
        kyc: { type: Boolean, default: false },
        agreement: { type: Boolean, default: false }
    },
    coverage: { type: String, default: '' },
    userLimits: { type: Number, default: 0 },
    subUser: {
        sales: { type: Boolean, default: false },
        dealer: { type: Boolean, default: false },
        leadPartner: { type: Boolean, default: false },
        service: { type: Boolean, default: false }
    },
    assignedProjectTypes: {
        district: { type: Boolean, default: false },
        cluster: { type: Boolean, default: false },
        state: { type: Boolean, default: false }
    },
    categoryType: {
        solarPanel: { type: Boolean, default: false },
        solarRooftop: { type: Boolean, default: false },
        solarPump: { type: Boolean, default: false },
        solarWaterHeater: { type: Boolean, default: false }
    },
    subCategoryType: {
        residential: { type: Boolean, default: false },
        commercial: { type: Boolean, default: false }
    },
    projectType: {
        upTo100Kw: { type: Boolean, default: false },
        upTo200Kw: { type: Boolean, default: false },
        above100Kw: { type: Boolean, default: false }
    },
    subProjectType: {
        onGrid: { type: Boolean, default: false },
        offGrid: { type: Boolean, default: false },
        hybrid: { type: Boolean, default: false }
    },
    solarInstallationPoints: [{
        typeLabel: { type: String },
        points: { type: Number, default: 0 },
        periodInMonth: { type: Number, default: 0 },
        claimInMonth: { type: Number, default: 0 }
    }],
    solarInstallationCharges: [{
        typeLabel: { type: String },
        charges: { type: Number, default: 0 }
    }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model('InstallerAgencyPlan', installerAgencyPlanSchema);
