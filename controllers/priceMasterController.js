import PriceMaster from '../models/PriceMaster.js';

export const getAllPriceMasters = async (req, res, next) => {
    try {
        const { productId, status } = req.query;
        const query = {};
        if (status !== undefined) query.status = status === 'true';
        if (productId) query.productId = productId;

        const prices = await PriceMaster.find(query).populate('productId').sort({ createdAt: -1 });
        res.json({ success: true, count: prices.length, data: prices });
    } catch (err) {
        next(err);
    }
};

export const createPriceMaster = async (req, res, next) => {
    try {
        const { productId, basePrice, tax, discount, finalPrice } = req.body;

        if (!productId || basePrice === undefined || tax === undefined || finalPrice === undefined) {
            return res.status(400).json({ success: false, message: 'Product, Base Price, Tax, and Final Price are required' });
        }

        // Check if price exists for product
        const existing = await PriceMaster.findOne({ productId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Price already exists for this product. Use update.' });
        }

        const price = await PriceMaster.create({
            productId,
            basePrice,
            tax,
            discount,
            finalPrice,
            createdBy: req.user?._id
        });

        await price.populate('productId');

        res.status(201).json({ success: true, message: 'Price set successfully', data: price });
    } catch (err) {
        next(err);
    }
};

export const updatePriceMaster = async (req, res, next) => {
    try {
        const { productId, basePrice, tax, discount, finalPrice, status } = req.body;

        // If updating by ID (req.params.id is PriceMaster ID)
        let price;
        if (req.params.id) {
            price = await PriceMaster.findByIdAndUpdate(
                req.params.id,
                { productId, basePrice, tax, discount, finalPrice, status, updatedBy: req.user?._id },
                { new: true, runValidators: true }
            );
        } else if (productId) {
            // Fallback if needed: update by product ID
            price = await PriceMaster.findOneAndUpdate(
                { productId },
                { basePrice, tax, discount, finalPrice, status, updatedBy: req.user?._id },
                { new: true, runValidators: true }
            );
        }

        if (!price) return res.status(404).json({ success: false, message: 'Price Master not found' });
        await price.populate('productId');

        res.json({ success: true, message: 'Price updated successfully', data: price });
    } catch (err) {
        next(err);
    }
};

export const deletePriceMaster = async (req, res, next) => {
    try {
        const price = await PriceMaster.findByIdAndDelete(req.params.id);
        if (!price) return res.status(404).json({ success: false, message: 'Price Master not found' });
        res.json({ success: true, message: 'Price deleted successfully' });
    } catch (err) {
        next(err);
    }
}
