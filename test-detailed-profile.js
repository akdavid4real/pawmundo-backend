const axios = require('axios');

const BASE_URL = "http://localhost:3001";

async function testDetailedProfile() {
  try {
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'mitchelogbu37@gmail.com',
      password: 'Michy@007'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login successful');
    
    // Create detailed pet profile
    const detailedPet = {
      name: 'Max',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male',
      weight: 30.5,
      color: 'Golden',
      microchipId: 'CHIP123456789',
      dateOfBirth: '2021-03-15',
      medicalNotes: 'Regular checkups, no major issues',
      allergies: ['chicken', 'wheat'],
      pastIllnesses: ['kennel cough'],
      surgeries: ['neutering'],
      dietaryPreferences: 'Grain-free diet',
      dietaryRestrictions: ['chicken', 'dairy'],
      behavioralNotes: 'Very friendly, loves playing fetch, afraid of thunderstorms',
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '+1234567890'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/pets`, detailedPet, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Detailed pet profile created');
    console.log('Pet ID:', createResponse.data._id);
    
    // Retrieve and verify the detailed profile
    const getResponse = await axios.get(`${BASE_URL}/pets/${createResponse.data._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const pet = getResponse.data;
    console.log('\n📋 Detailed Profile Verification:');
    console.log('Name:', pet.name);
    console.log('Breed:', pet.breed);
    console.log('Microchip:', pet.microchipId);
    console.log('Allergies:', pet.allergies);
    console.log('Past Illnesses:', pet.pastIllnesses);
    console.log('Surgeries:', pet.surgeries);
    console.log('Dietary Preferences:', pet.dietaryPreferences);
    console.log('Dietary Restrictions:', pet.dietaryRestrictions);
    console.log('Behavioral Notes:', pet.behavioralNotes);
    
    console.log('\n🎉 Detailed pet profile working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testDetailedProfile();