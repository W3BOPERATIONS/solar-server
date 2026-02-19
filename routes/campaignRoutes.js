import express from 'express';
import {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    getCampaignStats
} from '../controllers/campaignController.js';

const router = express.Router();

// Stats route must be before :id route to avoid conflict
router.get('/stats', getCampaignStats);

router.post('/', createCampaign);
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

export default router;
