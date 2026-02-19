import SolarKit from '../models/SolarKit.js';
import AMCPlan from '../models/AMCPlan.js';
import AMCService from '../models/AMCService.js';
import BundlePlan from '../models/BundlePlan.js';
import ComboKitAssignment from '../models/ComboKitAssignment.js';
import CustomizedComboKit from '../models/CustomizedComboKit.js';

// --- SolarKit Controllers ---

export const createSolarKit = async (req, res) => {
    try {
        const newSolarKit = new SolarKit(req.body);
        const savedSolarKit = await newSolarKit.save();
        res.status(201).json(savedSolarKit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSolarKits = async (req, res) => {
    try {
        const { country } = req.query;
        const filter = country ? { country } : {};
        const solarKits = await SolarKit.find(filter).populate('country', 'name');
        res.status(200).json(solarKits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSolarKit = async (req, res) => {
    try {
        const updatedSolarKit = await SolarKit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedSolarKit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSolarKit = async (req, res) => {
    try {
        await SolarKit.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'SolarKit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSolarKitStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedSolarKit = await SolarKit.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json(updatedSolarKit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSolarKitBOM = async (req, res) => {
    try {
        const solarKit = await SolarKit.findById(req.params.id);
        if (!solarKit) return res.status(404).json({ message: 'SolarKit not found' });
        res.status(200).json({ bom: solarKit.bom || [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveSolarKitBOM = async (req, res) => {
    try {
        const { bom } = req.body;
        const updatedSolarKit = await SolarKit.findByIdAndUpdate(
            req.params.id,
            { bom },
            { new: true }
        );
        res.status(200).json(updatedSolarKit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- AMC Plan Controllers ---

export const createAMCPlan = async (req, res) => {
    try {
        const { stateId, serviceIds } = req.body;
        const newPlan = new AMCPlan({
            state: stateId,
            services: serviceIds,
            ...req.body // Spread other fields if any, though explicit mapping is safer
        });
        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAMCPlans = async (req, res) => {
    try {
        const plans = await AMCPlan.find()
            .populate('state', 'name')
            .populate('services');
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAMCPlan = async (req, res) => {
    try {
        const { stateId, serviceIds } = req.body;
        const updateData = {
            ...req.body,
            state: stateId, // Map if present
            services: serviceIds // Map if present
        };
        // Remove the old keys if desired, but Mongoose ignores undefined fields in schema usually.
        // However, if we want to be clean:
        if (stateId) delete updateData.stateId;
        if (serviceIds) delete updateData.serviceIds;

        const updatedPlan = await AMCPlan.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('state', 'name')
            .populate('services');
        res.status(200).json(updatedPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAMCPlan = async (req, res) => {
    try {
        await AMCPlan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'AMC Plan deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- AMC Services Controllers ---

export const createAMCService = async (req, res) => {
    try {
        const newService = new AMCService(req.body);
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAMCServices = async (req, res) => {
    try {
        const { amcPlanId } = req.query;
        const filter = amcPlanId ? { amcPlanId } : {};
        const services = await AMCService.find(filter).populate('amcPlanId', 'name');
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAMCService = async (req, res) => {
    try {
        const updatedService = await AMCService.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAMCService = async (req, res) => {
    try {
        await AMCService.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'AMC Service deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Bundle Plans Controllers ---

export const createBundlePlan = async (req, res) => {
    try {
        const { Country } = req.body;
        const newBundle = new BundlePlan({
            ...req.body,
            country: Country // Map Country (frontend) to country (schema)
        });
        const savedBundle = await newBundle.save();
        res.status(201).json(savedBundle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBundlePlans = async (req, res) => {
    try {
        const bundles = await BundlePlan.find()
            .populate('state', 'name');
        res.status(200).json(bundles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBundlePlan = async (req, res) => {
    try {
        const { Country } = req.body;
        const updateData = {
            ...req.body,
            country: Country // Map Country if present
        };
        const updatedBundle = await BundlePlan.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('state', 'name');
        res.status(200).json(updatedBundle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBundlePlan = async (req, res) => {
    try {
        await BundlePlan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Bundle Plan deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- ComboKit Assignments Controllers ---

export const createAssignment = async (req, res) => {
    try {
        // Validate uniqueness if needed (e.g. one active assignment per location per type)
        const newAssignment = new ComboKitAssignment(req.body);
        const savedAssignment = await newAssignment.save();
        res.status(201).json(savedAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAssignments = async (req, res) => {
    try {
        const { userType, state, city, district } = req.query;
        const filter = {};
        if (userType) filter.userType = userType;
        if (state) filter.state = state;
        if (city) filter.city = city;
        if (district) filter.district = district;

        const assignments = await ComboKitAssignment.find(filter)
            .populate('comboKitId', 'name')
            .populate('state', 'name')
            .populate('city', 'name')
            .populate('district', 'name');
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAssignment = async (req, res) => {
    try {
        const updatedAssignment = await ComboKitAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        await ComboKitAssignment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Assignment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
