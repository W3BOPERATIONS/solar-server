import Product from '../models/Product.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { categoryId, status, skuId, unitId, stateId, cityId, districtId } = req.query;
    const query = {};
    if (status !== undefined) query.status = status === 'true';
    if (categoryId) query.categoryId = categoryId;
    if (skuId) query.skuId = skuId;
    if (unitId) query.unitId = unitId;
    if (stateId) query.stateId = stateId;
    if (cityId) query.cityId = cityId;
    if (districtId) query.districtId = districtId;

    const products = await Product.find(query)
      .populate('categoryId')
      .populate('unitId')
      .populate('skuId')
      .populate('stateId')
      .populate('cityId')
      .populate('districtId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId')
      .populate('unitId')
      .populate('skuId')
      .populate('stateId')
      .populate('cityId')
      .populate('districtId');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, categoryId, unitId, skuId, stateId, cityId, districtId, description } = req.body;

    // Validation
    if (!name || !categoryId || !unitId || !skuId || !stateId || !cityId || !districtId) {
      return res.status(400).json({ success: false, message: 'All fields (Name, Category, Unit, SKU, State, City, District) are required' });
    }

    const product = await Product.create({
      name,
      categoryId,
      unitId,
      skuId,
      stateId,
      cityId,
      districtId,
      description,
      createdBy: req.user?._id
    });

    await product.populate('categoryId unitId skuId stateId cityId districtId');

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, categoryId, unitId, skuId, stateId, cityId, districtId, description, status } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, categoryId, unitId, skuId, stateId, cityId, districtId, description, status, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.populate('categoryId unitId skuId stateId cityId districtId');

    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
}
