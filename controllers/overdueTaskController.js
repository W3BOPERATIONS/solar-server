import OverdueTaskSetting from '../models/OverdueTaskSetting.js';

export const getOverdueTaskSettings = async (req, res) => {
    try {
        const settings = await OverdueTaskSetting.getSettings();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOverdueTaskSettings = async (req, res) => {
    try {
        const settings = await OverdueTaskSetting.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });
        res.status(200).json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
