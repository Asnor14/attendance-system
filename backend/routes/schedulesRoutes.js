import express from 'express';
import { getAllSchedules, createSchedule, updateSchedule, deleteSchedule, syncSchedules } from '../controllers/schedulesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/sync', syncSchedules); // Public for Kiosk

router.use(authenticateToken); // Protect Admin/Teacher routes
router.get('/', getAllSchedules);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;