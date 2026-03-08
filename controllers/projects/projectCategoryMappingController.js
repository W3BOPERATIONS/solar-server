import ProjectCategoryMapping from '../../models/projects/ProjectCategoryMapping.js';

export const getAllMappings = async (req, res, next) => {
    try {
        const { stateId, clusterId, categoryId, status } = req.query;
        const query = {};
        
        if (status !== undefined) query.status = status === 'true';
        if (stateId) query.stateId = stateId;
        if (clusterId) query.clusterId = clusterId;
        if (categoryId) query.categoryId = categoryId;

        const mappings = await ProjectCategoryMapping.find(query)
            .populate('stateId')
            .populate('clusterId')
            .populate('categoryId')
            .populate('subCategoryId')
            .populate('subProjectTypeId')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: mappings.length, data: mappings });
    } catch (err) {
        next(err);
    }
};

export const createMapping = async (req, res, next) => {
    try {
        const { stateId, clusterId, categoryId, subCategoryId, projectTypeFrom, projectTypeTo, subProjectTypeId } = req.body;

        if (!stateId || !clusterId || !categoryId || !subCategoryId || projectTypeFrom === undefined || projectTypeTo === undefined) {
            return res.status(400).json({ success: false, message: 'All required mapping fields must be provided.' });
        }

        const mapping = await ProjectCategoryMapping.create({
            stateId,
            clusterId,
            categoryId,
            subCategoryId,
            projectTypeFrom,
            projectTypeTo,
            subProjectTypeId,
            createdBy: req.user?.id
        });

        await mapping.populate('stateId clusterId categoryId subCategoryId subProjectTypeId');

        res.status(201).json({ success: true, message: 'Project Category Mapping created successfully', data: mapping });
    } catch (err) {
        if (err.code === 11000) {
             return res.status(400).json({ success: false, message: 'A mapping with these exact parameters already exists in this cluster.' });
        }
        next(err);
    }
};

export const updateMapping = async (req, res, next) => {
    try {
        const { stateId, clusterId, categoryId, subCategoryId, projectTypeFrom, projectTypeTo, subProjectTypeId, status } = req.body;

        const mapping = await ProjectCategoryMapping.findByIdAndUpdate(
            req.params.id,
            {
                stateId,
                clusterId,
                categoryId,
                subCategoryId,
                projectTypeFrom,
                projectTypeTo,
                subProjectTypeId,
                status,
                updatedBy: req.user?.id
            },
            { new: true, runValidators: true }
        ).populate('stateId clusterId categoryId subCategoryId subProjectTypeId');

        if (!mapping) return res.status(404).json({ success: false, message: 'Mapping not found' });

        res.json({ success: true, message: 'Mapping updated successfully', data: mapping });
    } catch (err) {
        if (err.code === 11000) {
             return res.status(400).json({ success: false, message: 'A mapping with these exact parameters already exists in this cluster.' });
        }
        next(err);
    }
};

export const deleteMapping = async (req, res, next) => {
    try {
        const mapping = await ProjectCategoryMapping.findByIdAndDelete(req.params.id);
        if (!mapping) return res.status(404).json({ success: false, message: 'Mapping not found' });
        res.json({ success: true, message: 'Mapping deleted successfully' });
    } catch (err) {
        next(err);
    }
};
