# 🩺 Veterinarian Consultation System Guide

## Overview

The PawMundo platform now supports veterinarian accounts with a real-time consultation queue system. Vets can accept, manage, and complete consultations from pet owners through REST APIs and WebSocket connections.

## Features

- **Role-Based Registration**: Users can register as either 'user' or 'vet'
- **Real-Time Queue**: Vets see incoming consultations in real-time
- **Consultation Management**: Accept, release, and complete consultations
- **WebSocket Support**: Live updates for consultation status changes
- **Optimistic Locking**: Prevents multiple vets from accepting the same consultation

## API Endpoints

### Authentication

#### Register as Veterinarian
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "vet@example.com",
  "password": "SecurePass123",
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "role": "vet",
  "phone": "+1234567890",
  "address": "123 Vet Clinic St"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "vet@example.com",
  "password": "SecurePass123"
}
```

Response includes JWT token with role information.

### Veterinarian Consultation Endpoints

All endpoints require JWT authentication with `role: 'vet'`.

#### Get Consultation Queue
```http
GET /api/v1/consultations/vet/queue
Authorization: Bearer <token>
```

Returns array of pending consultations waiting to be assigned.

**Response:**
```json
[
  {
    "_id": "consultation_id",
    "userId": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "petId": {
      "name": "Buddy",
      "species": "dog",
      "breed": "Golden Retriever",
      "age": 3
    },
    "status": "pending",
    "scheduledDate": "2024-01-20T10:00:00Z",
    "reason": "Annual checkup",
    "symptoms": "None",
    "consultationType": "video",
    "unreadCount": 0
  }
]
```

#### Get Active Consultations
```http
GET /api/v1/consultations/vet/active
Authorization: Bearer <token>
```

Returns consultations currently assigned to the requesting vet.

#### Get Consultation History
```http
GET /api/v1/consultations/vet/history
Authorization: Bearer <token>
```

Returns recently completed consultations (last 50).

#### Accept Consultation
```http
POST /api/v1/consultations/:id/accept
Authorization: Bearer <token>
```

Assigns the consultation to the requesting vet. Returns 409 if already assigned.

**Response:**
```json
{
  "_id": "consultation_id",
  "assignedVet": "vet_user_id",
  "status": "assigned",
  "userId": { ... },
  "petId": { ... }
}
```

#### Release Consultation
```http
POST /api/v1/consultations/:id/release
Authorization: Bearer <token>
```

Returns the consultation back to the queue for other vets to accept.

## WebSocket Events

### Connection

Connect to: `ws://localhost:3000/consultations` (or your server URL without `/api/v1`)

**Authentication:**
```javascript
const socket = io('http://localhost:3000/consultations', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client → Server Events

#### Register as Available Vet
```javascript
socket.emit('consultation:register', {
  role: 'veterinarian',
  vetId: 'your-vet-user-id'
}, (response) => {
  console.log(response); // { success: true, message: '...' }
});
```

#### Accept Consultation
```javascript
socket.emit('consultation:accept', {
  consultationId: 'consultation_id'
}, (response) => {
  if (response.success) {
    console.log('Consultation accepted:', response.consultation);
  } else {
    console.error('Error:', response.error);
  }
});
```

#### Release Consultation
```javascript
socket.emit('consultation:release', {
  consultationId: 'consultation_id'
}, (response) => {
  console.log(response); // { success: true }
});
```

### Server → Client Events

#### New Consultation Incoming
```javascript
socket.on('consultation:incoming', (consultation) => {
  console.log('New consultation:', consultation);
  // Add to queue UI
});
```

#### Consultation Claimed
```javascript
socket.on('consultation:claimed', (data) => {
  console.log('Consultation claimed:', data);
  // { consultationId, vetId, vetName }
  // Remove from queue if claimed by another vet
});
```

#### Consultation Released
```javascript
socket.on('consultation:released', (data) => {
  console.log('Consultation released:', data);
  // { consultationId }
  // Add back to queue
});
```

#### Consultation Completed
```javascript
socket.on('consultation:completed', (data) => {
  console.log('Consultation completed:', data);
  // { consultationId }
  // Remove from active list
});
```

#### Consultation Updated
```javascript
socket.on('consultation:updated', (data) => {
  console.log('Consultation updated:', data);
  // { consultationId, unreadCount, lastMessageAt, ... }
  // Update UI with new metadata
});
```

## Database Schema

### Consultation Model

```typescript
{
  userId: ObjectId,              // Pet owner
  petId: ObjectId,               // Pet
  assignedVet: ObjectId,         // Assigned veterinarian (optional)
  veterinarianName: string,      // Vet name (optional)
  status: enum,                  // 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled'
  scheduledDate: Date,           // Consultation date/time
  duration: number,              // Duration in minutes (default: 30)
  reason: string,                // Reason for consultation
  symptoms: string,              // Pet symptoms (optional)
  notes: string,                 // Vet notes (optional)
  prescription: string,          // Prescription (optional)
  followUpRequired: boolean,     // Follow-up needed
  followUpDate: Date,            // Follow-up date (optional)
  consultationType: enum,        // 'video' | 'audio' | 'chat'
  meetingLink: string,           // Video call link (optional)
  meetingId: string,             // Meeting ID (optional)
  cost: number,                  // Consultation cost
  paymentStatus: enum,           // 'pending' | 'paid' | 'refunded'
  unreadCount: number,           // Unread messages count
  lastMessageAt: Date,           // Last message timestamp
  isActive: boolean,             // Soft delete flag
  createdAt: Date,
  updatedAt: Date
}
```

## Business Rules

1. **Queue Management**
   - Only consultations with `status: 'pending'` appear in the queue
   - Consultations are sorted by `scheduledDate` (earliest first)

2. **Assignment**
   - Only one vet can be assigned to a consultation at a time
   - When a vet accepts, status changes from 'pending' to 'assigned'
   - If already assigned, returns 409 Conflict error

3. **Release**
   - Only the assigned vet can release a consultation
   - Status changes back to 'pending' and `assignedVet` is cleared
   - Consultation re-enters the queue for other vets

4. **Real-Time Updates**
   - All connected vets receive `consultation:incoming` when owners create consultations
   - All vets receive `consultation:claimed` when any vet accepts
   - All vets receive `consultation:released` when a consultation is released

5. **Authorization**
   - All vet endpoints require `role: 'vet'` in JWT token
   - Regular users cannot access vet endpoints
   - Vets cannot access consultations they're not assigned to (except queue)

## Example Client Implementation

### React/TypeScript Example

```typescript
import { io, Socket } from 'socket.io-client';

