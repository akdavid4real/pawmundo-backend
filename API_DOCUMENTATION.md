# PawPromise Backend API Documentation

## Overview
PawPromise is a comprehensive pet management platform built with NestJS and MongoDB. This API provides endpoints for user authentication, pet management, and various pet-related services.

**Base URL:** `http://localhost:3000/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Auth Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Get User Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

## Pet Management

All pet endpoints require authentication.

### Pet Endpoints

#### Create Pet
```http
POST /api/v1/pets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "weight": 25,
  "color": "golden",
  "microchipId": "123456789",
  "profileImage": "https://example.com/image.jpg"
}
```

**Required Fields:**
- `name` (string): Pet's name
- `species` (string): One of: dog, cat, bird, rabbit, hamster, fish, reptile, other
- `breed` (string): Pet's breed
- `age` (number): Age in years (0-30)
- `gender` (string): male or female

**Optional Fields:**
- `weight` (number): Weight in kg
- `color` (string): Pet's color
- `microchipId` (string): Microchip identifier
- `profileImage` (string): URL to pet's photo

**Response:**
```json
{
  "_id": "pet_id",
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "weight": 25,
  "color": "golden",
  "ownerId": "user_id",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get My Pets
```http
GET /api/v1/pets
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "pet_id",
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "gender": "male",
    "weight": 25,
    "color": "golden",
    "ownerId": "user_id",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get Pet by ID
```http
GET /api/v1/pets/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "pet_id",
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "weight": 25,
  "color": "golden",
  "ownerId": "user_id",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Update Pet
```http
PUT /api/v1/pets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Buddy Updated",
  "age": 4,
  "weight": 26
}
```

**Response:**
```json
{
  "_id": "pet_id",
  "name": "Buddy Updated",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 4,
  "gender": "male",
  "weight": 26,
  "color": "golden",
  "ownerId": "user_id",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

#### Delete Pet (Soft Delete)
```http
DELETE /api/v1/pets/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "pet_id",
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "weight": 25,
  "color": "golden",
  "ownerId": "user_id",
  "isActive": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

## Available Modules

The following modules are available but endpoints are not yet implemented:

- **Appointments** (`/api/v1/appointments`) - Pet appointment scheduling
- **Health Records** (`/api/v1/health-records`) - Medical history tracking
- **Medications** (`/api/v1/medications`) - Medication management
- **Health Reminders** (`/api/v1/health-reminders`) - Vaccination and checkup reminders
- **Consultations** (`/api/v1/consultations`) - Veterinary consultations
- **Insurance** (`/api/v1/insurance`) - Pet insurance management
- **Symptom Checker** (`/api/v1/symptom-checker`) - AI-powered symptom analysis
- **Forum** (`/api/v1/forum`) - Community discussions
- **Notifications** (`/api/v1/notifications`) - Push notifications

## Error Responses

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Environment Variables

Required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/pawpromise

# JWT
JWT_SECRET=your-secret-key

# Redis (for queues)
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3000
```

## Testing the API

### 1. Register a new user:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login to get token:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create a pet (use token from login):
```bash
curl -X POST http://localhost:3000/api/v1/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "gender": "male",
    "weight": 25,
    "color": "golden"
  }'
```

## Troubleshooting

### 401 Unauthorized Error
- Ensure you have a valid JWT token
- Check that the token is not expired
- Verify the JWT_SECRET environment variable matches
- Make sure the Authorization header format is correct: `Bearer <token>`

### Validation Errors
- Check that all required fields are provided
- Ensure data types match the expected format
- Verify enum values (species, gender) are from allowed options

### Database Connection Issues
- Verify MongoDB is running
- Check MONGODB_URI environment variable
- Ensure database permissions are correct