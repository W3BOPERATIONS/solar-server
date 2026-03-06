import PartnerPlan from '../../models/partner/PartnerPlan.js';
import PartnerReward from '../../models/partner/PartnerReward.js';
import PartnerGoal from '../../models/partner/PartnerGoal.js';
import PartnerProfession from '../../models/partner/PartnerProfession.js';
import Partner from '../../models/partner/Partner.js';

// --- PARTNERS (Types) ---

export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({ isActive: true });
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPartner = async (req, res) => {
    try {
        const partner = new Partner(req.body);
        await partner.save();
        res.status(201).json(partner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await Partner.findByIdAndUpdate(id, req.body, { new: true });
        if (!partner) return res.status(404).json({ message: 'Partner not found' });
        res.status(200).json(partner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        await Partner.findByIdAndDelete(id);
        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- PLANS ---

export const getPlans = async (req, res) => {
    try {
        const { partnerType, stateId } = req.query;
        let query = { isActive: true };
        
        if (partnerType) query.partnerType = partnerType;
        if (stateId) query.state = stateId;

        let plans = await PartnerPlan.find(query).populate('state', 'name code');

        // We want to ensure that this partnerType/stateId combination 
        // has EVERY plan template that exists in the system.
        
        // Find all unique plan models in the database to act as templates
        const allSystemPlans = await PartnerPlan.find({ isActive: true });
        const distinctPlans = [];
        const uniqueNames = new Set();
        
        for (const p of allSystemPlans) {
            if (!uniqueNames.has(p.name)) {
                uniqueNames.add(p.name);
                distinctPlans.push(p);
            }
        }

        // Check for ALL plans (active or inactive) in the current context 
        // to prevent re-creating a plan that was explicitly deleted (soft-deleted).
        const allPlansInCurrentContext = await PartnerPlan.find({ partnerType, state: stateId });
        const currentPlanNames = allPlansInCurrentContext.map(p => p.name);
        
        const missingPlans = distinctPlans.filter(p => !currentPlanNames.includes(p.name));
        
        if (missingPlans.length > 0 && partnerType && stateId) {
            const newPlans = missingPlans.map(p => {
                const obj = p.toObject();
                // strip unique identifiers
                delete obj._id;
                delete obj.createdAt;
                delete obj.updatedAt;
                
                // reassign to current filter
                obj.state = stateId;
                obj.partnerType = partnerType;
                return obj;
            });
            await PartnerPlan.insertMany(newPlans);
            plans = await PartnerPlan.find(query).populate('state', 'name code');
        }
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPlan = async (req, res) => {
    try {
        const plan = new PartnerPlan(req.body);
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await PartnerPlan.findByIdAndUpdate(id, req.body, { new: true }).populate('state');
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await PartnerPlan.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- REWARDS & POINTS ---

export const getRewards = async (req, res) => {
    try {
        const { partnerType } = req.query;
        let query = { isActive: true };
        if (partnerType) query.partnerType = partnerType;

        const rewards = await PartnerReward.find(query);
        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createReward = async (req, res) => {
    try {
        const reward = new PartnerReward(req.body);
        await reward.save();
        res.status(201).json(reward);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteReward = async (req, res) => {
    try {
        const { id } = req.params;
        await PartnerReward.findByIdAndDelete(id);
        res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateReward = async (req, res) => {
    try {
        const { id } = req.params;
        const reward = await PartnerReward.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(reward);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- ONBOARDING GOALS ---

export const getGoals = async (req, res) => {
    try {
        const { partnerType, stateId } = req.query;
        let query = { isActive: true };
        if (partnerType) query.partnerType = partnerType;
        if (stateId) query.state = stateId;

        const goals = await PartnerGoal.find(query)
            .populate('state');
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGoal = async (req, res) => {
    try {
        const goal = new PartnerGoal(req.body);
        await goal.save();
        const populatedGoal = await PartnerGoal.findById(goal._id)
            .populate('state');
        res.status(201).json(populatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;
        await PartnerGoal.findByIdAndDelete(id);
        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- PROFESSION TYPES ---

export const getProfessions = async (req, res) => {
    try {
        const { partnerType, stateId } = req.query;
        let query = { isActive: true };
        if (partnerType) query.partnerType = partnerType;
        if (stateId) query.state = stateId;

        const professions = await PartnerProfession.find(query).populate('state');
        res.status(200).json(professions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProfession = async (req, res) => {
    try {
        const profession = new PartnerProfession(req.body);
        await profession.save();
        const populatedProfession = await PartnerProfession.findById(profession._id).populate('state');
        res.status(201).json(populatedProfession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProfession = async (req, res) => {
    try {
        const { id } = req.params;
        await PartnerProfession.findByIdAndDelete(id);
        res.status(200).json({ message: 'Profession deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
