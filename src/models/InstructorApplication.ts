// src/models/InstructorApplication.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Session } from './Schedule';

export class InstructorApplication extends Model {
  public id!: number;
  public status!: 'pending' | 'approved' | 'rejected';
  public instructorId!: number;
  public sessionId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public readonly instructor?: User;
  public readonly session?: Session;
}

InstructorApplication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'InstructorApplication',
  }
);

InstructorApplication.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });
InstructorApplication.belongsTo(Session, { foreignKey: 'sessionId', as: 'session' });

export default InstructorApplication;