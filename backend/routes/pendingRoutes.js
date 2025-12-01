import express from 'express';
import {
  getAllPending,
  getPendingById,
  createPending,
  approvePending,
  rejectPending
} from '../controllers/pendingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Allow public access to createPending so your external Registration Site can use it
// OR keep it protected if your registration site will have an API key
// For now, let's keep it protected or open depending on your plan. 
// If you want an external site to post here, you might need to move createPending outside authenticateToken
router.post('/', createPending); 

router.use(authenticateToken); // Protect everything below
router.get('/', getAllPending);
router.get('/:id', getPendingById);
router.post('/:id/approve', approvePending);
router.post('/:id/reject', rejectPending);

export default router;