import OrderProcurementSetting from '../models/OrderProcurementSetting.js';

// @desc    Get all order procurement settings
// @route   GET /api/settings/order-procurement
// @access  Private
export const getAllSettings = async (req, res, next) => {
    try {
        const settings = await OrderProcurementSetting.find()
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('projectType', 'name')
            .populate('subProjectType', 'name')
            .populate('product', 'name')
            .populate('brand', 'name')
            .populate('skuItems.comboKit', 'comboKits')
            .populate('skuItems.supplierType', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: settings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single order procurement setting
// @route   GET /api/settings/order-procurement/:id
// @access  Private
export const getSettingById = async (req, res, next) => {
    try {
        const setting = await OrderProcurementSetting.findById(req.params.id)
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('projectType', 'name')
            .populate('subProjectType', 'name')
            .populate('product', 'name')
            .populate('brand', 'name')
            .populate('skuItems.comboKit', 'comboKits')
            .populate('skuItems.supplierType', 'name');

        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        res.json({
            success: true,
            data: setting
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new order procurement setting
// @route   POST /api/settings/order-procurement
// @access  Private
export const createSetting = async (req, res, next) => {
    try {
        req.body.createdBy = req.user._id;

        const setting = await OrderProcurementSetting.create(req.body);

        await setting.populate([
            { path: 'category', select: 'name' },
            { path: 'subCategory', select: 'name' },
            { path: 'projectType', select: 'name' },
            { path: 'subProjectType', select: 'name' },
            { path: 'product', select: 'name' },
            { path: 'brand', select: 'name' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Order Procurement Setting created successfully',
            data: setting
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order procurement setting
// @route   PUT /api/settings/order-procurement/:id
// @access  Private
export const updateSetting = async (req, res, next) => {
    try {
        let setting = await OrderProcurementSetting.findById(req.params.id);

        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        req.body.updatedBy = req.user._id;

        setting = await OrderProcurementSetting.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate([
            { path: 'category', select: 'name' },
            { path: 'subCategory', select: 'name' },
            { path: 'projectType', select: 'name' },
            { path: 'subProjectType', select: 'name' },
            { path: 'product', select: 'name' },
            { path: 'brand', select: 'name' }
        ]);

        res.json({
            success: true,
            message: 'Order Procurement Setting updated successfully',
            data: setting
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete order procurement setting
// @route   DELETE /api/settings/order-procurement/:id
// @access  Private
export const deleteSetting = async (req, res, next) => {
    try {
        const setting = await OrderProcurementSetting.findByIdAndDelete(req.params.id);

        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        res.json({
            success: true,
            message: 'Order Procurement Setting deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
