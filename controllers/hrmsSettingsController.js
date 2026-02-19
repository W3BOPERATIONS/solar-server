import HRMSSettings from '../models/HRMSSettings.js';
import CandidateTest from '../models/CandidateTest.js';
import CandidateTraining from '../models/CandidateTraining.js';

// --- HRMS Settings ---

export const getHRMSSettings = async (req, res, next) => {
    try {
        const { department, position } = req.query;
        const query = { isActive: true };

        if (department) query.department = department; // ID
        if (position) query.position = position;

        const settings = await HRMSSettings.find(query)
            .populate('department', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: settings.length, data: settings });
    } catch (err) {
        next(err);
    }
};

export const createOrUpdateHRMSSettings = async (req, res, next) => {
    try {
        const { department, position, payroll, recruitment, performance, vacancy } = req.body;

        // Upsert based on department and position
        const settings = await HRMSSettings.findOneAndUpdate(
            { department, position },
            {
                department,
                position,
                payroll,
                recruitment,
                performance,
                vacancy,
                updatedBy: req.user?._id
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        console.log("Data successfully stored in DB:", settings);
        res.json({ success: true, message: 'Settings saved successfully', data: settings });
    } catch (err) {
        next(err);
    }
};

// --- Candidate Tests ---

export const getCandidateTests = async (req, res, next) => {
    try {
        const { department, state } = req.query;
        const query = { isActive: true };

        if (department) query.department = department;
        if (state) query.state = state;

        const tests = await CandidateTest.find(query)
            .populate('department', 'name')
            .populate('state', 'name')
            .populate('cities', 'name')
            .populate('districts', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: tests.length, data: tests });
    } catch (err) {
        next(err);
    }
};

export const createCandidateTest = async (req, res, next) => {
    try {
        const test = await CandidateTest.create({
            ...req.body,
            createdBy: req.user?._id
        });
        res.status(201).json({ success: true, message: 'Test created successfully', data: test });
    } catch (err) {
        next(err);
    }
};

export const updateCandidateTest = async (req, res, next) => {
    try {
        const test = await CandidateTest.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user?._id },
            { new: true }
        );
        if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
        res.json({ success: true, message: 'Test updated successfully', data: test });
    } catch (err) {
        next(err);
    }
};

export const deleteCandidateTest = async (req, res, next) => {
    try {
        const test = await CandidateTest.findByIdAndUpdate(
            req.params.id,
            { isActive: false, updatedBy: req.user?._id },
            { new: true }
        ); // Soft delete
        if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
        res.json({ success: true, message: 'Test deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// --- Candidate Trainings ---

export const getCandidateTrainings = async (req, res, next) => {
    try {
        const { department, position } = req.query;
        const query = { isActive: true };

        if (department) query.department = department;
        if (position) query.position = position;

        const trainings = await CandidateTraining.find(query)
            .populate('department', 'name')
            .populate('state', 'name')
            .populate('cities', 'name')
            .populate('districts', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: trainings.length, data: trainings });
    } catch (err) {
        next(err);
    }
};

export const createCandidateTraining = async (req, res, next) => {
    try {
        const training = await CandidateTraining.create({
            ...req.body,
            createdBy: req.user?._id
        });
        res.status(201).json({ success: true, message: 'Training created successfully', data: training });
    } catch (err) {
        next(err);
    }
};

export const updateCandidateTraining = async (req, res, next) => {
    try {
        const training = await CandidateTraining.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user?._id },
            { new: true }
        );
        if (!training) return res.status(404).json({ success: false, message: 'Training not found' });
        res.json({ success: true, message: 'Training updated successfully', data: training });
    } catch (err) {
        next(err);
    }
};

export const deleteCandidateTraining = async (req, res, next) => {
    try {
        const training = await CandidateTraining.findByIdAndUpdate(
            req.params.id,
            { isActive: false, updatedBy: req.user?._id },
            { new: true }
        ); // Soft delete
        if (!training) return res.status(404).json({ success: false, message: 'Training not found' });
        res.json({ success: true, message: 'Training deleted successfully' });
    } catch (err) {
        next(err);
    }
};
