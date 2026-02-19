import express from 'express';
import { protect } from '../middleware/auth.js';
import * as hrmsController from '../controllers/hrmsSettingsController.js';

const router = express.Router();

// HRMS Settings (Department/Position Config)
router.get('/settings', protect, hrmsController.getHRMSSettings);
router.post('/settings', protect, hrmsController.createOrUpdateHRMSSettings);

// Candidate Tests
router.get('/tests', protect, hrmsController.getCandidateTests);
router.post('/tests', protect, hrmsController.createCandidateTest);
router.put('/tests/:id', protect, hrmsController.updateCandidateTest);
router.delete('/tests/:id', protect, hrmsController.deleteCandidateTest);

// Candidate Trainings
router.get('/trainings', protect, hrmsController.getCandidateTrainings);
router.post('/trainings', protect, hrmsController.createCandidateTraining);
router.put('/trainings/:id', protect, hrmsController.updateCandidateTraining);
router.delete('/trainings/:id', protect, hrmsController.deleteCandidateTraining);

export default router;
