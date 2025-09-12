import { registerAs } from '@nestjs/config';

export const MongodbConfig = registerAs('mongodb', () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  return {
    uri,
    options: {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2'),
      maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME || '30000'),
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '5000'),
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000'),
      bufferMaxEntries: 0,
      bufferCommands: false,
    }
  };
});