class VetConsultationService {
  private socket: Socket;

  connect(token: string) {
    this.socket = io('http://localhost:3000/consultations', {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to consultation service');
      this.registerAsVet();
    });

    this.socket.on('consultation:incoming', this.handleIncoming);
    this.socket.on('consultation:claimed', this.handleClaimed);
    this.socket.on('consultation:released', this.handleReleased);
    this.socket.on('consultation:completed', this.handleCompleted);
  }

  registerAsVet() {
    this.socket.emit('consultation:register', {
      role: 'veterinarian',
      vetId: 'current-vet-id'
    });
  }

  acceptConsultation(consultationId: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('consultation:accept', 
        { consultationId },
        (response) => {
          if (response.success) {
            resolve(response.consultation);
          } else {
            reject(new Error(response.error));
          }
        }
      );
    });
  }

  releaseConsultation(consultationId: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('consultation:release',
        { consultationId },
        (response) => {
          if (response.success) {
            resolve(true);
          } else {
            reject(new Error(response.error));
          }
        }
      );
    });
  }

  private handleIncoming = (consultation: any) => {
    // Add to queue state
  };

  private handleClaimed = (data: any) => {
    // Remove from queue or update UI
  };

  private handleReleased = (data: any) => {
    // Add back to queue
  };

  private handleCompleted = (data: any) => {
    // Remove from active list
  };

  disconnect() {
    this.socket.disconnect();
  }
}
```

## Testing

### 1. Register a Vet Account
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vet@test.com",
    "password": "VetPass123",
    "firstName": "Dr. Sarah",
    "lastName": "Johnson",
    "role": "vet"
  }'
```

### 2. Login and Get Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vet@test.com",
    "password": "VetPass123"
  }'
```

### 3. Get Queue
```bash
curl -X GET http://localhost:3000/api/v1/consultations/vet/queue \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Accept Consultation
```bash
curl -X POST http://localhost:3000/api/v1/consultations/CONSULTATION_ID/accept \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Environment Variables

No additional environment variables needed. Uses existing:
- `JWT_SECRET` - For JWT token verification
- `MONGODB_URI` - Database connection
- `PORT` - Server port (default: 3000)

## Mobile App Integration

The mobile app should:

1. **Registration Screen**: Add role selector (User/Vet)
2. **Vet Dashboard**: Show three tabs:
   - Queue (pending consultations)
   - Active (assigned consultations)
   - History (completed consultations)
3. **WebSocket Connection**: Connect on vet login, disconnect on logout
4. **Real-Time Updates**: Listen to socket events and update UI accordingly
5. **Accept/Release Actions**: Call REST endpoints or emit socket events

## Troubleshooting

### WebSocket Connection Issues
- Ensure CORS is properly configured
- Check that JWT token is valid and includes role
- Verify WebSocket URL doesn't include `/api/v1` prefix

### 409 Conflict on Accept
- Consultation already assigned to another vet
- Refresh queue to get latest status

### 403 Forbidden
- User role is not 'vet'
- JWT token missing or invalid
- Check token includes `role: 'vet'` in payload

## Next Steps

1. Implement video call integration (Twilio, Agora, etc.)
2. Add chat messaging within consultations
3. Implement prescription generation
4. Add vet ratings and reviews
5. Create vet availability scheduling
6. Add consultation analytics dashboard
