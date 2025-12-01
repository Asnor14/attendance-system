import express from 'express';
import { login, verifyToken, updateProfile } from '../controllers/authController.js'; // Import updateProfile
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);
router.put('/profile', authenticateToken, updateProfile); // 👈 NEW ROUTE

export default router;