const axios = require('axios');

const BASE_URL = "http://localhost:3001";

async function testHealthWellness() {
  try {
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'mitchelogbu37@gmail.com',
      password: 'Michy@007'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login successful');
    
    // Create a pet first
    const petResponse = await axios.post(`${BASE_URL}/pets`, {
      name: 'Health Test Pet',
      species: 'dog',
      breed: 'Labrador',
      age: 2,
      gender: 'male'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const petId = petResponse.data._id;
    console.log('✅ Pet created:', petId);
    
    // Test 1: Log a walk activity
    console.log('\n🚶 Testing activity tracking...');
    const walkActivity = await axios.post(`${BASE_URL}/activity-tracking`, {
      petId: petId,
      type: 'walk',
      date: new Date().toISOString(),
      duration: 30,
      distance: 2.5,
      notes: 'Morning walk in the park'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Walk activity logged');
    
    // Test 2: Log feeding
    const feedingActivity = await axios.post(`${BASE_URL}/activity-tracking`, {
      petId: petId,
      type: 'feeding',
      date: new Date().toISOString(),
      foodAmount: 200,
      notes: 'Breakfast - dry kibble'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Feeding activity logged');
    
    // Test 3: Get pet activities
    const activities = await axios.get(`${BASE_URL}/activity-tracking/pet/${petId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Retrieved activities:', activities.data.length);
    
    // Test 4: Add medication
    console.log('\n💊 Testing medication tracking...');
    const medication = await axios.post(`${BASE_URL}/medications`, {
      petId: petId,
      name: 'Flea Prevention',
      dosage: '1 tablet',
      frequency: 'monthly',
      startDate: new Date().toISOString(),
      instructions: 'Give with food'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Medication added');
    
    // Test 5: Get medications
    const medications = await axios.get(`${BASE_URL}/medications/pet/${petId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Retrieved medications:', medications.data.length);
    
    // Test 6: Add health record
    console.log('\n🏥 Testing health records...');
    const healthRecord = await axios.post(`${BASE_URL}/health-records`, {
      petId: petId,
      type: 'vaccination',
      title: 'Annual Vaccination',
      description: 'Rabies and DHPP vaccination',
      date: new Date().toISOString(),
      veterinarian: 'Dr. Smith',
      clinic: 'Pet Care Clinic',
      cost: 150,
      nextDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Health record added');
    
    // Test 7: Get health records
    const healthRecords = await axios.get(`${BASE_URL}/health-records/pet/${petId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Retrieved health records:', healthRecords.data.length);
    
    // Test 8: Get daily stats
    const today = new Date().toISOString().split('T')[0];
    const dailyStats = await axios.get(`${BASE_URL}/activity-tracking/pet/${petId}/daily-stats?date=${today}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Daily stats retrieved:', {
      walks: dailyStats.data.totalWalks,
      feedings: dailyStats.data.totalFeedings,
      distance: dailyStats.data.totalDistance
    });
    
    console.log('\n🎉 All health & wellness features working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testHealthWellness();