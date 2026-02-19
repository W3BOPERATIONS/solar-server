import SetPrice from '../models/SetPrice.js';
import SetPriceAmc from '../models/SetPriceAmc.js';
import Offer from '../models/Offer.js';
import SolarPanelBundle from '../models/SolarPanelBundle.js';

// ==========================================
// Set Price Logic
// ==========================================
export const createSetPrice = async (req, res) => {
    try {
        const newPrice = new SetPrice(req.body);
        const savedPrice = await newPrice.save();
        res.status(201).json(savedPrice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSetPrices = async (req, res) => {
    try {
        // Basic filter support
        const { state, district, cluster, category, subCategory } = req.query;
        const query = {};
        if (state) query.state = state; // Assuming frontend sends ID for now based on model or we adapt
        if (district) query.district = district;
        if (cluster) query.cluster = cluster;
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;

        const prices = await SetPrice.find(query)
            .populate('state', 'name')
            .populate('district', 'name')
            .populate('cluster', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(prices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateSetPrice = async (req, res) => {
    try {
        const updatedPrice = await SetPrice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedPrice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteSetPrice = async (req, res) => {
    try {
        await SetPrice.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Price deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ==========================================
// Set Price AMC Logic
// ==========================================
export const createSetPriceAmc = async (req, res) => {
    try {
        const newAmc = new SetPriceAmc(req.body);
        const savedAmc = await newAmc.save();
        res.status(201).json(savedAmc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSetPricesAmc = async (req, res) => {
    try {
        const { state, district, cluster } = req.query;
        const query = {};
        if (state) query.state = state;
        if (district) query.district = district;
        if (cluster) query.cluster = cluster;

        const amcPrices = await SetPriceAmc.find(query)
            .populate('state', 'name')
            .populate('district', 'name')
            .populate('cluster', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(amcPrices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateSetPriceAmc = async (req, res) => {
    try {
        const updatedAmc = await SetPriceAmc.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedAmc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteSetPriceAmc = async (req, res) => {
    try {
        await SetPriceAmc.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'AMC Price deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ==========================================
// Offers Logic
// ==========================================
export const createOffer = async (req, res) => {
    try {
        const newOffer = new Offer(req.body);
        const savedOffer = await newOffer.save();
        res.status(201).json(savedOffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getOffers = async (req, res) => {
    try {
        const { status, type } = req.query;
        const query = {};
        if (status) query.status = status;
        if (type) query.offerType = type;

        const offers = await Offer.find(query).sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateOffer = async (req, res) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedOffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteOffer = async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==========================================
// Solar Bundle Logic
// ==========================================
export const createBundle = async (req, res) => {
    try {
        const newBundle = new SolarPanelBundle(req.body);
        const savedBundle = await newBundle.save();
        res.status(201).json(savedBundle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBundles = async (req, res) => {
    try {
        // Logic for filtering by location if needed
        const bundles = await SolarPanelBundle.find().sort({ createdAt: -1 });
        res.status(200).json(bundles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateBundle = async (req, res) => {
    try {
        const updatedBundle = await SolarPanelBundle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedBundle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteBundle = async (req, res) => {
    try {
        await SolarPanelBundle.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Bundle deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ==========================================
// Dashboard Aggregations (IMPORTANT)
// ==========================================
export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Active Offers
        const activeOffersCount = await Offer.countDocuments({ status: 'Active' });

        // 2. Average Margin per Category in SetPrice
        // Simple average calculation
        const marginStats = await SetPrice.aggregate([
            {
                $group: {
                    _id: "$category",
                    avgMargin: { $avg: { $subtract: ["$marketPrice", "$benchmarkPrice"] } }
                }
            }
        ]);

        // 3. Bundle Plans Status
        const bundleStats = await SolarPanelBundle.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. AMC Price Revenue Potential (Mock calculation based on price)
        // Sum of all active AMC prices
        const totalAmcPotential = await SetPriceAmc.aggregate([
            { $match: { status: 'Active' } },
            { $group: { _id: null, total: { $sum: "$amcPrice" } } }
        ]);

        res.status(200).json({
            activeOffers: activeOffersCount,
            marginStats,
            bundleStats,
            amcRevenuePotential: totalAmcPotential[0]?.total || 0
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
