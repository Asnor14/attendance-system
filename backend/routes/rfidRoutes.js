import express from 'express';
import {
  getLiveRfidUid,
  updateRfidUid,
  clearRfidUid
} from '../controllers/rfidController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint for ESP8266 to update RFID
router.post('/update', updateRfidUid);

// Protected endpoints for admin
router.use(authenticateToken);
router.get('/live', getLiveRfidUid);
router.post('/clear', clearRfidUid);

export default router;

