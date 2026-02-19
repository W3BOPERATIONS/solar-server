import InventoryItem from '../models/InventoryItem.js';
import RestockLimit from '../models/RestockLimit.js';
import Brand from '../models/Brand.js';
import Warehouse from '../models/Warehouse.js';
import mongoose from 'mongoose';

// Create Inventory Item
export const createInventoryItem = async (req, res) => {
    try {
        console.log('Creating Inventory Item:', req.body);
        console.log('User:', req.user);
        const { itemName, brand, category, subCategory, projectType, subProjectType, kitType, sku, quantity, price, minLevel, maxLevel, state, cluster, city, district, status, productType, technology, wattage } = req.body;

        // Check if item exists at this location (State + Cluster + District + SKU)
        const existingItem = await InventoryItem.findOne({
            sku,
            state,
            cluster,
            district
        });

        if (existingItem) {
            console.log(`Item exists at this location. Updating quantity from ${existingItem.quantity} to ${existingItem.quantity + Number(quantity)}`);
            existingItem.quantity += Number(quantity);
            // Optionally update other fields if provided?
            // prioritizing keeping original meta-data but updating stock.
            // But if price changes? Let's just update quantity for 'Add Inventory' flow.

            // If itemName or descriptions are updated in form, maybe we should update them too?
            // For now, simple stock increment.
            existingItem.updatedBy = req.user ? req.user.id : null;
            await existingItem.save();
            return res.status(200).json(existingItem);
        }

        // Create new item
        const newItem = new InventoryItem({
            itemName,
            brand,
            category,
            subCategory,
            projectType,
            subProjectType,
            kitType,
            productType,
            technology,
            wattage,
            sku,
            quantity,
            price,
            minLevel,
            maxLevel,
            state,
            cluster,
            city,
            district,
            status,
            createdBy: req.user ? req.user.id : null // Handle potential missing user
        });

        if (!req.user) {
            console.warn('Warning: No user found in request, createdBy set to null');
        }

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Create Inventory Error:", error);
        // Handle Mongoose Unique Constraint Error gracefully
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Inventory item already exists at this location.', error: error.message });
        }
        res.status(500).json({ message: 'Error creating inventory item', error: error.message });
    }
};

// Get All Inventory Items with Filters
export const getInventoryItems = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            state,
            cluster,
            city,
            district,
            category,
            brand,
            lowStock
        } = req.query;

        const query = {};

        if (search) {
            query.$text = { $search: search };
        }
        if (state) query.state = state;
        if (cluster) query.cluster = cluster;
        if (city) query.city = city;
        if (district) query.district = district;
        if (category) query.category = category;
        if (brand) {
            // Check if brand is ObjectId or Name
            if (mongoose.Types.ObjectId.isValid(brand)) {
                query.brand = brand;
            } else {
                // If passing name, we might need to lookup first or handle on frontend to pass ID. 
                // Ideally frontend passes ID. If we must support name search, we need a lookup.
                // For now assuming ID.
            }
        }
        if (req.query.status) query.status = req.query.status;

        // Low stock filter logic is complex because threshold can be dynamic per item or global.
        // However, the prompt implies `minLevel` on the item is the threshold.
        if (lowStock === 'true') {
            query.$expr = { $lte: ["$quantity", "$minLevel"] };
        }

        const items = await InventoryItem.find(query)
            .populate('brand', 'brandName')
            .populate('state', 'name code')
            .populate('city', 'name')
            .populate('district', 'name')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await InventoryItem.countDocuments(query);

        res.json({
            items,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalItems: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory items', error: error.message });
    }
};

// Update Inventory Item
export const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        updateData.updatedBy = req.user.id;

        const updatedItem = await InventoryItem.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating inventory item', error: error.message });
    }
};

// Delete Inventory Item
export const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await InventoryItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Also delete associated restock limits
        await RestockLimit.deleteMany({ itemId: id });

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting inventory item', error: error.message });
    }
};

