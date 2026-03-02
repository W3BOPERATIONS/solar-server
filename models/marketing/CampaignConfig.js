import mongoose from 'mongoose';

const campaignConfigSchema = new mongoose.Schema({
    defaultNameFormat: {
        type: String,
        default: 'Default Campaign Name Format'
    },
    campaignTypes: [{
        type: String,
        trim: true
    }],
    cprmConversion: {
        type: Number,
        default: 0
    },
    companyConversion: {
        type: Number,
        default: 0
    },
    defaultCompanyBudget: {
        type: Number,
        default: 0
    },
    defaultCprmBudget: {
        type: Number,
        default: 0
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Singleton logic - we only want one config document
campaignConfigSchema.statics.getOrCreate = async function () {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({
            campaignTypes: ['company', 'CPRM'],
            cprmConversion: 12,
            companyConversion: 32,
            defaultCompanyBudget: 5000,
            defaultCprmBudget: 2500
        });
    }
    return config;
};

export default mongoose.model('CampaignConfig', campaignConfigSchema);
