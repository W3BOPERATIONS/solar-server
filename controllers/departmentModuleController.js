import Department from '../models/Department.js';
import Module from '../models/Module.js';
import DepartmentModuleAccess from '../models/DepartmentModuleAccess.js';

// Get all departments
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({ isActive: true }).select('name _id').sort({ name: 1 });
        res.status(200).json({ success: true, departments });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all modules
export const getModules = async (req, res) => {
    try {
        const modules = await Module.find({ isActive: true }).select('name key defaultLevel _id').sort({ name: 1 });
        res.status(200).json({ success: true, modules });
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get module access for a department
export const getDepartmentModules = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const accessList = await DepartmentModuleAccess.find({ departmentId }).populate('moduleId', 'name key defaultLevel');
        res.status(200).json({ success: true, accessList });
    } catch (error) {
        console.error('Error fetching department modules:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Save or Update module access
export const saveDepartmentModules = async (req, res) => {
    try {
        const { departmentId, mappings } = req.body; // mappings = [{ moduleId, accessLevel, enabled }]

        if (!departmentId || !Array.isArray(mappings)) {
            return res.status(400).json({ success: false, message: 'Invalid data' });
        }

        const operations = mappings.map(mapping => ({
            updateOne: {
                filter: { departmentId, moduleId: mapping.moduleId },
                update: {
                    $set: {
                        accessLevel: mapping.accessLevel,
                        enabled: mapping.enabled,
                        updatedBy: req.user?._id // Assuming auth middleware adds user
                    },
                    $setOnInsert: {
                        departmentId,
                        moduleId: mapping.moduleId,
                        createdBy: req.user?._id
                    }
                },
                upsert: true
            }
        }));

        await DepartmentModuleAccess.bulkWrite(operations);

        res.status(200).json({ success: true, message: 'Department modules updated successfully' });
    } catch (error) {
        console.error('Error saving department modules:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get stats for a department
export const getDepartmentStats = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const totalEnabled = await DepartmentModuleAccess.countDocuments({ departmentId, enabled: true });
        res.status(200).json({ success: true, stats: { totalEnabled } });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
