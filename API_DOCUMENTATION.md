# 🐾 PawMundo API Documentation

> Comprehensive API documentation for the PawMundo pet management platform

**Base URL:** `http://localhost:3000/api/v1`

## 📋 Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Pet Management](#pet-management)
- [Appointments](#appointments)
- [Health Records](#health-records)
- [Medications](#medications)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Postman Collection](#postman-collection)

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Register User

Create a new user account.

```http
POST /auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State"
}
```

**Required Fields:**
- `email` (string): Valid email address
- `password` (string): Minimum 6 characters
- `firstName` (string): User's first name
- `lastName` (string): User's last name

**Optional Fields:**
- `phone` (string): Phone number
- `address` (string): Physical address

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isEmailVerified": false
  }
}
```

### Login User

Authenticate user and get access token.

```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isEmailVerified": false,
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get User Profile

Get current user's profile information.

```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "profileImage": "https://cloudinary.com/image.jpg",
  "isEmailVerified": false,
  "lastLogin": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Forgot Password

Request password reset token.

```http
POST /auth/forgot-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If email exists, password reset link has been sent"
}
```

### Reset Password

Reset password using token.

```http
POST /auth/reset-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "reset-token-here",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

### Change Password

Change password for authenticated user.

```http
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

## 👤 User Management

### Update User Profile

Update current user's profile information.

```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phone": "+1234567890",
  "address": "456 New St, City, State",
  "profileImage": "https://cloudinary.com/new-image.jpg"
}
```

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phone": "+1234567890",
  "address": "456 New St, City, State",
  "profileImage": "https://cloudinary.com/new-image.jpg",
  "role": "user",
  "isEmailVerified": false,
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

## 🐕 Pet Management

### Create Pet

Add a new pet to user's account.

```http
POST /pets
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "weight": 25.5,
  "color": "golden",
  "microchipId": "123456789012345",
  "profileImage": "https://cloudinary.com/pet-image.jpg",
  "dateOfBirth": "2021-01-15",
  "medicalNotes": "No known allergies",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567890"
}
```

**Required Fields:**
- `name` (string): Pet's name
- `species` (string): dog, cat, bird, rabbit, hamster, fish, reptile, other
- `breed` (string): Pet's breed
- `age` (number): Age in years (0-30)
- `gender` (string): male, female

**Optional Fields:**
- `weight` (number): Weight in kg
- `color` (string): Pet's color
- `microchipId` (string): 15-digit microchip ID
- `profileImage` (string): Image URL
- `dateOfBirth` (string): ISO date string
- `medicalNotes` (string): Medical notes
- `emergencyContactName` (string): Emergency contact name
- `emergencyContactPhone` (string): Emergency contact phone

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "weight": 25.5,
  "color": "golden",
  "microchipId": "123456789012345",
  "profileImage": "https://cloudinary.com/pet-image.jpg",
  "ownerId": "507f1f77bcf86cd799439011",
  "healthStatus": "healthy",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Get My Pets

Retrieve all pets belonging to the authenticated user.

```http
GET /pets
Authorization: Bearer <token>
```

**Query Parameters:**
- `species` (optional): Filter by species (dog, cat, etc.)

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "gender": "male",
    "weight": 25.5,
    "color": "golden",
    "ownerId": "507f1f77bcf86cd799439011",
    "healthStatus": "healthy",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Pet by ID

Retrieve specific pet information.

```http
GET /pets/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "weight": 25.5,
  "color": "golden",
  "microchipId": "123456789012345",
  "profileImage": "https://cloudinary.com/pet-image.jpg",
  "ownerId": "507f1f77bcf86cd799439011",
  "dateOfBirth": "2021-01-15T00:00:00.000Z",
  "medicalNotes": "No known allergies",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567890",
  "healthStatus": "healthy",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Pet

Update pet information.

```http
PUT /pets/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Buddy Updated",
  "age": 4,
  "weight": 26.0,
  "medicalNotes": "Updated medical notes"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Buddy Updated",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 4,
  "gender": "male",
  "weight": 26.0,
  "color": "golden",
  "ownerId": "507f1f77bcf86cd799439011",
  "medicalNotes": "Updated medical notes",
  "healthStatus": "healthy",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

### Update Pet Health Status

Update pet's health status.

```http
PATCH /pets/:id/health-status
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "recovering"
}
```

**Valid Status Values:**
- `healthy`
- `sick`
- `recovering`
- `chronic`

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Buddy",
  "healthStatus": "recovering",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

### Delete Pet

Soft delete a pet (sets isActive to false).

```http
DELETE /pets/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Buddy",
  "isActive": false,
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

## 📅 Appointments

### Create Appointment

Schedule a new veterinary appointment.

```http
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "petId": "507f1f77bcf86cd799439012",
  "vetName": "Dr. Smith",
  "vetClinic": "Happy Paws Veterinary Clinic",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "14:30",
  "reason": "Annual checkup",
  "notes": "First visit to this clinic",
  "vetPhone": "+1234567890",
  "vetEmail": "dr.smith@happypaws.com"
}
```

**Required Fields:**
- `petId` (string): Pet's ObjectId
- `vetName` (string): Veterinarian's name
- `vetClinic` (string): Clinic name
- `appointmentDate` (string): Date in YYYY-MM-DD format
- `appointmentTime` (string): Time in HH:MM format
- `reason` (string): Reason for appointment

**Optional Fields:**
- `notes` (string): Additional notes
- `vetPhone` (string): Veterinarian's phone
- `vetEmail` (string): Veterinarian's email

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "petId": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever"
  },
  "vetName": "Dr. Smith",
  "vetClinic": "Happy Paws Veterinary Clinic",
  "appointmentDate": "2024-02-15T00:00:00.000Z",
  "appointmentTime": "14:30",
  "reason": "Annual checkup",
  "status": "scheduled",
  "notes": "First visit to this clinic",
  "vetPhone": "+1234567890",
  "vetEmail": "dr.smith@happypaws.com",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Get My Appointments

Retrieve all appointments for the authenticated user.

```http
GET /appointments
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "petId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Buddy",
      "species": "dog",
      "breed": "Golden Retriever"
    },
    "vetName": "Dr. Smith",
    "vetClinic": "Happy Paws Veterinary Clinic",
    "appointmentDate": "2024-02-15T00:00:00.000Z",
    "appointmentTime": "14:30",
    "reason": "Annual checkup",
    "status": "scheduled",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Upcoming Appointments

Retrieve upcoming appointments (future dates with scheduled/confirmed status).

```http
GET /appointments/upcoming
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "petId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Buddy",
      "species": "dog",
      "breed": "Golden Retriever"
    },
    "vetName": "Dr. Smith",
    "vetClinic": "Happy Paws Veterinary Clinic",
    "appointmentDate": "2024-02-15T00:00:00.000Z",
    "appointmentTime": "14:30",
    "reason": "Annual checkup",
    "status": "scheduled"
  }
]
```

### Get Appointment by ID

Retrieve specific appointment details.

```http
GET /appointments/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "petId": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever"
  },
  "vetName": "Dr. Smith",
  "vetClinic": "Happy Paws Veterinary Clinic",
  "appointmentDate": "2024-02-15T00:00:00.000Z",
  "appointmentTime": "14:30",
  "reason": "Annual checkup",
  "status": "scheduled",
  "notes": "First visit to this clinic",
  "vetPhone": "+1234567890",
  "vetEmail": "dr.smith@happypaws.com",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Appointment

Update appointment details.

```http
PUT /appointments/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "appointmentDate": "2024-02-16",
  "appointmentTime": "15:00",
  "notes": "Updated appointment time",
  "status": "confirmed"
}
```

**Valid Status Values:**
- `scheduled`
- `confirmed`
- `completed`
- `cancelled`

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "petId": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever"
  },
  "vetName": "Dr. Smith",
  "vetClinic": "Happy Paws Veterinary Clinic",
  "appointmentDate": "2024-02-16T00:00:00.000Z",
  "appointmentTime": "15:00",
  "reason": "Annual checkup",
  "status": "confirmed",
  "notes": "Updated appointment time",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

### Cancel Appointment

Cancel an appointment (sets status to 'cancelled').

```http
PATCH /appointments/:id/cancel
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "cancelled",
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

### Delete Appointment

Soft delete an appointment (sets isActive to false).

```http
DELETE /appointments/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "isActive": false,
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

## 💊 Medications

### Create Medication

Add a new medication for a pet.

```http
POST /medications
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "petId": "507f1f77bcf86cd799439012",
  "name": "Antibiotics",
  "dosage": "250mg",
  "frequency": "daily",
  "startDate": "2024-01-15",
  "endDate": "2024-01-25",
  "instructions": "Give with food",
  "veterinarian": "Dr. Smith"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "petId": "507f1f77bcf86cd799439012",
  "name": "Antibiotics",
  "dosage": "250mg",
  "frequency": "daily",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-25T00:00:00.000Z",
  "instructions": "Give with food",
  "veterinarian": "Dr. Smith",
  "isActive": true,
  "isCompleted": false
}
```

### Get Active Medications

Retrieve all active medications for user's pets.

```http
GET /medications/active
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "petId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Buddy",
      "species": "dog"
    },
    "name": "Antibiotics",
    "dosage": "250mg",
    "frequency": "daily",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-25T00:00:00.000Z",
    "isCompleted": false
  }
]
```

### Get Pet Medications

Retrieve all medications for a specific pet.

```http
GET /medications/pet/:petId
Authorization: Bearer <token>
```

### Mark Medication Completed

Mark a medication as completed.

```http
PATCH /medications/:id/complete
Authorization: Bearer <token>
```

## 🏥 Health Records

### Create Health Record

Add a new health record for a pet.

```http
POST /health-records
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "petId": "507f1f77bcf86cd799439012",
  "type": "vaccination",
  "title": "Rabies Vaccination",
  "description": "Annual rabies vaccination administered",
  "date": "2024-01-15",
  "veterinarian": "Dr. Smith",
  "clinic": "Happy Paws Veterinary Clinic",
  "nextDueDate": "2025-01-15",
  "weight": 25.5,
  "temperature": 38.5,
  "heartRate": 120,
  "cost": 75.00,
  "notes": "Pet handled vaccination well",
  "attachments": ["https://cloudinary.com/vaccination-cert.pdf"]
}
```

**Required Fields:**
- `petId` (string): Pet's ObjectId
- `type` (string): Record type (vaccination, checkup, treatment, surgery, etc.)
- `title` (string): Record title
- `date` (string): Date in YYYY-MM-DD format

**Optional Fields:**
- `description` (string): Detailed description
- `veterinarian` (string): Veterinarian name
- `clinic` (string): Clinic name
- `nextDueDate` (string): Next due date for recurring items
- `weight` (number): Pet's weight at time of record
- `temperature` (number): Body temperature
- `heartRate` (number): Heart rate
- `cost` (number): Cost of treatment
- `notes` (string): Additional notes
- `attachments` (array): Array of file URLs

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "petId": "507f1f77bcf86cd799439012",
  "type": "vaccination",
  "title": "Rabies Vaccination",
  "description": "Annual rabies vaccination administered",
  "date": "2024-01-15T00:00:00.000Z",
  "veterinarian": "Dr. Smith",
  "clinic": "Happy Paws Veterinary Clinic",
  "nextDueDate": "2025-01-15T00:00:00.000Z",
  "weight": 25.5,
  "temperature": 38.5,
  "heartRate": 120,
  "cost": 75.00,
  "notes": "Pet handled vaccination well",
  "attachments": ["https://cloudinary.com/vaccination-cert.pdf"],
  "isReminder": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Get Pet Health Records

Retrieve all health records for a specific pet.

