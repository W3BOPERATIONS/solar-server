import express from 'express';
import {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
  getAllStates,
  getStateById,
  createState,
  updateState,
  deleteState,
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
  getAllDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getAllClusters,
  getClusterById,
  createCluster,
  updateCluster,
  deleteCluster,
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone,
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
  getStatesHierarchy,
  getClustersHierarchy,
  getDistrictsHierarchy,
  getCitiesHierarchy
} from '../controllers/locationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Country routes
router.get('/countries', getAllCountries);
router.get('/countries/:id', getCountryById);
router.post('/countries', protect, createCountry);
router.put('/countries/:id', protect, updateCountry);
router.delete('/countries/:id', protect, deleteCountry);

// State routes
router.get('/states', getAllStates);
router.get('/states/:id', getStateById);
router.post('/states', protect, createState);
router.put('/states/:id', protect, updateState);
router.delete('/states/:id', protect, deleteState);

// City routes
router.get('/cities', getAllCities);
router.get('/cities/:id', getCityById);
router.post('/cities', protect, createCity);
router.put('/cities/:id', protect, updateCity);
router.delete('/cities/:id', protect, deleteCity);

// District routes
router.get('/districts', getAllDistricts);
router.get('/districts/:id', getDistrictById);
router.post('/districts', protect, createDistrict);
router.put('/districts/:id', protect, updateDistrict);
router.delete('/districts/:id', protect, deleteDistrict);

// Cluster routes
router.get('/clusters', getAllClusters);
router.get('/clusters/:id', getClusterById);
router.post('/clusters', protect, createCluster);
router.put('/clusters/:id', protect, updateCluster);
router.delete('/clusters/:id', protect, deleteCluster);

// Zone routes
router.get('/zones', getAllZones);
router.get('/zones/:id', getZoneById);
router.post('/zones', protect, createZone);
router.put('/zones/:id', protect, updateZone);
router.delete('/zones/:id', protect, deleteZone);

// Area routes
router.get('/areas', getAllAreas);
router.get('/areas/:id', getAreaById);
router.post('/areas', protect, createArea);
router.put('/areas/:id', protect, updateArea);
router.delete('/areas/:id', protect, deleteArea);

// Hierarchy routes
router.get('/hierarchy/states', getStatesHierarchy);
router.get('/hierarchy/clusters', getClustersHierarchy);
router.get('/hierarchy/districts', getDistrictsHierarchy);
router.get('/hierarchy/cities', getCitiesHierarchy);

export default router;
