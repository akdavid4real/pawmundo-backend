const axios = require('axios');

const BASE_URL = 'https://pawpromise-backend.onrender.com';

async function testOnline() {
  try {
    console.log('🌐 Testing online deployment...');
    
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'mitchelogbu37@gmail.com',
      password: 'Michy@007'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login successful');
    
    // Create pet
    const createResponse = await axios.post(`${BASE_URL}/pets`, {
      name: 'Online Test Pet',
      species: 'dog',
      breed: 'Test Breed',
      age: 2,
      gender: 'male'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const petId = createResponse.data._id;
    console.log('✅ Pet created:', petId);
    
    // Access own pet
    const accessResponse = await axios.get(`${BASE_URL}/pets/${petId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Own pet accessed:', accessResponse.data.name);
    
    // Try to access non-existent pet
    try {
      await axios.get(`${BASE_URL}/pets/507f1f77bcf86cd799439011`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('❌ Should not access non-existent pet');
    } catch (error) {
      console.log('✅ Correctly blocked non-existent pet access');
    }
    
    console.log('🎉 Online deployment working correctly!');
    
  } catch (error) {
    console.error('❌ Online test failed:', error.response?.data || error.message);
  }
}

testOnline();