import ProductPrice from '../models/ProductPrice.js';

export const createProductPriceHandler = {
    // Get prices for a specific cluster (and optionally product)
    getAll: async (req, res, next) => {
        try {
            const { clusterId, productId } = req.query;
            const query = {};
            if (clusterId) query.cluster = clusterId;
            if (productId) query.product = productId;

            const prices = await ProductPrice.find(query).populate('product');
            res.json({ success: true, count: prices.length, data: prices });
        } catch (err) {
            next(err);
        }
    },

    // Create or Update Price (Upsert)
    upsert: async (req, res, next) => {
        try {
            const { product, cluster, state, price, gst } = req.body;

            // Calculate base price if needed
            const basePrice = price && gst ? (price / (1 + gst / 100)) : (req.body.basePrice || 0);

            const item = await ProductPrice.findOneAndUpdate(
                { product, cluster },
                {
                    product, cluster, state, price, gst, basePrice,
                    updatedBy: req.user?._id,
                    $setOnInsert: { createdBy: req.user?._id }
                },
                { new: true, upsert: true, runValidators: true }
            );

            res.json({ success: true, message: 'Price saved successfully', data: item });
        } catch (err) {
            next(err);
        }
    },

    delete: async (req, res, next) => {
        try {
            await ProductPrice.findByIdAndDelete(req.params.id);
            res.json({ success: true, message: 'Price deleted' });
        } catch (err) {
            next(err);
        }
    }
};
