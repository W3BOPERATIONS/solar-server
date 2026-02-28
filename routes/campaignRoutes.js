import express from 'express';
import * as campaignController from '../controllers/campaignController.js';

const router = express.Router();

// Stats route must be before :id route to avoid conflict
router.get('/stats', campaignController.getCampaignStats);

router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);

// Configuration routes
router.get('/settings/config', campaignController.getCampaignConfig);
router.put('/settings/config', campaignController.updateCampaignConfig);

// Social Media Platform routes
router.get('/social/platforms', campaignController.getAllSocialCampaigns);
router.post('/social/platforms', campaignController.createSocialCampaign);
router.put('/social/platforms/:id', campaignController.updateSocialCampaign);
router.delete('/social/platforms/:id', campaignController.deleteSocialCampaign);

export default router;
