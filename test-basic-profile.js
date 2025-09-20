const axios = require('axios');

const BASE_URL = "http://localhost:3001";

async function testBasicProfile() {
  try {
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'mitchelogbu37@gmail.com',
      password: 'Michy@007'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login successful');
    
    // Create pet with existing fields only
    const basicPet = {
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male',
      weight: 30.5,
      color: 'Golden',
      microchipId: 'CHIP123456789',
      dateOfBirth: '2021-03-15',
      medicalNotes: 'Regular checkups, no major issues',
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '+1234567890'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/pets`, basicPet, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Basic pet profile created');
    console.log('Pet ID:', createResponse.data._id);
    
    // Test ownership validation
    const getResponse = await axios.get(`${BASE_URL}/pets/${createResponse.data._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Successfully accessed own pet:', getResponse.data.name);
    console.log('🎉 Ownership validation working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBasicProfile();