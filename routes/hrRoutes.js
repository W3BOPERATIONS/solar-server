import express from 'express';
import {
    getAllModules,
    assignModulesToDepartment,
    getDepartmentModules,
    createTemporaryIncharge,
    getTemporaryIncharges,
    seedSystemModules
} from '../controllers/hrController.js';

const router = express.Router();

// Module Routes
router.get('/modules', getAllModules);
router.post('/seed-modules', seedSystemModules);
router.post('/modules/seed', seedSystemModules); // Admin helper

// Department Module Assignment
router.post('/department/:departmentId/modules', assignModulesToDepartment);
router.get('/department/:departmentId/modules', getDepartmentModules);

// Temporary Incharge
router.post('/temporary-incharge', createTemporaryIncharge);
router.get('/temporary-incharge', getTemporaryIncharges);

export default router;
