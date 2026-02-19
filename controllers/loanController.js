import LoanRule from '../models/LoanRule.js';
import ModuleCompletion from '../models/ModuleCompletion.js';

export const getLoanRules = async (req, res) => {
    try {
        const { clusterId } = req.query;
        if (!clusterId) {
            return res.status(400).json({ message: 'Cluster ID is required' });
        }
        const rules = await LoanRule.find({ clusterId });
        res.status(200).json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createLoanRule = async (req, res) => {
    try {
        const { clusterId, projectType, interestRate, tenureMonths, maxAmount, fields } = req.body;

        // Prevent duplicates for same project type in same cluster
        const existing = await LoanRule.findOne({ clusterId, projectType });
        if (existing) {
            return res.status(400).json({ message: `Loan rule for ${projectType} already exists in this cluster` });
        }

        const newRule = new LoanRule({
            clusterId,
            projectType,
            interestRate,
            tenureMonths,
            maxAmount,
            fields
        });

        await newRule.save();
        await updateLoanCompletion(clusterId);

        res.status(201).json(newRule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLoanRule = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRule = await LoanRule.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRule) {
            return res.status(404).json({ message: 'Loan rule not found' });
        }

        await updateLoanCompletion(updatedRule.clusterId);
        res.status(200).json(updatedRule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteLoanRule = async (req, res) => {
    try {
        const { id } = req.params;
        const rule = await LoanRule.findById(id);
        if (!rule) {
            return res.status(404).json({ message: 'Loan rule not found' });
        }

        const clusterId = rule.clusterId;
        await LoanRule.findByIdAndDelete(id);
        await updateLoanCompletion(clusterId);

        res.status(200).json({ message: 'Loan rule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLoanCompletion = async (clusterId) => {
    try {
        const rules = await LoanRule.find({ clusterId });
        const activeRules = rules.filter(r => r.status === 'active');

        // Logic: Complete if at least 1 active rule exists
        const isCompleted = activeRules.length > 0;
        const progressPercent = isCompleted ? 100 : 0;

        await ModuleCompletion.findOneAndUpdate(
            { clusterId, moduleName: 'Loan Setting' },
            {
                completed: isCompleted,
                progressPercent,
                category: 'Location Setting', // Based on ChecklistSetting.jsx categories
                iconName: 'DollarSign'
            },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('Error updating loan module completion:', error);
    }
};

export const updateModuleCompletion = async (req, res) => {
    try {
        const { clusterId } = req.body;
        await updateLoanCompletion(clusterId);
        res.status(200).json({ message: 'Module completion updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
