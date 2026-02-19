import express from 'express';
import {
    getFranchiseManagerPerformance,
    getFranchiseePerformance,
    getDealerManagerPerformance,
    getDealerPerformance
} from '../controllers/performanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/franchise-manager', protect, getFranchiseManagerPerformance);
router.get('/franchise', protect, getFranchiseePerformance);
router.get('/dealer-manager', protect, getDealerManagerPerformance);
router.get('/dealer', protect, getDealerPerformance);

export default router;
