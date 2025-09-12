const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Import modular seed data
const {
  sampleUsers,
  samplePets,
  sampleHealthRecords,
  sampleMedications
} = require('../src/modules/seed');

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('pets').deleteMany({});
    await db.collection('healthrecords').deleteMany({});
    await db.collection('medications').deleteMany({});
    
    // Insert sample data
    await db.collection('users').insertMany(sampleUsers);
    console.log('✓ Users seeded');
    
    await db.collection('pets').insertMany(samplePets);
    console.log('✓ Pets seeded');
    
    await db.collection('healthrecords').insertMany(sampleHealthRecords);
    console.log('✓ Health records seeded');
    
    await db.collection('medications').insertMany(sampleMedications);
    console.log('✓ Medications seeded');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Seeded data summary:`);
    console.log(`   - ${sampleUsers.length} users`);
    console.log(`   - ${samplePets.length} pets`);
    console.log(`   - ${sampleHealthRecords.length} health records`);
    console.log(`   - ${sampleMedications.length} medications`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seed function
seedDatabase();

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };