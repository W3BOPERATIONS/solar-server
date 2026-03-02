import express from 'express';
import {
    getAllSettings,
    createSetting,
    updateSetting,
    deleteSetting
} from '../../controllers/settings/buyLeadSettingController.js';

const router = express.Router();

router.get('/', getAllSettings);
router.post('/', createSetting);
router.put('/:id', updateSetting);
router.delete('/:id', deleteSetting);

export default router;
