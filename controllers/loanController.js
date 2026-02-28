import LoanRule from '../models/LoanRule.js';
import ModuleCompletion from '../models/ModuleCompletion.js';

export const getLoanRules = async (req, res) => {
    try {
        const { clusterId } = req.query;
        console.log('GET /api/loan - clusterId:', clusterId);
        let query = {};
        if (clusterId && clusterId !== 'undefined') {
            query.clusterId = clusterId;
        }
        const rules = await LoanRule.find(query);
        console.log(`GET /api/loan - Found ${rules.length} rules`);
        res.status(200).json(rules);
    } catch (error) {
        console.error('GET /api/loan Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const createLoanRule = async (req, res) => {
    try {
        const { clusterId, projectType, interestRate, tenureMonths, maxAmount, fields } = req.body;
        console.log('POST /api/loan - Body:', { projectType, clusterId });

        // Normalize projectType for consistent checking
        const normalizedPT = projectType.charAt(0).toUpperCase() + projectType.slice(1).toLowerCase();

        // Prevent duplicates for same project type in same cluster (or global)
        const query = {
            projectType: normalizedPT
        };

        if (clusterId && clusterId !== 'undefined') {
            query.clusterId = clusterId;
        } else {
            // Check for both null and missing clusterId to be safe
            query.$or = [
                { clusterId: null },
                { clusterId: { $exists: false } }
            ];
        }

        const existing = await LoanRule.findOne(query);
        if (existing) {
            console.log('POST /api/loan - Duplicate found:', existing._id);
            return res.status(400).json({ message: `Loan rule for ${normalizedPT} already exists` });
        }

        const newRule = new LoanRule({
            clusterId: clusterId && clusterId !== 'undefined' ? clusterId : null,
            projectType: normalizedPT,
            interestRate: interestRate || 0,
            tenureMonths: tenureMonths || 0,
            maxAmount: maxAmount || 0,
            fields: fields || [],
            status: 'active'
        });

        await newRule.save();
        console.log('POST /api/loan - Saved new rule:', newRule._id);
        if (newRule.clusterId) {
            await updateLoanCompletion(newRule.clusterId);
        }

        res.status(201).json(newRule);
    } catch (error) {
        console.error('POST /api/loan Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateLoanRule = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        console.log(`PUT /api/loan/${id} - Body:`, { projectType: data.projectType });

        if (data.projectType) {
            data.projectType = data.projectType.charAt(0).toUpperCase() + data.projectType.slice(1).toLowerCase();
        }

        const updatedRule = await LoanRule.findByIdAndUpdate(id, data, { new: true });

        if (!updatedRule) {
            console.log(`PUT /api/loan/${id} - Not found`);
            return res.status(404).json({ message: 'Loan rule not found' });
        }

        console.log(`PUT /api/loan/${id} - Updated:`, updatedRule._id);
        if (updatedRule.clusterId) {
            await updateLoanCompletion(updatedRule.clusterId);
        }
        res.status(200).json(updatedRule);
    } catch (error) {
        console.error(`PUT /api/loan/${id} Error:`, error);
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
