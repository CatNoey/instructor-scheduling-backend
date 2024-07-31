// src/controllers/scheduleController.ts
import { Request, Response } from 'express';
import { Schedule } from '../models/Schedule';

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const scheduleData = req.body;
    const newSchedule = await Schedule.create(scheduleData);
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Error creating schedule', error: (error as Error).message });
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await Schedule.findAll();
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules', error: (error as Error).message });
  }
};

// Add more controller functions as needed