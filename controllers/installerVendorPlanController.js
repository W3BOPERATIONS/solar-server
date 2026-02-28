import InstallerVendorPlan from '../models/InstallerVendorPlan.js';

// Get plans for a specific district
export const getInstallerVendorPlans = async (req, res, next) => {
    try {
        const { districtId } = req.query;
        if (!districtId) {
            return res.status(400).json({ success: false, message: 'District ID is required' });
        }

        const plans = await InstallerVendorPlan.find({ districtId }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, count: plans.length, data: plans });
    } catch (error) {
        next(error);
    }
};

// Create or Update a plan
export const saveInstallerVendorPlan = async (req, res, next) => {
    try {
        const { name, districtId } = req.body;

        // Try to find existing plan by name and district
        let plan = await InstallerVendorPlan.findOne({ name, districtId });

        if (plan) {
            // Update
            plan = await InstallerVendorPlan.findByIdAndUpdate(plan._id, req.body, { new: true, runValidators: true });
            res.status(200).json({ success: true, data: plan, message: 'Plan updated successfully' });
        } else {
            // Create
            plan = await InstallerVendorPlan.create(req.body);
            res.status(201).json({ success: true, data: plan, message: 'Plan created successfully' });
        }
    } catch (error) {
        next(error);
    }
};

// Delete a plan
export const deleteInstallerVendorPlan = async (req, res, next) => {
    try {
        const plan = await InstallerVendorPlan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        res.status(200).json({ success: true, message: 'Plan deleted successfully' });
    } catch (error) {
        next(error);
    }
};
