import SKU from '../models/SKU.js';

export const getAllSKUs = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status !== undefined) query.status = status === 'true';

        const skus = await SKU.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: skus.length, data: skus });
    } catch (err) {
        next(err);
    }
};

export const createSKU = async (req, res, next) => {
    try {
        const { skuCode, description, brand, category, projectType, productType, technology, wattage } = req.body;

        if (!skuCode) return res.status(400).json({ success: false, message: 'SKU Code is required' });

        const sku = await SKU.create({
            skuCode,
            description,
            brand,
            category,
            projectType,
            productType,
            technology,
            wattage,
            createdBy: req.user?._id
        });

        res.status(201).json({ success: true, message: 'SKU created successfully', data: sku });
    } catch (err) {
        next(err);
    }
};

export const updateSKU = async (req, res, next) => {
    try {
        const { skuCode, description, status, brand, category, projectType, productType, technology, wattage } = req.body;

        const sku = await SKU.findByIdAndUpdate(
            req.params.id,
            { skuCode, description, status, brand, category, projectType, productType, technology, wattage, updatedBy: req.user?._id },
            { new: true, runValidators: true }
        );

        if (!sku) return res.status(404).json({ success: false, message: 'SKU not found' });

        res.json({ success: true, message: 'SKU updated successfully', data: sku });
    } catch (err) {
        next(err);
    }
};

export const deleteSKU = async (req, res, next) => {
    try {
        const sku = await SKU.findByIdAndDelete(req.params.id);
        if (!sku) return res.status(404).json({ success: false, message: 'SKU not found' });
        res.json({ success: true, message: 'SKU deleted successfully' });
    } catch (err) {
        next(err);
    }
}
