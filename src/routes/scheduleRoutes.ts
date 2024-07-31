// src/routes/scheduleRoutes.ts
import express from 'express';
import { createSchedule, getSchedules } from '../controllers/scheduleController';

const router = express.Router();

router.post('/create', createSchedule);
router.get('/', getSchedules);

// Add more routes as needed

export default router;