import Department from '../models/Department.js';
import Role from '../models/Role.js';
import Module from '../models/Module.js';
import TemporaryIncharge from '../models/TemporaryIncharge.js';
import User from '../models/User.js';

// --- Department Modules Logic ---

export const getAllModules = async (req, res, next) => {
    try {
        const modules = await Module.find({ isActive: true });
        res.json({ success: true, count: modules.length, data: modules });
    } catch (err) {
        next(err);
    }
};

export const assignModulesToDepartment = async (req, res, next) => {
    try {
        const { departmentId, modules } = req.body; // modules: [{ moduleId, level, status }]

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }

        // Validate modules exist
        // This accepts an array of full assignments to REPLACE or MERGE. 
        // For simplicity in this "dynamic" requirement, let's assume we replace the list or merge.
        // The prompt says "Dynamic", so we likely want to save exactly what's sent.

        department.assignedModules = modules.map(m => ({
            module: m.moduleId,
            level: m.level || 'country',
            status: m.status || 'active'
        }));

        await department.save();

        // Populate for response
        await department.populate('assignedModules.module');

        res.json({ success: true, message: 'Modules assigned successfully', data: department });
    } catch (err) {
        next(err);
    }
};

export const getDepartmentModules = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        const department = await Department.findById(departmentId).populate('assignedModules.module');

        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }

        res.json({ success: true, data: department.assignedModules });
    } catch (err) {
        next(err);
    }
};


// --- Temporary Incharge Logic ---

export const createTemporaryIncharge = async (req, res, next) => {
    try {
        const { originalUser, tempInchargeUser, department, startDate, endDate, reason } = req.body;

        // Basic validations
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ success: false, message: 'End date must be after start date' });
        }

        // Check for overlaps (optional but good)
        const overlap = await TemporaryIncharge.findOne({
            originalUser,
            isActive: true,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (overlap) {
            return res.status(409).json({ success: false, message: 'Temporary incharge overlap detected for this user.' });
        }

        const newIncharge = await TemporaryIncharge.create({
            originalUser,
            tempInchargeUser,
            department,
            startDate,
            endDate,
            reason,
            createdBy: req.user?._id
        });

        res.status(201).json({ success: true, message: 'Temporary Incharge assigned', data: newIncharge });
    } catch (err) {
        next(err);
    }
};

export const getTemporaryIncharges = async (req, res, next) => {
    try {
        // Can filter by department or user via query params
        const query = { isActive: true };
        if (req.query.department) query.department = req.query.department;

        const list = await TemporaryIncharge.find(query)
            .populate('originalUser', 'name email designation')
            .populate('tempInchargeUser', 'name email designation')
            .populate('department', 'name');

        res.json({ success: true, count: list.length, data: list });
    } catch (err) {
        next(err);
    }
};

// --- Seed Modules (Helper to ensure we have modules to work with as per "Dynamic" rule, we need data in DB) ---
// This might be called manually or via a special endpoint to init the system.
export const seedSystemModules = async (req, res, next) => {
    try {
        const predefinedModules = [
            { name: "Recruitment Management", key: "recruitment_management", defaultLevel: "country" },
            { name: "Employee Onboarding", key: "employee_onboarding", defaultLevel: "state" },
            { name: "Performance Reviews", key: "performance_reviews", defaultLevel: "cluster" },
            { name: "Payroll Processing", key: "payroll_processing", defaultLevel: "district" },
            { name: "Accounts Payable", key: "accounts_payable", defaultLevel: "country" },
            { name: "Accounts Receivable", key: "accounts_receivable", defaultLevel: "state" },
            { name: "Budget Management", key: "budget_management", defaultLevel: "cluster" },
            // Sidebar Modules
            { name: "HR Settings", key: "settings_hr", defaultLevel: "country" },
            { name: "Vendor Settings", key: "settings_vendor", defaultLevel: "country" },
            { name: "Sales Settings", key: "settings_sales", defaultLevel: "country" },
            { name: "Marketing Settings", key: "settings_marketing", defaultLevel: "country" },
            { name: "Delivery Settings", key: "settings_delivery", defaultLevel: "country" },
            { name: "Installer Settings", key: "settings_installer", defaultLevel: "country" },
            { name: "Inventory Settings", key: "settings_inventory", defaultLevel: "country" },
            { name: "Product Settings", key: "settings_product", defaultLevel: "country" },
            { name: "Brand Settings", key: "settings_brand", defaultLevel: "country" },
            { name: "Combokit Settings", key: "settings_combokit", defaultLevel: "country" },
            { name: "Order Procurement", key: "settings_order_procurement", defaultLevel: "country" },
            { name: "Franchisee Settings", key: "settings_franchisee", defaultLevel: "country" },
            { name: "Dealer Settings", key: "settings_dealer", defaultLevel: "country" },
            { name: "HRMS Settings", key: "settings_hrms", defaultLevel: "country" },
            { name: "Project Settings", key: "settings_project", defaultLevel: "country" },
            { name: "Quote Settings", key: "settings_quote", defaultLevel: "country" },
            { name: "Reports", key: "reports", defaultLevel: "country" }
        ];

        for (const mod of predefinedModules) {
            await Module.findOneAndUpdate(
                { key: mod.key },
                mod,
                { upsert: true, new: true }
            );
        }

        res.json({ success: true, message: 'System modules seeded' });
    } catch (err) {
        next(err);
    }
};
