import express from 'express';
import { getOverdueTaskSettings, updateOverdueTaskSettings } from '../controllers/overdueTaskController.js';

const router = express.Router();

router.get('/', getOverdueTaskSettings);
router.put('/', updateOverdueTaskSettings);

export default router;
