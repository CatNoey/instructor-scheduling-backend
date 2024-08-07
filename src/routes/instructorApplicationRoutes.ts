import express from 'express';
import { InstructorApplicationController } from '../controllers/InstructorApplicationController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';

const router = express.Router();
const controller = new InstructorApplicationController();

router.use(authenticateToken); // Ensure all routes are protected
router.use(checkRole(['instructor'])); // Ensure only instructors can access these routes

router.get('/available-sessions', controller.getAvailableSessions.bind(controller));
router.post('/sessions/:sessionId/apply', controller.applyForSession.bind(controller));
router.delete('/applications/:applicationId', controller.cancelApplication.bind(controller));
router.get('/applications', controller.getInstructorApplications.bind(controller));

export default router;