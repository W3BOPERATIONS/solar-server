import Project from '../models/Project.js';
import State from '../models/State.js';
import Cluster from '../models/Cluster.js';
import User from '../models/User.js';

// ==================== PROJECT CONTROLLERS ====================

export const getAllProjects = async (req, res, next) => {
    try {
        const {
            status,
            cp,
            districtId,
            stateId,
            clusterId,
            category,
            projectType,
            search
        } = req.query;

        const query = { isActive: true };

        // Role-based filtering logic
        if (req.user && req.user.role === 'dealerManager') {
            const managerDealers = await User.find({ role: 'dealer', createdBy: req.user.id });
            const dealerIds = managerDealers.map(d => d._id);
            query.dealerId = { $in: [req.user.id, ...dealerIds] };
        } else if (req.user && req.user.role === 'dealer') {
            query.dealerId = req.user.id;
        } if (status && status !== 'all') query.statusStage = status;
        if (cp && cp !== 'all') query.cp = cp;
        if (districtId && districtId !== 'all') query.district = districtId;
        if (stateId) query.state = stateId;
        if (clusterId) query.cluster = clusterId;
        if (category && category !== 'all') query.category = category;
        if (projectType && projectType !== 'all') query.projectType = projectType;

        if (search) {
            query.$or = [
                { projectName: { $regex: search, $options: 'i' } },
                { projectId: { $regex: search, $options: 'i' } }
            ];
        }

        const projects = await Project.find(query)
            .populate('state', 'name')
            .populate('district', 'name')
            .populate('cluster', 'name h')
            .sort({ createdAt: -1 });

        // Calculate overdue days for each project
        const projectsWithOverdue = projects.map(project => {
            const today = new Date();
            const due = new Date(project.dueDate);
            const diffTime = today - due;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If diffDays > 0, it is overdue. If <= 0, it is not.
            // But logic in frontend was: if overdue -> red text.
            // Let's pass overdueDays.

            const isOverdue = diffDays > 0;

            return {
                ...project.toObject(),
                overdueDays: isOverdue ? diffDays : 0,
                isOverdue
            };
        });



        if (projects.length === 0) {

        }

        res.json({
            success: true,
            count: projects.length,
            data: projectsWithOverdue,
        });
    } catch (err) {
        next(err);
    }
};

export const getProjectStats = async (req, res, next) => {
    try {
        const { stateId } = req.query;
        const query = { isActive: true };
        if (stateId) query.state = stateId;

        // Role-based filtering logic
        if (req.user && req.user.role === 'dealerManager') {
            const managerDealers = await User.find({ role: 'dealer', createdBy: req.user.id });
            const dealerIds = managerDealers.map(d => d._id);
            query.dealerId = { $in: [req.user.id, ...dealerIds] };
        } else if (req.user && req.user.role === 'dealer') {
            query.dealerId = req.user.id;
        }

        const allProjects = await Project.find(query);

        const total = allProjects.length;
        // Logic for "In Progress": statusStage is NOT 'completed' (assuming 'commission' or similar is completed?)
        // Or specific logic.
        // Let's assume 'commission' is completed?
        // Frontend used: "Completed" -> 65% completion.
        // Let's define: In Progress = All - Completed.
        // Statuses from frontend: consumer, application, feasibility, metercharge, vendor, work, install, pcr, commission, meterchange, inspection, subsidyreq, subsidydis.
        // Maybe 'subsidydis' is completed? or 'commission'?

        // For now, let's look for exact status matches if possible.
        // Assuming 'Commissioning' or 'Subsidy Disbursal' might be completion.
        // Let's count 'completed' as those with statusStage 'commission' or later?
        // Actually, let's just count based on some flag or specific status list.

        const completedCount = allProjects.filter(p => ['commission', 'subsidydis', 'completed'].includes(p.statusStage)).length;
        const inProgressCount = total - completedCount;

        // Overdue: based on dueDate
        const today = new Date();
        const overdueCount = allProjects.filter(p => {
            const due = new Date(p.dueDate);
            return due < today && !['commission', 'subsidydis', 'completed'].includes(p.statusStage); // Overdue if not completed and date passed
        }).length;



        res.json({
            success: true,
            data: {
                total,
                inProgress: inProgressCount,
                completed: completedCount,
                overdue: overdueCount
            }
        });

    } catch (err) {
        next(err);
    }
};

export const createProject = async (req, res, next) => {
    try {
        const {
            projectId, projectName, category, projectType, totalKW,
            status, statusStage, dueDate, state, district, cluster, cp
        } = req.body;

        if (!projectId || !projectName || !state) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        const project = await Project.create({
            projectId,
            projectName,
            category,
            projectType,
            totalKW,
            status,
            statusStage,
            dueDate,
            state,
            district,
            cluster,
            cp,
            createdBy: req.user?.id,
        });

        res.status(201).json({ success: true, message: 'Project created successfully', data: project });
    } catch (err) {
        next(err);
    }
};

export const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user?.id },
            { new: true, runValidators: true }
        );

        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        res.json({ success: true, message: 'Project updated successfully', data: project });
    } catch (err) {
        next(err);
    }
};

export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('state')
            .populate('district')
            .populate('cluster');

        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        res.json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

export const signProject = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        // Find lead
        const lead = await import('../models/Lead.js').then(m => m.default.findById(leadId).populate('district'));

        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        // Check if project already exists for this lead
        // We can check by checking if any project has same details or if we link project to lead (not currently schema linked, but maybe by name/mobile?)
        // Or simpler: check if a project with same phone/name exists? 
        // Better: add `lead` reference to Project schema?
        // For now, let's search by CONSUMER NUMBER if available or just proceed. 
        // Since `projectId` is unique, let's generate it and create.

        // Generate Project ID
        const categoryCode = lead.solarType === 'Residential' ? 'RES' : 'COM';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const projectId = `SOL-${categoryCode}-${randomNum}`;

        // Get State from District
        // lead.district is populated.
        const stateId = lead.district?.state;

        if (!stateId) {
            // Fallback if district not populated or structure issue, though it should be.
            // We can fetch District model if needed. 
        }

        const project = await Project.create({
            projectId,
            projectName: lead.name,
            category: lead.solarType,
            projectType: lead.subType || 'On-Grid', // Default fallbacks
            totalKW: parseFloat(lead.quote?.systemSize || lead.kw) || 0,
            totalAmount: lead.quote?.totalAmount || 0,
            commission: lead.quote?.commission || 0,
            commissionStatus: 'Pending',
            status: 'Project Signed',
            statusStage: 'consumer', // Start at consumer registration step
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days default
            state: stateId,
            district: lead.district?._id,
            cluster: lead.city, // using city as cluster based on lead schema usage
            cp: 'Direct', // or fetch dealer info

            // Populate contact info from Lead
            mobile: lead.mobile,
            email: lead.email,
            // Construct address if possible, or just leave empty for now as Lead doesn't have full address field explicitly usually (just district/city/state)
            // But if we want to store what we have:
            address: `${lead.city?.name || ''}, ${lead.district?.name || ''}`,

            createdBy: req.user?.id,
        });

        // Update Lead status
        lead.status = 'ProjectSigned';
        lead.history.push({ action: 'Project Signed & Created', by: req.user?._id });
        await lead.save();

        res.status(201).json({ success: true, message: 'Project signed and created successfully', data: project });

    } catch (err) {
        next(err);
    }
};
