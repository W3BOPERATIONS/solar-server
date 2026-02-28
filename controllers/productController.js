import Product from '../models/Product.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { categoryId, status, skuId, unitId, stateId, cityId, districtId, clusterId, projectTypeId } = req.query;
    const query = {};
    if (status !== undefined) query.status = status === 'true';
    if (categoryId) query.categoryId = categoryId;
    if (projectTypeId) query.projectTypeId = projectTypeId;
    if (skuId) query.skuId = skuId;
    if (unitId) query.unitId = unitId;
    if (stateId) query.stateId = stateId;
    if (cityId) query.cityId = cityId;
    if (districtId) query.districtId = districtId;
    if (clusterId) query.clusterId = clusterId;

    const products = await Product.find(query)
      .populate('categoryId')
      .populate('subCategoryId')
      .populate('projectTypeId')
      .populate('subProjectTypeId')
      .populate('brandId')
      .populate('unitId')
      .populate('skuId')
      .populate('stateId')
      .populate('cityId')
      .populate('districtId')
      .populate('clusterId')
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
      .populate('subCategoryId')
      .populate('projectTypeId')
      .populate('subProjectTypeId')
      .populate('brandId')
      .populate('unitId')
      .populate('skuId')
      .populate('stateId')
      .populate('cityId')
      .populate('districtId')
      .populate('clusterId');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { 
      name, categoryId, subCategoryId, projectTypeId, subProjectTypeId, brandId, unitId, skuId, stateId, cityId, districtId, clusterId, description,
      serialNo, subtype, technology, tolerance, dcr, datasheet,
      mechanicalParameters, electricalParameters, skuParameters
    } = req.body;
    
    // Helper to handle empty strings for ObjectIds
    const toId = (val) => (val === "" || val === null) ? undefined : val;

    // Validation
    if (!name || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name and Category are required' });
    }

    const product = await Product.create({
      name,
      categoryId: toId(categoryId),
      subCategoryId: toId(subCategoryId),
      projectTypeId: toId(projectTypeId),
      subProjectTypeId: toId(subProjectTypeId),
      brandId: toId(brandId),
      unitId: toId(unitId),
      skuId: toId(skuId),
      stateId: toId(stateId),
      cityId: toId(cityId),
      districtId: toId(districtId),
      clusterId: toId(clusterId),
      serialNo,
      subtype,
      technology,
      tolerance,
      dcr,
      datasheet,
      mechanicalParameters,
      electricalParameters,
      skuParameters,
      description,
      createdBy: req.user?._id
    });

    await product.populate('categoryId subCategoryId projectTypeId subProjectTypeId brandId unitId skuId stateId cityId districtId clusterId');

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { 
      name, categoryId, subCategoryId, projectTypeId, subProjectTypeId, brandId, unitId, skuId, stateId, cityId, districtId, clusterId, description, status,
      serialNo, subtype, technology, tolerance, dcr, datasheet,
      mechanicalParameters, electricalParameters, skuParameters 
    } = req.body;

    const toId = (val) => (val === "" || val === null) ? undefined : val;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        categoryId: toId(categoryId),
        subCategoryId: toId(subCategoryId),
        projectTypeId: toId(projectTypeId),
        subProjectTypeId: toId(subProjectTypeId),
        brandId: toId(brandId),
        unitId: toId(unitId),
        skuId: toId(skuId),
        stateId: toId(stateId),
        cityId: toId(cityId),
        districtId: toId(districtId),
        clusterId: toId(clusterId),
        serialNo,
        subtype,
        technology,
        tolerance,
        dcr,
        datasheet,
        description,
        status,
        mechanicalParameters,
        electricalParameters,
        skuParameters,
        updatedBy: req.user?._id
      },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.populate('categoryId subCategoryId projectTypeId subProjectTypeId brandId unitId skuId stateId cityId districtId clusterId');

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
