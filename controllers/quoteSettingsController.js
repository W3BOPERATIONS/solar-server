import QuoteSettings from '../models/QuoteSettings.js';
import SurveyBOM from '../models/SurveyBOM.js';
import TerraceType from '../models/TerraceType.js';
import StructureType from '../models/StructureType.js';
import BuildingType from '../models/BuildingType.js';
import Discom from '../models/Discom.js';

// --- Quote Settings ---
export const createQuoteSetting = async (req, res) => {
    try {
        const newSetting = new QuoteSettings(req.body);
        const savedSetting = await newSetting.save();
        res.status(201).json(savedSetting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuoteSettings = async (req, res) => {
    try {
        const settings = await QuoteSettings.find();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateQuoteSetting = async (req, res) => {
    try {
        const updatedSetting = await QuoteSettings.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedSetting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteQuoteSetting = async (req, res) => {
    try {
        await QuoteSettings.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Quote Setting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Survey BOM ---
export const createSurveyBOM = async (req, res) => {
    try {
        const newBOM = new SurveyBOM(req.body);
        const savedBOM = await newBOM.save();
        res.status(201).json(savedBOM);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSurveyBOMs = async (req, res) => {
    try {
        const boms = await SurveyBOM.find();
        res.status(200).json(boms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSurveyBOM = async (req, res) => {
    try {
        const updatedBOM = await SurveyBOM.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedBOM);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSurveyBOM = async (req, res) => {
    try {
        await SurveyBOM.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Survey BOM deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Terrace Types ---
export const createTerraceType = async (req, res) => {
    try {
        const newType = new TerraceType(req.body);
        const savedType = await newType.save();
        res.status(201).json(savedType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTerraceTypes = async (req, res) => {
    try {
        const types = await TerraceType.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTerraceType = async (req, res) => {
    try {
        const updatedType = await TerraceType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTerraceType = async (req, res) => {
    try {
        await TerraceType.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Terrace Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Structure Types ---
export const createStructureType = async (req, res) => {
    try {
        const newType = new StructureType(req.body);
        const savedType = await newType.save();
        res.status(201).json(savedType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStructureTypes = async (req, res) => {
    try {
        const types = await StructureType.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStructureType = async (req, res) => {
    try {
        const updatedType = await StructureType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteStructureType = async (req, res) => {
    try {
        await StructureType.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Structure Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Building Types ---
export const createBuildingType = async (req, res) => {
    try {
        const newType = new BuildingType(req.body);
        const savedType = await newType.save();
        res.status(201).json(savedType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBuildingTypes = async (req, res) => {
    try {
        const types = await BuildingType.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBuildingType = async (req, res) => {
    try {
        const updatedType = await BuildingType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBuildingType = async (req, res) => {
    try {
        await BuildingType.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Building Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Discoms ---
export const createDiscom = async (req, res) => {
    try {
        const newDiscom = new Discom(req.body);
        const savedDiscom = await newDiscom.save();
        res.status(201).json(savedDiscom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDiscomsByState = async (req, res) => {
    try {
        const { stateId } = req.params;
        const discoms = await Discom.find({ state: stateId });
        res.status(200).json(discoms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDiscom = async (req, res) => {
    try {
        const updatedDiscom = await Discom.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedDiscom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDiscom = async (req, res) => {
    try {
        await Discom.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Discom deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
