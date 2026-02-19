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
    getInstallationRates,
    createInstallationRate,
    updateInstallationRate,
    deleteInstallationRate,
    getInstallerAgencies,
    createInstallerAgency,
    updateInstallerAgency,
    deleteInstallerAgency
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

// Installation Rates
router.get('/rates', getInstallationRates);
router.post('/rates', createInstallationRate);
router.put('/rates/:id', updateInstallationRate);
router.delete('/rates/:id', deleteInstallationRate);

// Installer Agencies
router.get('/agencies', getInstallerAgencies);
router.post('/agencies', createInstallerAgency);
router.put('/agencies/:id', updateInstallerAgency);
router.delete('/agencies/:id', deleteInstallerAgency);

export default router;
