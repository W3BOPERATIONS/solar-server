import express from 'express';
import {
    getSolarInstallers,
    createSolarInstaller,
    updateSolarInstaller,
    deleteSolarInstaller,
    getInstallerTools,
    createInstallerTool,
    updateInstallerTool,
    deleteInstallerTool,
    getInstallerRatings,
    createInstallerRating,
    updateInstallerRating,
    deleteInstallerRating,
    getInstallerAgencies,
    createInstallerAgency,
    updateInstallerAgency,
    deleteInstallerAgency,
    getInstallerAgencyPlans,
    createInstallerAgencyPlan,
    updateInstallerAgencyPlan,
    deleteInstallerAgencyPlan
} from '../controllers/installerController.js';

const router = express.Router();

// Solar Installers
router.get('/installers', getSolarInstallers);
router.post('/installers', createSolarInstaller);
router.put('/installers/:id', updateSolarInstaller);
router.delete('/installers/:id', deleteSolarInstaller);

// Installer Tools
router.get('/tools', getInstallerTools);
router.post('/tools', createInstallerTool);
router.put('/tools/:id', updateInstallerTool);
router.delete('/tools/:id', deleteInstallerTool);

// Installer Ratings
router.get('/ratings', getInstallerRatings);
router.post('/ratings', createInstallerRating);
router.put('/ratings/:id', updateInstallerRating);
router.delete('/ratings/:id', deleteInstallerRating);

// Installer Agencies
router.get('/agencies', getInstallerAgencies);
router.post('/agencies', createInstallerAgency);
router.put('/agencies/:id', updateInstallerAgency);
router.delete('/agencies/:id', deleteInstallerAgency);

// Installer Agency Plans
router.get('/agency-plans', getInstallerAgencyPlans);
router.post('/agency-plans', createInstallerAgencyPlan);
router.put('/agency-plans/:id', updateInstallerAgencyPlan);
router.delete('/agency-plans/:id', deleteInstallerAgencyPlan);

export default router;
