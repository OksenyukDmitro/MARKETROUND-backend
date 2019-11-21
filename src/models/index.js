/* eslint-disable global-require */
import mongoose from 'mongoose';
import config from '../config';
import logger from '../utils/logger';

export default async () => {
  logger.silly('Connecting to MongoDB...');
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  logger.silly('Connected');

  // Load all models
  logger.silly('Loading user model...');
  await require('../models/user');
  logger.silly('Loaded user model');

  return connection.connection.db;
};
