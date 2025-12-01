import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import studentsRoutes from './routes/studentsRoutes.js';
import schedulesRoutes from './routes/schedulesRoutes.js';
import devicesRoutes from './routes/devicesRoutes.js';
import pendingRoutes from './routes/pendingRoutes.js';
import rfidRoutes from './routes/rfidRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import teachersRoutes from './routes/teachersRoutes.js'; 
import adminsRoutes from './routes/adminsRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/pending', pendingRoutes);
app.use('/api/rfid', rfidRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/admins', adminsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});