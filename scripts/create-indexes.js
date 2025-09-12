const mongoose = require('mongoose');
require('dotenv').config();

async function createIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    console.log('Creating performance indexes...');
    
    // Health Records indexes
    const healthRecordsCollection = db.collection('healthrecords');
    await healthRecordsCollection.createIndex({ petId: 1, isActive: 1 });
    await healthRecordsCollection.createIndex({ petId: 1, type: 1, isActive: 1 });
    await healthRecordsCollection.createIndex({ petId: 1, date: -1 });
    await healthRecordsCollection.createIndex({ nextDueDate: 1, isActive: 1 });
    await healthRecordsCollection.createIndex({ petId: 1, nextDueDate: 1 });
    
    // Pets indexes
    const petsCollection = db.collection('pets');
    await petsCollection.createIndex({ ownerId: 1, isActive: 1 });
    await petsCollection.createIndex({ ownerId: 1, species: 1, isActive: 1 });
    await petsCollection.createIndex({ ownerId: 1, healthStatus: 1, isActive: 1 });
    
    console.log('All indexes created successfully!');
    
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createIndexes();