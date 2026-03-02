import express from 'express';
import { getOverdueStatusSettings, updateOverdueStatusSettings, seedDefaultSettings } from '../../controllers/approvals/overdueStatusController.js';

const router = express.Router();

router.get('/', getOverdueStatusSettings);
router.put('/', updateOverdueStatusSettings);
router.post('/seed', seedDefaultSettings);

export default router;
