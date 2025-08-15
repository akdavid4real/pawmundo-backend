import { registerAs } from '@nestjs/config';

export const MongodbConfig = registerAs('mongodb', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pawpromise',
}));