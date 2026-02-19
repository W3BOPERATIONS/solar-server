import Country from '../models/Country.js';
import State from '../models/State.js';
import City from '../models/City.js';
import District from '../models/District.js';
import Cluster from '../models/Cluster.js';
import Zone from '../models/Zone.js';
import Area from '../models/Area.js';
import locationService from '../services/locationService.js';

// ==================== COUNTRY CONTROLLERS ====================

export const getAllCountries = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const query = isActive !== undefined ? { isActive: isActive === 'true' } : {};

    const countries = await Country.find(query).sort({ name: 1 });
    res.json({
      success: true,
      count: countries.length,
      data: countries,
    });
  } catch (err) {
    next(err);
  }
};

export const getCountryById = async (req, res, next) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ success: false, message: 'Country not found' });

    res.json({ success: true, data: country });
  } catch (err) {
    next(err);
  }
};

export const createCountry = async (req, res, next) => {
  try {
    const { name, code, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Country name is required' });
    }

    const country = await Country.create({
      name,
      code,
      description,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, message: 'Country created successfully', data: country });
  } catch (err) {
    next(err);
  }
};

export const updateCountry = async (req, res, next) => {
  try {
    const { name, code, description, isActive } = req.body;

    const country = await Country.findByIdAndUpdate(
      req.params.id,
      { name, code, description, isActive, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    );

    if (!country) return res.status(404).json({ success: false, message: 'Country not found' });

    res.json({ success: true, message: 'Country updated successfully', data: country });
  } catch (err) {
    next(err);
  }
};

export const deleteCountry = async (req, res, next) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) return res.status(404).json({ success: false, message: 'Country not found' });

    res.json({ success: true, message: 'Country deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ==================== STATE CONTROLLERS ====================

export const getAllStates = async (req, res, next) => {
  try {
    const { countryId, isActive } = req.query;
    const query = {};

    if (countryId) query.country = countryId;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const states = await State.find(query).populate('country').sort({ name: 1 });
    res.json({ success: true, count: states.length, data: states });
  } catch (err) {
    next(err);
  }
};

export const getStateById = async (req, res, next) => {
  try {
    const state = await State.findById(req.params.id).populate('country');
    if (!state) return res.status(404).json({ success: false, message: 'State not found' });

    res.json({ success: true, data: state });
  } catch (err) {
    next(err);
  }
};

export const createState = async (req, res, next) => {
  try {
    const { name, code, country, description } = req.body;

    if (!name || !country) {
      return res.status(400).json({ success: false, message: 'State name and country are required' });
    }

    const state = await State.create({
      name,
      code,
      country,
      description,
      createdBy: req.user?._id,
    });

    await state.populate('country');
    res.status(201).json({ success: true, message: 'State created successfully', data: state });
  } catch (err) {
    next(err);
  }
};

export const updateState = async (req, res, next) => {
  try {
    const { name, code, country, description, isActive } = req.body;

    const state = await State.findByIdAndUpdate(
      req.params.id,
      { name, code, country, description, isActive, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    ).populate('country');

    if (!state) return res.status(404).json({ success: false, message: 'State not found' });

    res.json({ success: true, message: 'State updated successfully', data: state });
  } catch (err) {
    next(err);
  }
};

export const deleteState = async (req, res, next) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) return res.status(404).json({ success: false, message: 'State not found' });

    res.json({ success: true, message: 'State deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ==================== CITY CONTROLLERS ====================

export const getAllCities = async (req, res, next) => {
  try {
    const { stateId, countryId, isActive } = req.query;
    const query = {};

    if (stateId) query.state = stateId;
    if (countryId) query.country = countryId;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const cities = await City.find(query).populate('state country').sort({ name: 1 });
    res.json({ success: true, count: cities.length, data: cities });
  } catch (err) {
    next(err);
  }
};

export const getCityById = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id).populate('state country');
    if (!city) return res.status(404).json({ success: false, message: 'City not found' });

    res.json({ success: true, data: city });
  } catch (err) {
    next(err);
  }
};

export const createCity = async (req, res, next) => {
  try {
    const { name, code, state, country, description } = req.body;

    if (!name || !state || !country) {
      return res.status(400).json({ success: false, message: 'City name, state and country are required' });
    }

    const city = await City.create({
      name,
      code,
      state,
      country,
      description,
      createdBy: req.user?._id,
    });

    await city.populate('state country');
    res.status(201).json({ success: true, message: 'City created successfully', data: city });
  } catch (err) {
    next(err);
  }
};

export const updateCity = async (req, res, next) => {
  try {
    const { name, code, state, country, description, isActive } = req.body;

    const city = await City.findByIdAndUpdate(
      req.params.id,
      { name, code, state, country, description, isActive, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    ).populate('state country');

    if (!city) return res.status(404).json({ success: false, message: 'City not found' });

    res.json({ success: true, message: 'City updated successfully', data: city });
  } catch (err) {
    next(err);
  }
};

export const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: 'City not found' });

    res.json({ success: true, message: 'City deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ==================== DISTRICT CONTROLLERS ====================

export const getAllDistricts = async (req, res, next) => {
  try {
    const { cityId, stateId, countryId, isActive } = req.query;
    const query = {};

    if (cityId) query.city = cityId;
    if (stateId) query.state = stateId;
    if (countryId) query.country = countryId;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const districts = await District.find(query).populate('city state country').sort({ name: 1 });
    res.json({ success: true, count: districts.length, data: districts });
  } catch (err) {
    next(err);
  }
};

export const getDistrictById = async (req, res, next) => {
  try {
    const district = await District.findById(req.params.id).populate('city state country');
    if (!district) return res.status(404).json({ success: false, message: 'District not found' });

    res.json({ success: true, data: district });
  } catch (err) {
    next(err);
  }
};

export const createDistrict = async (req, res, next) => {
  try {
    const { name, code, city, state, country, description } = req.body;

    if (!name || !city || !state || !country) {
      return res.status(400).json({ success: false, message: 'District name, city, state and country are required' });
    }

    const district = await District.create({
      name,
      code,
      city,
      state,
      country,
      description,
      createdBy: req.user?._id,
    });

    await district.populate('city state country');
    res.status(201).json({ success: true, message: 'District created successfully', data: district });
  } catch (err) {
    next(err);
  }
};

export const updateDistrict = async (req, res, next) => {
  try {
    const { name, code, city, state, country, description, isActive } = req.body;

    const district = await District.findByIdAndUpdate(
      req.params.id,
      { name, code, city, state, country, description, isActive, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    ).populate('city state country');

    if (!district) return res.status(404).json({ success: false, message: 'District not found' });

    res.json({ success: true, message: 'District updated successfully', data: district });
  } catch (err) {
    next(err);
  }
};

export const deleteDistrict = async (req, res, next) => {
  try {
    const district = await District.findByIdAndDelete(req.params.id);
    if (!district) return res.status(404).json({ success: false, message: 'District not found' });

    res.json({ success: true, message: 'District deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ==================== CLUSTER CONTROLLERS ====================

export const getAllClusters = async (req, res, next) => {
  try {
    const { districtId, stateId, countryId, isActive } = req.query;
    const query = {};

    if (districtId) query.district = districtId;
    if (stateId) query.state = stateId;
    if (countryId) query.country = countryId;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const clusters = await Cluster.find(query).populate('district state country').sort({ name: 1 });
    res.json({ success: true, count: clusters.length, data: clusters });
  } catch (err) {
    next(err);
  }
};

export const getClusterById = async (req, res, next) => {
  try {
    const cluster = await Cluster.findById(req.params.id).populate('district state country');
    if (!cluster) return res.status(404).json({ success: false, message: 'Cluster not found' });

    res.json({ success: true, data: cluster });
  } catch (err) {
    next(err);
  }
};

export const createCluster = async (req, res, next) => {
  try {
    const { name, code, district, state, country, description } = req.body;

    if (!name || !district || !state || !country) {
      return res.status(400).json({ success: false, message: 'Cluster name, district, state and country are required' });
    }

    const cluster = await Cluster.create({
      name,
      code,
      district,
      state,
      country,
      description,
      createdBy: req.user?._id,
    });

    await cluster.populate('district state country');
    res.status(201).json({ success: true, message: 'Cluster created successfully', data: cluster });
  } catch (err) {
    next(err);
  }
};

export const updateCluster = async (req, res, next) => {
  try {
    const { name, code, district, state, country, description, isActive } = req.body;

    const cluster = await Cluster.findByIdAndUpdate(
      req.params.id,
      { name, code, district, state, country, description, isActive, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    ).populate('district state country');

    if (!cluster) return res.status(404).json({ success: false, message: 'Cluster not found' });

    res.json({ success: true, message: 'Cluster updated successfully', data: cluster });
  } catch (err) {
    next(err);
  }
};

export const deleteCluster = async (req, res, next) => {
  try {
    const cluster = await Cluster.findByIdAndDelete(req.params.id);
    if (!cluster) return res.status(404).json({ success: false, message: 'Cluster not found' });

    res.json({ success: true, message: 'Cluster deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ==================== ZONE CONTROLLERS ====================

export const getAllZones = async (req, res, next) => {
  try {
    const { clusterId, districtId, stateId, countryId, isActive } = req.query;
    const query = {};

    if (clusterId) query.cluster = clusterId;
    if (districtId) query.district = districtId;
    if (stateId) query.state = stateId;
    if (countryId) query.country = countryId;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const zones = await Zone.find(query).populate('cluster district state country').sort({ name: 1 });
    res.json({ success: true, count: zones.length, data: zones });
  } catch (err) {
    next(err);
  }
};

export const getZoneById = async (req, res, next) => {
  try {
    const zone = await Zone.findById(req.params.id).populate('cluster district state country');
    if (!zone) return res.status(404).json({ success: false, message: 'Zone not found' });

    res.json({ success: true, data: zone });
  } catch (err) {
    next(err);
  }
};

export const createZone = async (req, res, next) => {
  try {
    const { name, code, cluster, district, state, country, description } = req.body;

    if (!name || !cluster || !district || !state || !country) {
      return res.status(400).json({ success: false, message: 'All location fields are required' });
    }

    const zone = await Zone.create({
      name,
      code,
      cluster,
      district,
      state,
      country,
      description,
      createdBy: req.user?._id,
    });

    await zone.populate('cluster district state country');
    res.status(201).json({ success: true, message: 'Zone created successfully', data: zone });
  } catch (err) {
    next(err);
  }
};

export const updateZone = async (req, res, next) => {
  try {
    const { name, code, cluster, district, state, country, description, isActive } = req.body;

    const zone = await Zone.findByIdAndUpdate(
      req.params.id,
      { name, code, cluster, district, state, country, description, isActive, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    ).populate('cluster district state country');

    if (!zone) return res.status(404).json({ success: false, message: 'Zone not found' });

    res.json({ success: true, message: 'Zone updated successfully', data: zone });
  } catch (err) {
    next(err);
  }
};

export const deleteZone = async (req, res, next) => {
  try {
    const zone = await Zone.findByIdAndDelete(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: 'Zone not found' });

    res.json({ success: true, message: 'Zone deleted successfully' });
  } catch (err) {
    next(err);
  }
};


// ==================== AREA CONTROLLERS ====================

export const getAllAreas = async (req, res, next) => {
  try {
    const { districtId, clusterId, stateId, countryId, isActive } = req.query;
    const query = {};

    if (districtId) query.district = districtId;
    if (clusterId) query.cluster = clusterId;
    if (stateId) query.state = stateId;
    if (countryId) query.country = countryId;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Note: Area is linked to District, but we can filter by higher levels if needed by querying District?
    // Actually our Area model has references to all levels.

    const areas = await Area.find(query).populate('district cluster state country').sort({ name: 1 });
    res.json({ success: true, count: areas.length, data: areas });
  } catch (err) {
    next(err);
  }
};

export const getAreaById = async (req, res, next) => {
  try {
    const area = await Area.findById(req.params.id).populate('district cluster state country');
    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });

    res.json({ success: true, data: area });
  } catch (err) {
    next(err);
  }
};

export const createArea = async (req, res, next) => {
  try {
    const { name, code, district, cluster, state, country, pincodes, description } = req.body;

    if (!name || !district || !cluster || !state || !country) {
      return res.status(400).json({ success: false, message: 'Area name, district, cluster, state and country are required' });
    }

    const area = await Area.create({
      name,
      code,
      district,
      cluster,
      state,
      country,
      pincodes,
      description,
      createdBy: req.user?._id,
    });

    await area.populate('district cluster state country');
    res.status(201).json({ success: true, message: 'Area created successfully', data: area });
  } catch (err) {
    next(err);
  }
};

export const updateArea = async (req, res, next) => {
  try {
    const { name, code, district, cluster, state, country, pincodes, description, isActive } = req.body;

    const area = await Area.findByIdAndUpdate(
      req.params.id,
      { name, code, district, cluster, state, country, pincodes, description, isActive, updatedBy: req.user?._id },
      { new: true, runValidators: true }
    ).populate('district cluster state country');

    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });

    res.json({ success: true, message: 'Area updated successfully', data: area });
  } catch (err) {
    next(err);
  }
};

export const deleteArea = async (req, res, next) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });

    res.json({ success: true, message: 'Area deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ==================== HIERARCHY CONTROLLERS ====================

export const getStatesHierarchy = async (req, res, next) => {
  try {
    const data = await locationService.getStates();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getClustersHierarchy = async (req, res, next) => {
  try {
    const { stateId } = req.query;
    const data = await locationService.getClustersByState(stateId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getDistrictsHierarchy = async (req, res, next) => {
  try {
    const { clusterId } = req.query;
    const data = await locationService.getDistrictsByCluster(clusterId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getCitiesHierarchy = async (req, res, next) => {
  try {
    const { districtId } = req.query;
    const data = await locationService.getCitiesByDistrict(districtId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
