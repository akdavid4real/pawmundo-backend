const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
};

// Test pet data
const testPet = {
  name: 'Buddy',
  species: 'dog',
  breed: 'Golden Retriever',
  age: 3,
  gender: 'male',
  weight: 25,
  color: 'golden'
};

async function testAPI() {
  try {
    console.log('🚀 Starting PawMundo API Tests...\n');

    // Step 1: Register user
    console.log('1. Registering user...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ User registered successfully');
      console.log('Token:', registerResponse.data.access_token.substring(0, 50) + '...');
      
      const token = registerResponse.data.access_token;
      
      // Step 2: Test creating a pet
      console.log('\n2. Creating pet...');
      const petResponse = await axios.post(`${BASE_URL}/pets`, testPet, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Pet created successfully');
      console.log('Pet ID:', petResponse.data._id);
      
      // Step 3: Get pets
      console.log('\n3. Getting pets...');
      const petsResponse = await axios.get(`${BASE_URL}/pets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Retrieved pets successfully');
      console.log('Number of pets:', petsResponse.data.length);
      
    } catch (registerError) {
      if (registerError.response?.status === 409) {
        console.log('⚠️  User already exists, trying to login...');
        
        // Step 1b: Login instead
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✅ User logged in successfully');
        
        const token = loginResponse.data.access_token;
        console.log('Token:', token.substring(0, 50) + '...');
        
        // Step 2: Test creating a pet
        console.log('\n2. Creating pet...');
        const petResponse = await axios.post(`${BASE_URL}/pets`, testPet, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Pet created successfully');
        console.log('Pet ID:', petResponse.data._id);
        
        // Step 3: Get pets
        console.log('\n3. Getting pets...');
        const petsResponse = await axios.get(`${BASE_URL}/pets`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Retrieved pets successfully');
        console.log('Number of pets:', petsResponse.data.length);
        
      } else {
        throw registerError;
      }
    }
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    
    // Troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure your server is running on port 3000');
    console.log('2. Check that MongoDB is running');
    console.log('3. Verify your .env file has JWT_SECRET set');
    console.log('4. Run: npm install axios (if not installed)');
  }
}

// Run the test
testAPI();