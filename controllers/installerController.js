import SolarInstaller from '../models/SolarInstaller.js';
import InstallerTool from '../models/InstallerTool.js';
import InstallationRate from '../models/InstallationRate.js';
import InstallerAgency from '../models/InstallerAgency.js';

// --- Solar Installer Controllers ---

export const getSolarInstallers = async (req, res) => {
    try {
        const { state, cluster, district } = req.query;
        let filter = {};
        if (state) filter.state = state;
        if (cluster) filter.cluster = cluster;
        if (district) filter.district = district;

        const installers = await SolarInstaller.find(filter)
            .populate('state', 'name')
            .populate('cluster', 'name')
            .populate('district', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(installers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSolarInstaller = async (req, res) => {
    try {
        const newInstaller = new SolarInstaller(req.body);
        await newInstaller.save();
        res.status(201).json(newInstaller);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSolarInstaller = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInstaller = await SolarInstaller.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInstaller) return res.status(404).json({ message: 'Installer not found' });
        res.status(200).json(updatedInstaller);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSolarInstaller = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInstaller = await SolarInstaller.findByIdAndDelete(id);
        if (!deletedInstaller) return res.status(404).json({ message: 'Installer not found' });
        res.status(200).json({ message: 'Installer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Installer Tool Controllers ---

export const getInstallerTools = async (req, res) => {
    try {
        const { state, cluster, district } = req.query;
        const query = {};
        if (state) query.state = state;
        if (cluster) query.cluster = cluster;
        if (district) query.district = district;

        const tools = await InstallerTool.find(query)
            .populate('state', 'name code')
            .populate('cluster', 'name')
            .populate('district', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(tools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createInstallerTool = async (req, res) => {
    try {
        const newTool = new InstallerTool(req.body);
        await newTool.save();
        res.status(201).json(newTool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateInstallerTool = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTool = await InstallerTool.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTool) return res.status(404).json({ message: 'Tool not found' });
        res.status(200).json(updatedTool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteInstallerTool = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTool = await InstallerTool.findByIdAndDelete(id);
        if (!deletedTool) return res.status(404).json({ message: 'Tool not found' });
        res.status(200).json({ message: 'Tool deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Installation Rate Controllers ---

export const getInstallationRates = async (req, res) => {
    try {
        const { state, cluster, district } = req.query;
        const query = {};
        if (state) query.state = state;
        if (cluster) query.cluster = cluster;
        if (district) query.district = district;

        const rates = await InstallationRate.find(query)
            .populate('state', 'name code')
            .populate('cluster', 'name')
            .populate('district', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(rates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createInstallationRate = async (req, res) => {
    try {
        const newRate = new InstallationRate(req.body);
        await newRate.save();
        res.status(201).json(newRate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateInstallationRate = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRate = await InstallationRate.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRate) return res.status(404).json({ message: 'Rate not found' });
        res.status(200).json(updatedRate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteInstallationRate = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRate = await InstallationRate.findByIdAndDelete(id);
        if (!deletedRate) return res.status(404).json({ message: 'Rate not found' });
        res.status(200).json({ message: 'Rate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Installer Agency Controllers ---

export const getInstallerAgencies = async (req, res) => {
    try {
        const { state, cluster, district } = req.query;
        const query = {};
        if (state) query.state = state;
        if (cluster) query.cluster = cluster;
        if (district) query.district = district;

        const agencies = await InstallerAgency.find(query)
            .populate('state', 'name code')
            .populate('cluster', 'name')
            .populate('district', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(agencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createInstallerAgency = async (req, res) => {
    try {
        const newAgency = new InstallerAgency(req.body);
        await newAgency.save();
        res.status(201).json(newAgency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateInstallerAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAgency = await InstallerAgency.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAgency) return res.status(404).json({ message: 'Agency not found' });
        res.status(200).json(updatedAgency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteInstallerAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAgency = await InstallerAgency.findByIdAndDelete(id);
        if (!deletedAgency) return res.status(404).json({ message: 'Agency not found' });
        res.status(200).json({ message: 'Agency deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
