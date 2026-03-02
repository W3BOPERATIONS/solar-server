import InstallerVendorPlan from '../models/InstallerVendorPlan.js';

// Get plans based on location hierarchy
export const getInstallerVendorPlans = async (req, res, next) => {
    try {
        const { stateId, clusterId, districtId, fetchAllNames } = req.query;
        
        if (fetchAllNames === 'true') {
            const names = await InstallerVendorPlan.distinct('name');
            return res.status(200).json({ success: true, count: names.length, data: names });
        }

        let queries = [];
        
        // Always include completely global plans
        queries.push({ stateId: null, clusterId: null, districtId: null });

        if (stateId) queries.push({ stateId: stateId, clusterId: null, districtId: null });
        if (clusterId) queries.push({ clusterId: clusterId, districtId: null });
        if (districtId) queries.push({ districtId: districtId });

        const query = queries.length > 0 ? { $or: queries } : {};

        const plans = await InstallerVendorPlan.find(query)
            .populate('stateId', 'name')
            .populate('clusterId', 'name')
            .populate('districtId', 'name')
            .lean(); // Use lean for modifying

        // deduplicate by name, preferring more specific ones
        const planMap = new Map();
        for (const p of plans) {
            let score = 0;
            if (p.districtId) score = 3;
            else if (p.clusterId) score = 2;
            else if (p.stateId) score = 1;

            if (!planMap.has(p.name) || planMap.get(p.name).score < score) {
                p.score = score;
                planMap.set(p.name, p);
            }
        }
        
        const finalPlans = Array.from(planMap.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            
        res.status(200).json({ success: true, count: finalPlans.length, data: finalPlans });
    } catch (error) {
        next(error);
    }
};

// Create or Update a plan (supports bulk districts)
export const saveInstallerVendorPlan = async (req, res, next) => {
    try {
        const { name, stateId, clusterId, districtId } = req.body;

        // Ensure these are explicitly null if omitted or "all"
        const finalStateId = stateId || null;
        const finalClusterId = clusterId || null;
        const finalDistrictId = districtId || null;

        const payload = { ...req.body, stateId: finalStateId, clusterId: finalClusterId, districtId: finalDistrictId };

        // Unique identifier for a plan is its name + its exact location scope
        const filter = { name, stateId: finalStateId, clusterId: finalClusterId, districtId: finalDistrictId };

        const plan = await InstallerVendorPlan.findOneAndUpdate(
            filter,
            payload,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ 
            success: true, 
            data: plan, 
            message: 'Plan saved successfully' 
        });
    } catch (error) {
        next(error);
    }
};

// Delete a plan
export const deleteInstallerVendorPlan = async (req, res, next) => {
    try {
        if (req.params.id === 'by-name') {
            const { name } = req.query;
            if (!name) return res.status(400).json({ success: false, message: 'Plan name is required for global deletion' });
            
            await InstallerVendorPlan.deleteMany({ name });
            return res.status(200).json({ success: true, message: `All configurations for plan ${name} deleted successfully` });
        }

        const plan = await InstallerVendorPlan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        res.status(200).json({ success: true, message: 'Plan deleted successfully' });
    } catch (error) {
        next(error);
    }
};
