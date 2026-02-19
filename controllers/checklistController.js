import ChecklistTemplate from '../models/ChecklistTemplate.js';
import ModuleCompletion from '../models/ModuleCompletion.js';
import ChecklistCategory from '../models/ChecklistCategory.js';

export const getAllChecklists = async (req, res) => {
    try {
        const checklists = await ChecklistTemplate.find().sort({ createdAt: -1 });
        res.status(200).json(checklists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createChecklist = async (req, res) => {
    try {
        const { name } = req.body;
        const exists = await ChecklistTemplate.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: "Checklist with this name already exists" });
        }
        const checklist = new ChecklistTemplate(req.body);
        await checklist.save();
        res.status(201).json(checklist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateChecklist = async (req, res) => {
    try {
        const { id } = req.params;
        const checklist = await ChecklistTemplate.findByIdAndUpdate(id, req.body, { new: true });
        if (!checklist) {
            return res.status(404).json({ message: "Checklist not found" });
        }
        res.status(200).json(checklist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteChecklist = async (req, res) => {
    try {
        const { id } = req.params;
        const checklist = await ChecklistTemplate.findByIdAndDelete(id);
        if (!checklist) {
            return res.status(404).json({ message: "Checklist not found" });
        }
        res.status(200).json({ message: "Checklist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getModuleCompletions = async (req, res) => {
    try {
        const { clusterId } = req.query;
        const filter = clusterId ? { clusterId } : {};
        const completions = await ModuleCompletion.find(filter);
        res.status(200).json(completions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateModuleCompletion = async (req, res) => {
    try {
        const { moduleName, completed, progressPercent, category, iconName, clusterId } = req.body;
        if (!clusterId) {
            return res.status(400).json({ message: "clusterId is required for regional tracking" });
        }
        const completion = await ModuleCompletion.findOneAndUpdate(
            { moduleName, clusterId },
            { completed, progressPercent, category, iconName },
            { new: true, upsert: true }
        );
        res.status(200).json(completion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await ChecklistCategory.find({ isActive: true }).sort({ title: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const category = new ChecklistCategory(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const seedChecklists = async (req, res) => {
    try {
        // 1. Initial Categories
        const baseCategories = [
            { title: "Location Setting", iconName: 'MapPin', iconBg: "bg-blue-100 text-blue-600" },
            { title: "HR Setting", iconName: 'Users', iconBg: "bg-sky-100 text-sky-600" },
            { title: "Vendor Setting", iconName: 'Truck', iconBg: "bg-emerald-100 text-emerald-600" },
            { title: "Delivery Setting", iconName: 'Package', iconBg: "bg-teal-100 text-teal-600" },
            { title: "Sales Setting", iconName: 'DollarSign', iconBg: "bg-violet-100 text-violet-600" },
            { title: "Installer Setting", iconName: 'Wrench', iconBg: "bg-amber-100 text-amber-600" },
            { title: "Franchisee Setting", iconName: 'ShoppingBag', iconBg: "bg-orange-100 text-orange-600" },
            { title: "Dealer Setting", iconName: 'Briefcase', iconBg: "bg-pink-100 text-pink-600" },
            { title: "Marketing Setting", iconName: 'Megaphone', iconBg: "bg-red-100 text-red-600" },
            { title: "Product Configuration", iconName: 'Box', iconBg: "bg-emerald-100 text-emerald-600" },
            { title: "Inventory Management", iconName: 'PackageOpen', iconBg: "bg-cyan-100 text-cyan-600" },
            { title: "Project Management", iconName: 'ClipboardList', iconBg: "bg-emerald-100 text-emerald-600" },
            { title: "Quote Setting", iconName: 'FileText', iconBg: "bg-green-100 text-green-600" },
            { title: "Combokit Setting", iconName: 'Layers', iconBg: "bg-pink-100 text-pink-600" },
            { title: "Other Setting", iconName: 'Settings', iconBg: "bg-yellow-100 text-yellow-600" },
            { title: "HRMS Setting", iconName: 'Users', iconBg: "bg-indigo-100 text-indigo-600" }
        ];

        for (const cat of baseCategories) {
            await ChecklistCategory.findOneAndUpdate(
                { title: cat.title },
                cat,
                { upsert: true }
            );
        }

        // 2. Initial Sample Templates if none exist
        const count = await ChecklistTemplate.countDocuments();
        if (count === 0) {
            const sampleTemplates = [
                {
                    name: "Primary Location Check",
                    category: "Location Setting",
                    status: "active",
                    completionStatus: "completed",
                    items: [
                        { itemName: "Verify State Presence", required: true, order: 1 },
                        { itemName: "Check Cluster Map", required: true, order: 2 }
                    ]
                },
                {
                    name: "Department Heads",
                    category: "HR Setting",
                    status: "active",
                    completionStatus: "pending",
                    items: [
                        { itemName: "List all departments", required: true, order: 1 }
                    ]
                }
            ];
            await ChecklistTemplate.insertMany(sampleTemplates);
        }

        res.status(200).json({ message: "Database seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
