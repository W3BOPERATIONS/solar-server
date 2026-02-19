import Campaign from '../models/Campaign.js';

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
