import { Request, Response } from 'express';
import { Session } from '../models/Schedule';
import { InstructorApplication } from '../models/InstructorApplication';
import { User } from '../models/User';

export class InstructorApplicationController {
  async getAvailableSessions(req: Request, res: Response) {
    try {
      const sessions = await Session.find({
        where: { assignedInstructor: null },
        order: { date: 'ASC' },
      });

      return res.status(200).json(sessions);
    } catch (error) {
      console.error('Error in getAvailableSessions:', error);
      return res.status(500).json({ message: 'An error occurred while fetching available sessions' });
    }
  }

  async applyForSession(req: Request, res: Response) {
    const { sessionId } = req.params;
    const userId = (req.user as any).id;

    try {
      const session = await Session.findOne(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      if (session.assignedInstructor) {
        return res.status(400).json({ message: 'This session already has an assigned instructor' });
      }

      const user = await User.findOne(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingApplication = await InstructorApplication.findOne({
        where: { session: sessionId, instructor: userId }
      });

      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this session' });
      }

      const newApplication = new InstructorApplication();
      newApplication.session = session;
      newApplication.instructor = user;
      newApplication.status = 'pending';

      await newApplication.save();

      return res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (error) {
      console.error('Error in applyForSession:', error);
      return res.status(500).json({ message: 'An error occurred while processing your application' });
    }
  }

  async cancelApplication(req: Request, res: Response) {
    const { applicationId } = req.params;
    const userId = (req.user as any).id;

    try {
      const application = await InstructorApplication.findOne(applicationId, { relations: ['instructor', 'session'] });

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      if (application.instructor.id !== userId) {
        return res.status(403).json({ message: 'You are not authorized to cancel this application' });
      }

      if (application.status !== 'pending') {
        return res.status(400).json({ message: 'Only pending applications can be cancelled' });
      }

      await application.remove();

      return res.status(200).json({ message: 'Application cancelled successfully' });
    } catch (error) {
      console.error('Error in cancelApplication:', error);
      return res.status(500).json({ message: 'An error occurred while cancelling your application' });
    }
  }

  async getInstructorApplications(req: Request, res: Response) {
    const userId = (req.user as any).id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const [applications, total] = await InstructorApplication.findAndCount({
        where: { instructor: userId },
        relations: ['session'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit
      });

      return res.status(200).json({
        applications,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      });
    } catch (error) {
      console.error('Error in getInstructorApplications:', error);
      return res.status(500).json({ message: 'An error occurred while fetching your applications' });
    }
  }
}