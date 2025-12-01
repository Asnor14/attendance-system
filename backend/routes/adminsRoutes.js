import express from 'express';
import { getAllAdmins, createAdmin, deleteAdmin } from '../controllers/adminsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken); // Protect all routes

router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);

export default router;