import DeliveryType from '../models/DeliveryType.js';
import DeliveryBenchmarkPrice from '../models/DeliveryBenchmarkPrice.js';
import Vehicle from '../models/Vehicle.js';
import VendorDeliveryPlan from '../models/VendorDeliveryPlan.js';

// ==========================================
// Delivery Types
// ==========================================

export const getDeliveryTypes = async (req, res) => {
    try {
        const types = await DeliveryType.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: types.length, data: types });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createDeliveryType = async (req, res) => {
    try {
        const type = await DeliveryType.create(req.body);
        res.status(201).json({ success: true, data: type });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Delivery type already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateDeliveryType = async (req, res) => {
    try {
        const type = await DeliveryType.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!type) {
            return res.status(404).json({ success: false, message: 'Delivery type not found' });
        }
        res.status(200).json({ success: true, data: type });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDeliveryType = async (req, res) => {
    try {
        const type = await DeliveryType.findByIdAndDelete(req.params.id);
        if (!type) {
            return res.status(404).json({ success: false, message: 'Delivery type not found' });
        }
        res.status(200).json({ success: true, message: 'Delivery type deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// Delivery Benchmark Prices
// ==========================================

export const getBenchmarkPrices = async (req, res) => {
    try {
        const prices = await DeliveryBenchmarkPrice.find()
            .populate('deliveryType')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: prices.length, data: prices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBenchmarkPrice = async (req, res) => {
    try {
        const price = await DeliveryBenchmarkPrice.create(req.body);
        await price.populate('deliveryType');
        res.status(201).json({ success: true, data: price });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Benchmark price for this delivery type already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBenchmarkPrice = async (req, res) => {
    try {
        const price = await DeliveryBenchmarkPrice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('deliveryType');
        if (!price) {
            return res.status(404).json({ success: false, message: 'Benchmark price not found' });
        }
        res.status(200).json({ success: true, data: price });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBenchmarkPrice = async (req, res) => {
    try {
        const price = await DeliveryBenchmarkPrice.findByIdAndDelete(req.params.id);
        if (!price) {
            return res.status(404).json({ success: false, message: 'Benchmark price not found' });
        }
        res.status(200).json({ success: true, message: 'Benchmark price deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// Vehicles
// ==========================================

export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Vehicle name already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        res.status(200).json({ success: true, message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// Vendor Delivery Plans
// ==========================================

export const getVendorDeliveryPlans = async (req, res) => {
    try {
        const plans = await VendorDeliveryPlan.find()
            .populate('vendor', 'name email phone')
            .populate('deliveryType')
            .populate('vehicle')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: plans.length, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createVendorDeliveryPlan = async (req, res) => {
    try {
        const plan = await VendorDeliveryPlan.create(req.body);
        await plan.populate(['vendor', 'deliveryType', 'vehicle']);
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Plan for this vendor, delivery type, and vehicle already exists',
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateVendorDeliveryPlan = async (req, res) => {
    try {
        const plan = await VendorDeliveryPlan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate(['vendor', 'deliveryType', 'vehicle']);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Vendor delivery plan not found' });
        }
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteVendorDeliveryPlan = async (req, res) => {
    try {
        const plan = await VendorDeliveryPlan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Vendor delivery plan not found' });
        }
        res.status(200).json({ success: true, message: 'Vendor delivery plan deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
