// src/server.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import scheduleRoutes from './routes/scheduleRoutes';
import sequelize from './config/database';
import path from 'path';

console.log('Current working directory:', process.cwd());
console.log('Attempting to load .env file from:', path.resolve(process.cwd(), '.env'));

dotenv.config();

console.log('Environment variables:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => {
  console.error('Unable to sync database:', error);
});

export default app;