import BuyLeadSetting from '../models/BuyLeadSetting.js';

// Get all lead settings
export const getAllSettings = async (req, res) => {
    try {
        const settings = await BuyLeadSetting.find().sort({ createdAt: -1 });
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new lead setting
export const createSetting = async (req, res) => {
    try {
        const newSetting = new BuyLeadSetting(req.body);
        const savedSetting = await newSetting.save();
        res.status(201).json(savedSetting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a lead setting
export const updateSetting = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSetting = await BuyLeadSetting.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedSetting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        res.status(200).json(updatedSetting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a lead setting
export const deleteSetting = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSetting = await BuyLeadSetting.findByIdAndDelete(id);

        if (!deletedSetting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        res.status(200).json({ message: 'Setting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