// Brands CRUD
export const createBrand = async (req, res) => {
    try {
        const { brandName, description, logo, status } = req.body;
        const brand = new Brand({ brandName, description, logo, status, createdBy: req.user.id });
        await brand.save();
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({ status: 'Active' }); // Or filter by query
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Restock Limits
export const getRestockLimits = async (req, res) => {
    try {
        const { state, city, district } = req.query;
        // Logic to get items and their limits.
        // The UI lists inventory items and allows setting a limit.
        // We can fetch items and populate their limit? Or fetch Limits and populate items?
        // UI is "Inventory Restock Limit Setting", likely list by location.

        const query = {};
        if (state) query.state = state;
        if (city) query.city = city;
        if (district) query.district = district;

        const items = await InventoryItem.find(query)
            .populate('brand', 'brandName');

        // Fetch limits for these items
        const itemIds = items.map(i => i._id);
        const limits = await RestockLimit.find({ itemId: { $in: itemIds } });

        // Map limits to items
        const result = items.map(item => {
            const limit = limits.find(l => l.itemId.toString() === item._id.toString());
            return {
                ...item.toObject(),
                currentRestockLimit: limit ? limit.restockThreshold : 0,
                restockLimitId: limit ? limit._id : null
            };
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const setRestockLimit = async (req, res) => {
    try {
        const { itemId, threshold } = req.body;

        let limit = await RestockLimit.findOne({ itemId });
        if (limit) {
            limit.restockThreshold = threshold;
            limit.updatedBy = req.user.id;
            await limit.save();
        } else {
            limit = new RestockLimit({
                itemId,
                restockThreshold: threshold,
                createdBy: req.user.id
            });
            await limit.save();
        }
        res.json(limit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aggregations for Dashboard/Overview
export const getInventorySummary = async (req, res) => {
    try {
        const { state, city, district } = req.query;
        const match = {};
        if (state) match.state = new mongoose.Types.ObjectId(state);
        if (city) match.city = new mongoose.Types.ObjectId(city);
        if (district) match.district = new mongoose.Types.ObjectId(district);

        const summary = await InventoryItem.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    totalQuantity: { $sum: "$quantity" },
                    totalValue: { $sum: { $multiply: ["$quantity", "$price"] } }
                }
            }
        ]);

        const lowStockCount = await InventoryItem.countDocuments({
            ...match,
            $expr: { $lte: ["$quantity", "$minLevel"] }
        });

        res.json({
            ...summary[0] || { totalProducts: 0, totalQuantity: 0, totalValue: 0 },
            lowStockCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Combokit/Brand Overview
export const getBrandOverview = async (req, res) => {
    try {
        const { state, city, district } = req.query;
        const match = {};
        if (state) match.state = new mongoose.Types.ObjectId(state);
        if (city) match.city = new mongoose.Types.ObjectId(city);
        if (district) match.district = new mongoose.Types.ObjectId(district);

        // Group by Item Name -> Brands available
        // Return structured data for "Combokit Brand SKU Overview"
        // UI wants: Product Name -> List of Brands -> SKU count per brand

        const overview = await InventoryItem.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { productName: "$itemName", brand: "$brand" },
                    skuCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "brands",
                    localField: "_id.brand",
                    foreignField: "_id",
                    as: "brandInfo"
                }
            },
            {
                $unwind: "$brandInfo"
            },
            {
                $group: {
                    _id: "$_id.productName",
                    brands: {
                        $push: {
                            brandName: "$brandInfo.brandName",
                            logo: "$brandInfo.logo",
                            skus: "$skuCount"
                        }
                    }
                }
            }
        ]);

        res.json(overview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================== WAREHOUSE CONTROLLERS ====================

export const getAllWarehouses = async (req, res) => {
    try {
        const { state, cluster, district } = req.query;
        let filter = {};
        if (state) filter.state = state;
        if (cluster) filter.cluster = cluster;
        if (district) filter.district = district;

        const warehouses = await Warehouse.find(filter)
            .populate('state', 'name')
            .populate('cluster', 'name')
            .populate('district', 'name')
            .populate('city', 'name');
        res.json({ success: true, count: warehouses.length, data: warehouses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createWarehouse = async (req, res) => {
    try {
        const warehouse = new Warehouse({ ...req.body, createdBy: req.user.id });
        await warehouse.save();
        res.status(201).json({ success: true, data: warehouse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
        res.json({ success: true, data: warehouse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
        if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
        res.json({ success: true, message: 'Warehouse deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWarehouseById = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id)
            .populate('state', 'name')
            .populate('cluster', 'name')
            .populate('district', 'name')
            .populate('city', 'name');
        if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
        res.json({ success: true, data: warehouse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
