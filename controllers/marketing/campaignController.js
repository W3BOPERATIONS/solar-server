import Campaign from '../../models/marketing/Campaign.js';
import CampaignConfig from '../../models/marketing/CampaignConfig.js';
import SocialMediaCampaign from '../../models/marketing/SocialMediaCampaign.js';

// Create a new campaign
export const createCampaign = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // Basic validation for dates
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: 'Start date cannot be after end date' });
        }

        const campaign = new Campaign(req.body);
        await campaign.save();
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all campaigns with optional filtering
export const getAllCampaigns = async (req, res) => {
    try {
        const { status, type } = req.query;
        let query = {};

        if (status) query.status = status;
        if (type) query.campaignType = type;

        const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single campaign
export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update campaign
export const updateCampaign = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: 'Start date cannot be after end date' });
        }

        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        // Update fields
        Object.keys(req.body).forEach(key => {
            campaign[key] = req.body[key];
        });

        // Save triggers pre-save hook for auto-calculation
        await campaign.save();

        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete campaign
export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Dashboard Stats
export const getCampaignStats = async (req, res) => {
    try {
        const stats = await Campaign.aggregate([
            {
                $group: {
                    _id: null,
                    totalCampaigns: { $sum: 1 },
                    activeCampaigns: {
                        $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
                    },
                    totalLeads: { $sum: "$actualLeads" },
                    totalRevenue: { $sum: "$revenueGenerated" },
                    totalBudget: { $sum: "$budget" },
                    avgConversion: { $avg: "$conversionRate" }
                }
            }
        ]);

        const result = stats[0] || {
            totalCampaigns: 0,
            activeCampaigns: 0,
            totalLeads: 0,
            totalRevenue: 0,
            totalBudget: 0,
            avgConversion: 0
        };

        // Calculate ROI: ((Revenue - Budget) / Budget) * 100
        const roi = result.totalBudget > 0
            ? ((result.totalRevenue - result.totalBudget) / result.totalBudget) * 100
            : 0;

        res.status(200).json({ ...result, marketingROI: parseFloat(roi.toFixed(2)) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Configuration Controllers
export const getCampaignConfig = async (req, res, next) => {
    try {
        const config = await CampaignConfig.getOrCreate();
        res.json({ success: true, data: config });
    } catch (err) {
        next(err || new Error('Internal Server Error'));
    }
};

export const updateCampaignConfig = async (req, res, next) => {
    try {
        let config = await CampaignConfig.findOne();
        if (!config) {
            config = new CampaignConfig(req.body);
        } else {
            // Explicitly update all fields to ensure Mongoose tracks changes
            const {
                defaultNameFormat,
                campaignTypes,
                cprmConversion,
                companyConversion,
                defaultCompanyBudget,
                defaultCprmBudget
            } = req.body;

            if (defaultNameFormat !== undefined) config.defaultNameFormat = defaultNameFormat;
            if (cprmConversion !== undefined) config.cprmConversion = cprmConversion;
            if (companyConversion !== undefined) config.companyConversion = companyConversion;
            if (defaultCompanyBudget !== undefined) config.defaultCompanyBudget = defaultCompanyBudget;
            if (defaultCprmBudget !== undefined) config.defaultCprmBudget = defaultCprmBudget;

            if (campaignTypes && Array.isArray(campaignTypes)) {
                config.campaignTypes = campaignTypes;
                config.markModified('campaignTypes');
            }
        }
        config.updatedBy = req.user?._id;
        await config.save();
        res.json({ success: true, message: 'Settings updated successfully', data: config });
    } catch (err) {
        console.error('Update Config Error:', err);
        next(err || new Error('Internal Server Error'));
    }
};

// Social Media Campaign Controllers
export const getAllSocialCampaigns = async (req, res, next) => {
    try {
        const campaigns = await SocialMediaCampaign.find()
            .populate('state')
            .populate('cluster')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: campaigns.length, data: campaigns });
    } catch (err) {
        next(err || new Error('Internal Server Error'));
    }
};

export const createSocialCampaign = async (req, res, next) => {
    try {
        const campaign = await SocialMediaCampaign.create({
            ...req.body,
            createdBy: req.user?._id
        });
        await campaign.populate(['state', 'cluster']);
        res.status(201).json({ success: true, data: campaign });
    } catch (err) {
        next(err || new Error('Internal Server Error'));
    }
};

export const updateSocialCampaign = async (req, res, next) => {
    try {
        const campaign = await SocialMediaCampaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate(['state', 'cluster']);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        res.json({ success: true, data: campaign });
    } catch (err) {
        next(err || new Error('Internal Server Error'));
    }
};

export const deleteSocialCampaign = async (req, res, next) => {
    try {
        const campaign = await SocialMediaCampaign.findByIdAndDelete(req.params.id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        res.json({ success: true, message: 'Campaign deleted successfully' });
    } catch (err) {
        next(err || new Error('Internal Server Error'));
    }
};
