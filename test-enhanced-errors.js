const axios = require('axios');

const BASE_URL = "http://localhost:3001";

async function testEnhancedErrors() {
  try {
    console.log('🧪 Testing Enhanced Error Messages...\n');

    // Test 1: Validation Error
    console.log('1️⃣ Testing validation errors...');
    try {
      await axios.post(`${BASE_URL}/pets`, {
        name: '', // Invalid: empty name
        species: 'invalid_species', // Invalid: not in enum
        age: -1, // Invalid: negative age
      });
    } catch (error) {
      console.log('✅ Validation Error Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    // Test 2: Authentication Error
    console.log('\n2️⃣ Testing authentication errors...');
    try {
      await axios.get(`${BASE_URL}/pets`); // No auth token
    } catch (error) {
      console.log('✅ Authentication Error Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    // Test 3: Not Found Error
    console.log('\n3️⃣ Testing not found errors...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'mitchelogbu37@gmail.com',
      password: 'Michy@007'
    });
    const token = loginResponse.data.access_token;

    try {
      await axios.get(`${BASE_URL}/pets/507f1f77bcf86cd799439999`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.log('✅ Not Found Error Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    // Test 4: Activity Validation Error
    console.log('\n4️⃣ Testing activity validation errors...');
    try {
      await axios.post(`${BASE_URL}/activity-tracking`, {
        petId: 'invalid_id',
        type: 'invalid_type',
        date: 'invalid_date',
        duration: -10
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.log('✅ Activity Validation Error Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    console.log('\n🎉 Enhanced error message testing completed!');
    console.log('\n📖 Check Swagger documentation at: http://localhost:3001/api');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEnhancedErrors();