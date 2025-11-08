# 🐾 PawMundo API Endpoints Documentation

## Base URL
- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://pawpromise-backend.onrender.com/api/v1`

## Swagger Documentation
Access interactive API documentation at: `http://localhost:3000/api`

---

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",  // or "vet"
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

## 🩺 Consultations

### Create Consultation
```http
POST /consultations
Authorization: Bearer {token}
Content-Type: application/json

{
  "petId": "507f1f77bcf86cd799439011",
  "scheduledDate": "2024-12-25T10:00:00Z",
  "reason": "Annual checkup",
  "symptoms": "None",
  "consultationType": "video",
  "duration": 30
}
```

### Get All Consultations
```http
GET /consultations
Authorization: Bearer {token}

# Filter by status
GET /consultations?status=pending
GET /consultations?status=completed
```

### Get Upcoming Consultations
```http
GET /consultations/upcoming
Authorization: Bearer {token}
```

### Get Single Consultation
```http
GET /consultations/:id
Authorization: Bearer {token}
```

### Update Consultation
```http
PATCH /consultations/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "scheduledDate": "2024-12-26T14:00:00Z",
  "reason": "Follow-up checkup"
}
```

### Cancel Consultation
```http
PATCH /consultations/:id/cancel
Authorization: Bearer {token}
```

### Start Consultation (Vet)
```http
PATCH /consultations/:id/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "meetingLink": "https://meet.example.com/abc123"
}
```

### Complete Consultation (Vet)
```http
PATCH /consultations/:id/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Patient responded well to treatment",
  "prescription": "Amoxicillin 500mg twice daily for 7 days"
}
```

---

## 🩺 Vet Consultation Endpoints (Vet Role Required)

### Get Vet Queue
```http
GET /consultations/vet/queue
Authorization: Bearer {token}
```

### Get Active Consultations
```http
GET /consultations/vet/active
Authorization: Bearer {token}
```

### Get Consultation History
```http
GET /consultations/vet/history
Authorization: Bearer {token}
```

### Accept Consultation
```http
POST /consultations/:id/accept
Authorization: Bearer {token}
```

### Release Consultation
```http
POST /consultations/:id/release
Authorization: Bearer {token}
```

---

## 🐕 Pets

### Create Pet
```http
POST /pets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "weight": 30,
  "color": "Golden",
  "microchipId": "123456789"
}
```

### Get All Pets
```http
GET /pets
Authorization: Bearer {token}

# Filter by species
GET /pets?species=dog
```

### Get Pet by ID
```http
GET /pets/:id
Authorization: Bearer {token}
```

### Update Pet
```http
PATCH /pets/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "weight": 32,
  "age": 4
}
```

### Delete Pet (Soft Delete)
```http
DELETE /pets/:id
Authorization: Bearer {token}
```

### Update Health Status
```http
PATCH /pets/:id/health-status
Authorization: Bearer {token}
Content-Type: application/json

{
  "healthStatus": "sick"
}
```

---

## 🏥 Health Records

### Create Health Record
```http
POST /health-records
Authorization: Bearer {token}
Content-Type: application/json

{
  "petId": "507f1f77bcf86cd799439011",
  "type": "vaccination",
  "title": "Annual Vaccination",
  "description": "Rabies and DHPP",
  "date": "2024-01-15",
  "veterinarian": "Dr. Smith",
  "clinic": "Pet Care Clinic",
  "nextDueDate": "2025-01-15",
  "cost": 150
}
```

### Get Health Records by Pet
```http
GET /health-records/pet/:petId
Authorization: Bearer {token}

# Filter by type
GET /health-records/pet/:petId?type=vaccination
```

### Get Upcoming Reminders
```http
GET /health-records/reminders
Authorization: Bearer {token}
```

### Get Health Summary
```http
GET /health-records/pet/:petId/summary
Authorization: Bearer {token}
```

---

## 💊 Medications

### Create Medication
```http
POST /medications
Authorization: Bearer {token}
Content-Type: application/json

{
  "petId": "507f1f77bcf86cd799439011",
  "name": "Amoxicillin",
  "dosage": "500mg",
  "frequency": "twice daily",
  "startDate": "2024-01-15",
  "endDate": "2024-01-22",
  "instructions": "Give with food"
}
```

### Get Medications by Pet
```http
GET /medications/pet/:petId
Authorization: Bearer {token}

# Get active only
GET /medications/pet/:petId?status=active
```

---

## 📅 Appointments

### Create Appointment
```http
POST /appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "petId": "507f1f77bcf86cd799439011",
  "vetName": "Dr. Sarah Johnson",
  "vetClinic": "Pet Care Clinic",
  "appointmentDate": "2024-12-25",
  "appointmentTime": "10:00 AM",
  "reason": "Annual checkup",
  "vetPhone": "+1234567890"
}
```

### Get All Appointments
```http
GET /appointments
Authorization: Bearer {token}

# Filter by status
GET /appointments?status=scheduled
```

### Get Upcoming Appointments
```http
GET /appointments/upcoming
Authorization: Bearer {token}
```

---

## 🏃 Activity Tracking

### Log Activity
```http
POST /activity-tracking
Authorization: Bearer {token}
Content-Type: application/json

{
  "petId": "507f1f77bcf86cd799439011",
  "type": "walk",
  "date": "2024-01-15T10:00:00Z",
  "duration": 30,
  "distance": 2.5,
  "notes": "Morning walk in the park"
}
```

### Get Activities by Pet
```http
GET /activity-tracking/pet/:petId
Authorization: Bearer {token}

# Filter by type
GET /activity-tracking/pet/:petId?type=walk
```

---

## 🛡️ Insurance

### Create Insurance Policy
```http
POST /insurance
Authorization: Bearer {token}
Content-Type: application/json

{
  "petId": "507f1f77bcf86cd799439011",
  "provider": "PetSure",
  "policyNumber": "PS123456",
  "planType": "Comprehensive",
  "monthlyPremium": 50,
  "deductible": 200,
  "coverageLimit": 10000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

### Check Coverage
```http
POST /insurance/:id/check-coverage
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000
}

Response:
{
  "covered": true,
  "coverageAmount": 800,
  "deductible": 200,
  "outOfPocket": 200
}
```

### Submit Claim
```http
POST /insurance/claims
Authorization: Bearer {token}
Content-Type: application/json

{
  "insuranceId": "507f1f77bcf86cd799439011",
  "serviceDate": "2024-01-15",
  "serviceType": "Surgery",
  "amount": 1500,
  "description": "Emergency surgery"
}
```

---

## 🌱 Seed Data (Development Only)

### Seed Database
```http
POST /seed
```

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## 🔒 Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎭 Roles

- **user** - Pet owner (default)
- **vet** - Veterinarian (access to vet-specific endpoints)
- **admin** - Administrator (full access)

---

## 🔌 WebSocket Events

Connect to: `ws://localhost:3000/consultations`

### Client Events (Emit)
- `consultation:register` - Register as available vet
- `consultation:accept` - Accept a consultation
- `consultation:release` - Release a consultation

### Server Events (Listen)
- `consultation:incoming` - New consultation created
- `consultation:claimed` - Consultation accepted by vet
- `consultation:released` - Consultation returned to queue
- `consultation:completed` - Consultation finished
- `consultation:updated` - Consultation metadata changed

---

## 📝 Notes

1. All dates should be in ISO 8601 format
2. All IDs are MongoDB ObjectIds (24 character hex strings)
3. Pagination is available on list endpoints (add `?page=1&limit=10`)
4. Soft deletes are used (items marked as `isActive: false`)
5. All responses include timestamps (`createdAt`, `updatedAt`)
