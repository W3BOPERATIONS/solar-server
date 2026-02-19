import express from 'express';
import {
    getInstallerVendors,
    createInstallerVendor,
    updateInstallerVendor,
    deleteInstallerVendor,
    getSupplierTypes,
    createSupplierType,
    updateSupplierType,
    deleteSupplierType,
    getSupplierVendors,
    createSupplierVendor,
    updateSupplierVendor,
    deleteSupplierVendor,
    getVendorDashboardMetrics,
    getVendorOrders
} from '../controllers/vendorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Installer Vendor Routes
router.route('/installer-vendors')
    .get(getInstallerVendors)
    .post(protect, createInstallerVendor);

router.route('/installer-vendors/:id')
    .put(protect, updateInstallerVendor)
    .delete(protect, deleteInstallerVendor);

// Supplier Type Routes
router.route('/supplier-types')
    .get(getSupplierTypes)
    .post(protect, createSupplierType);

router.route('/supplier-types/:id')
    .put(protect, updateSupplierType)
    .delete(protect, deleteSupplierType);

// Supplier Vendor Routes
router.route('/supplier-vendors')
    .get(getSupplierVendors)
    .post(protect, createSupplierVendor);

router.route('/supplier-vendors/:id')
    .put(protect, updateSupplierVendor)
    .delete(protect, deleteSupplierVendor);

// Dashboard Routes
router.get('/dashboard-metrics', protect, getVendorDashboardMetrics);
router.get('/orders', protect, getVendorOrders);

export default router;