```http
GET /health-records/pet/:petId
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional): Filter by record type

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "petId": "507f1f77bcf86cd799439012",
    "type": "vaccination",
    "title": "Rabies Vaccination",
    "description": "Annual rabies vaccination administered",
    "date": "2024-01-15T00:00:00.000Z",
    "veterinarian": "Dr. Smith",
    "clinic": "Happy Paws Veterinary Clinic",
    "nextDueDate": "2025-01-15T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Health Record by ID

Retrieve specific health record details.

```http
GET /health-records/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "petId": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever"
  },
  "type": "vaccination",
  "title": "Rabies Vaccination",
  "description": "Annual rabies vaccination administered",
  "date": "2024-01-15T00:00:00.000Z",
  "veterinarian": "Dr. Smith",
  "clinic": "Happy Paws Veterinary Clinic",
  "nextDueDate": "2025-01-15T00:00:00.000Z",
  "weight": 25.5,
  "temperature": 38.5,
  "heartRate": 120,
  "cost": 75.00,
  "notes": "Pet handled vaccination well",
  "attachments": ["https://cloudinary.com/vaccination-cert.pdf"],
  "isReminder": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Get Upcoming Reminders

Retrieve upcoming health reminders for user's pets.

```http
GET /health-records/reminders/upcoming
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "petId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Buddy",
      "species": "dog",
      "breed": "Golden Retriever"
    },
    "type": "vaccination",
    "title": "Rabies Vaccination",
    "nextDueDate": "2025-01-15T00:00:00.000Z",
    "veterinarian": "Dr. Smith",
    "clinic": "Happy Paws Veterinary Clinic"
  }
]
```

### Get Pet Vaccinations

Retrieve vaccination records for a specific pet.

```http
GET /health-records/pet/:petId/vaccinations
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "petId": "507f1f77bcf86cd799439012",
    "type": "vaccination",
    "title": "Rabies Vaccination",
    "date": "2024-01-15T00:00:00.000Z",
    "nextDueDate": "2025-01-15T00:00:00.000Z",
    "veterinarian": "Dr. Smith",
    "clinic": "Happy Paws Veterinary Clinic"
  }
]
```

### Get Pet Health Summary

Get health summary statistics for a pet.

```http
GET /health-records/pet/:petId/summary
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalRecords": 5,
  "recordsByType": {
    "vaccination": 2,
    "checkup": 2,
    "treatment": 1
  },
  "lastCheckup": "2024-01-10T00:00:00.000Z",
  "nextReminder": "2025-01-15T00:00:00.000Z"
}
```

### Update Health Record

Update health record information.

```http
PUT /health-records/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Rabies Vaccination",
  "notes": "Updated notes",
  "cost": 80.00
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "title": "Updated Rabies Vaccination",
  "notes": "Updated notes",
  "cost": 80.00,
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

### Delete Health Record

Soft delete a health record (sets isActive to false).

```http
DELETE /health-records/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "isActive": false,
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

## ❌ Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

### Common Error Examples

**Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

**Unauthorized Error (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Not Found Error (404):**
```json
{
  "statusCode": 404,
  "message": "Pet not found",
  "error": "Not Found"
}
```

**Conflict Error (409):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

## 🚦 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **File upload endpoints**: 10 requests per minute per user

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642694400
```

## 📮 Postman Collection

Import the included Postman collection for easy API testing:

1. Open Postman
2. Click "Import"
3. Select `PawMundo_API.postman_collection.json`
4. Set up environment variables:
   - `baseUrl`: `http://localhost:3000/api/v1`
   - `token`: Your JWT token (set after login)

### Environment Variables

```json
{
  "baseUrl": "http://localhost:3000/api/v1",
  "token": "{{access_token}}",
  "userId": "{{user_id}}",
  "petId": "{{pet_id}}"
}
```

## 🔧 Testing Examples

### Complete User Journey

1. **Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Create Pet:**
```bash
curl -X POST http://localhost:3000/api/v1/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Buddy","species":"dog","breed":"Golden Retriever","age":3,"gender":"male"}'
```

4. **Schedule Appointment:**
```bash
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"petId":"PET_ID","vetName":"Dr. Smith","vetClinic":"Happy Paws","appointmentDate":"2024-02-15","appointmentTime":"14:30","reason":"Checkup"}'
```

5. **Add Health Record:**
```bash
curl -X POST http://localhost:3000/api/v1/health-records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"petId":"PET_ID","type":"vaccination","title":"Rabies Shot","date":"2024-01-15"}'
```

---

**Need help?** Check the main [README.md](./README.md) or create an issue on GitHub.