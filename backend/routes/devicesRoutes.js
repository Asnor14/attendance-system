import express from 'express';
import { 
  getAllDevices, 
  getDeviceById, 
  createDevice,    // 👈 1. ADD THIS IMPORT
  deleteDevice,
  getDeviceLogs,
  deviceHeartbeat,
  registerDevice 
} from '../controllers/devicesController.js';

const router = express.Router();

// 2. ADD THIS ROUTE 👇
router.post('/', createDevice); // Matches POST /api/devices

router.get('/', getAllDevices);
router.post('/register', registerDevice); 
router.get('/:id', getDeviceById);
router.delete('/:id', deleteDevice);
router.get('/:id/logs', getDeviceLogs);
router.post('/:id/heartbeat', deviceHeartbeat);

export default router;