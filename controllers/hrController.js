import Department from '../models/Department.js';
import Role from '../models/Role.js';
import Module from '../models/Module.js';
import TemporaryIncharge from '../models/TemporaryIncharge.js';
import User from '../models/User.js';

// --- Department Modules Logic ---

export const getAllModules = async (req, res, next) => {
    try {
        const modules = await Module.find({ isActive: true }).sort({ name: 1 });
        res.json({ success: true, count: modules.length, data: modules });
    } catch (err) {
        next(err);
    }
};

export const createModule = async (req, res, next) => {
    try {
        const { name, key, description, defaultLevel, status } = req.body;

        // Basic validation
        if (!name || !key) {
            return res.status(400).json({ success: false, message: 'Module Name and Key are required.' });
        }

        // Check for duplicates
        const existing = await Module.findOne({ $or: [{ name }, { key }] });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Module with this name or key already exists.' });
        }

        const newModule = await Module.create({
            name,
            key,
            description,
            defaultLevel,
            status,
            isActive: true
        });

        res.status(201).json({ success: true, message: 'Module created successfully', data: newModule });
    } catch (err) {
        next(err);
    }
};

export const updateModule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedModule = await Module.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedModule) {
            return res.status(404).json({ success: false, message: 'Module not found' });
        }

        res.json({ success: true, message: 'Module updated successfully', data: updatedModule });
    } catch (err) {
        next(err);
    }
};

export const deleteModule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedModule = await Module.findByIdAndDelete(id);

        if (!deletedModule) {
            return res.status(404).json({ success: false, message: 'Module not found' });
        }

        // Wait, deleting a module might orphan department module assignments. 
        // We will also remove this module from all departments.
        await Department.updateMany(
            {},
            { $pull: { assignedModules: { module: id } } }
        );

        res.json({ success: true, message: 'Module deleted successfully' });
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

export const getTemporaryInchargeDashboard = async (req, res, next) => {
    try {
        const today = new Date();

        // 1. Fetch upcoming or active temporary incharges
        // Omitting startDate <= today so that future assignments also appear in the table.
        const activeIncharges = await TemporaryIncharge.find({
            isActive: true,
            endDate: { $gte: today }
        })
            .sort({ startDate: 1 }) // Soonest first
            .populate('originalUser');

        const absentUserIds = activeIncharges.map(inc => inc.originalUser?._id?.toString()).filter(Boolean);

        // Calculate leave stats (State-wise and Cluster-wise)
        const stateStats = {};
        const clusterStats = {};
        let totalAbsent = 0;

        activeIncharges.forEach(inc => {
            const user = inc.originalUser;
            if (user) {
                totalAbsent++;
                // State stats
                if (user.state) {
                    stateStats[user.state] = (stateStats[user.state] || 0) + 1;
                }
                // Cluster stats
                if (user.cluster) {
                    clusterStats[user.cluster] = (clusterStats[user.cluster] || 0) + 1;
                }
            }
        });

        // 2. Fetch all employees to populate the list
        const users = await User.find({ role: { $in: ['admin', 'employee', 'dealerManager', 'franchiseeManager', 'delivery_manager', 'installer'] } })
            .populate('department', 'name')
            .populate('dynamicRole', 'name')
            .lean();

        const allStateStats = {};

        // 3. Map users to table format
        const employeeList = users.map((user, index) => {
            if (user.state) {
                allStateStats[user.state] = (allStateStats[user.state] || 0) + 1;
            }

            const activeInchargeRecord = activeIncharges.find(inc => inc.originalUser?._id?.toString() === user._id.toString());
            const isCurrentlyAbsent = activeInchargeRecord && new Date(activeInchargeRecord.startDate) <= new Date();

            // Mocking days absent, pending tasks, overdue tasks for UI replication
            const absentDays = isCurrentlyAbsent ? Math.floor(Math.random() * 5) + 1 : 0;
            const pendingTask = Math.floor(Math.random() * 20);
            const overdueTask = Math.floor(Math.random() * 10);

            return {
                _id: user._id,
                employeeId: `EMP` + String(index + 1).padStart(3, '0'),
                name: user.name,
                email: user.email,
                department: user.department?.name || '-',
                position: user.dynamicRole?.name || user.role, // role fallback
                state: user.state || null,
                status: isCurrentlyAbsent ? 'Absent' : 'Present',
                absentDays: `${absentDays} days`,
                pendingTask,
                overdueTask,
                tempInchargeId: activeInchargeRecord ? activeInchargeRecord.tempInchargeUser : null,
                action: activeInchargeRecord ? 'N/A' : 'Assign'
            };
        });

        // Populate temp incharge names
        const tempInchargeIds = employeeList.map(e => e.tempInchargeId).filter(Boolean);
        if (tempInchargeIds.length > 0) {
            const tempUsers = await User.find({ _id: { $in: tempInchargeIds } }).select('name').lean();
            const tempUserMap = tempUsers.reduce((acc, u) => { acc[u._id.toString()] = u.name; return acc; }, {});

            employeeList.forEach(e => {
                if (e.tempInchargeId && tempUserMap[e.tempInchargeId.toString()]) {
                    e.tempInchargeName = tempUserMap[e.tempInchargeId.toString()];
                } else {
                    e.tempInchargeName = '-';
                }
            });
        } else {
            employeeList.forEach(e => e.tempInchargeName = '-');
        }

        res.json({
            success: true,
            data: {
                totalAbsent,
                stateStats,
                clusterStats,
                allStateStats,
                employeeList
            }
        });
    } catch (err) {
        console.error("Dashboard error:", err);
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

// --- Employee Management Logic ---

export const getEmployees = async (req, res, next) => {
    try {
        const query = { role: { $in: ['admin', 'employee', 'dealerManager', 'franchiseeManager', 'delivery_manager', 'installer'] } };
        const employees = await User.find(query)
            .populate('department', 'name')
            .populate('dynamicRole', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

export const createEmployee = async (req, res, next) => {
    try {
        const { name, email, phone, password, role, department, state, status } = req.body;

        if (!name || !email || !phone || !password || !state) {
            return res.status(400).json({ success: false, message: 'Name, email, phone, password, and state are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        const newEmployee = await User.create({
            name,
            email,
            phone,
            password,
            role: role || 'employee',
            department: department || null,
            state,
            status: status || 'active',
            createdBy: req.user?._id
        });

        const populatedEmployee = await User.findById(newEmployee._id)
            .populate('department', 'name')
            .populate('dynamicRole', 'name');

        res.status(201).json({ success: true, message: 'Employee created successfully', data: populatedEmployee });
    } catch (err) {
        next(err);
    }
};

export const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent password update through this route for security, unless specifically handled
        if (updates.password) {
            delete updates.password;
        }

        const updatedEmployee = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        )
            .populate('department', 'name')
            .populate('dynamicRole', 'name');

        if (!updatedEmployee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({ success: true, message: 'Employee updated successfully', data: updatedEmployee });
    } catch (err) {
        next(err);
    }
};

export const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedEmployee = await User.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (err) {
        next(err);
    }
};
