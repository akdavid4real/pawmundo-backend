# 🔔 Notification & Reminder System - Technical Documentation

## Overview
The PawPromise notification and reminder system provides real-time notifications for pet health events, appointments, medications, and vaccinations. It includes both immediate notifications and scheduled health reminders.

## System Architecture

### Core Components
1. **Notifications Module** - Handles real-time notifications
2. **Health Reminders Module** - Manages scheduled health reminders
3. **Notification Preferences** - User-configurable settings per pet

---

## API Endpoints

### Notifications API (`/api/v1/notifications`)

#### GET `/notifications`
**Purpose**: Fetch user notifications with optional pet filtering
```typescript
// Request
GET /api/v1/notifications?petId=optional_pet_id
Headers: { Authorization: "Bearer <jwt_token>" }

// Response
[
  {
    "_id": "notification_id",
    "userId": "user_id",
    "petId": "pet_id", // optional
    "title": "Medication Reminder",
    "message": "Time to give Fluoxetine to Max",
    "type": "medication", // enum: appointment|medication|vaccination|checkup|weight|health_alert|reminder|info
    "isRead": false,
    "actionUrl": "/pets/pet_id/medications", // optional
    "metadata": {}, // optional additional data
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### GET `/notifications/unread-count`
**Purpose**: Get count of unread notifications
```typescript
// Response
{ "count": 5 }
```

#### PATCH `/notifications/:id/read`
**Purpose**: Mark specific notification as read
```typescript
// Response
{ "_id": "notification_id", "isRead": true, ... }
```

#### PATCH `/notifications/read-all`
**Purpose**: Mark all user notifications as read
```typescript
// Response
{ "success": true }
```

### Notification Preferences API

#### GET `/notifications/preferences`
**Purpose**: Get user notification preferences
```typescript
// Response
{
  "userId": "user_id",
  "globalEnabled": true,
  "emailNotifications": true,
  "pushNotifications": true,
  "reminderHoursBefore": 24,
  "petSettings": {
    "pet_id_1": {
      "appointments": true,
      "medications": true,
      "vaccinations": true,
      "checkups": true,
      "healthAlerts": true,
      "weightChanges": false
    }
  }
}
```

#### PATCH `/notifications/preferences`
**Purpose**: Update notification preferences
```typescript
// Request Body
{
  "globalEnabled": true, // optional
  "petId": "pet_id", // required when updating pet settings
  "petSettings": { // optional
    "appointments": false,
    "medications": true,
    "vaccinations": true,
    "checkups": true,
    "healthAlerts": true,
    "weightChanges": false
  },
  "emailNotifications": true, // optional
  "pushNotifications": true, // optional
  "reminderHoursBefore": 48 // optional: 1|6|12|24|48 hours
}
```

### Health Reminders API (`/api/v1/health-reminders`)

#### GET `/health-reminders`
**Purpose**: Get upcoming and overdue health reminders
```typescript
// Response
{
  "upcoming": [
    {
      "id": "reminder_id",
      "petName": "Max",
      "type": "vaccination",
      "title": "DHPP Annual",
      "dueDate": "2024-02-15T00:00:00Z",
      "daysUntilDue": 15
    }
  ],
  "overdue": [
    {
      "id": "reminder_id",
      "petName": "Bella",
      "type": "checkup",
      "title": "Annual Checkup",
      "dueDate": "2024-01-01T00:00:00Z",
      "daysOverdue": 14
    }
  ]
}
```

#### POST `/health-reminders/pet/:petId/vaccinations`
**Purpose**: Create vaccination schedule reminders for a pet
```typescript
// Response: Array of created reminder records
```

---

## Data Models

### Notification Schema
```typescript
interface Notification {
  _id: string;
  userId: string;
  petId?: string; // optional for pet-specific notifications
  title: string;
  message: string;
  type: 'appointment' | 'medication' | 'vaccination' | 'checkup' | 'weight' | 'health_alert' | 'reminder' | 'info';
  isRead: boolean;
  actionUrl?: string; // navigation URL
  metadata?: Record<string, any>; // additional data
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Notification Preferences Schema
```typescript
interface NotificationPreference {
  _id: string;
  userId: string;
  globalEnabled: boolean; // master toggle
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderHoursBefore: number; // 1|6|12|24|48
  petSettings: Record<string, {
    appointments: boolean;
    medications: boolean;
    vaccinations: boolean;
    checkups: boolean;
    healthAlerts: boolean;
    weightChanges: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Frontend Integration

### Authentication
All API calls require JWT authentication:
```typescript
const token = localStorage.getItem('access_token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Notification Service Example
```typescript
class NotificationService {
  private baseUrl = 'http://localhost:3001/api/v1';
  
  async getNotifications(petId?: string) {
    const url = petId ? `${this.baseUrl}/notifications?petId=${petId}` : `${this.baseUrl}/notifications`;
    const response = await fetch(url, { headers: this.getHeaders() });
    return response.json();
  }
  
  async getUnreadCount() {
    const response = await fetch(`${this.baseUrl}/notifications/unread-count`, { 
      headers: this.getHeaders() 
    });
    return response.json();
  }
  
  async markAsRead(notificationId: string) {
    const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    return response.json();
  }
  
  async updatePreferences(preferences: UpdatePreferenceDto) {
    const response = await fetch(`${this.baseUrl}/notifications/preferences`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(preferences)
    });
    return response.json();
  }
  
  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}
```

---

## Notification Types & UI Guidelines

### Notification Type Mapping
```typescript
const notificationConfig = {
  appointment: { icon: 'calendar', color: 'blue', priority: 'high' },
  medication: { icon: 'medical', color: 'green', priority: 'high' },
  vaccination: { icon: 'fitness', color: 'purple', priority: 'medium' },
  checkup: { icon: 'medical', color: 'teal', priority: 'medium' },
  weight: { icon: 'fitness', color: 'orange', priority: 'low' },
  health_alert: { icon: 'warning', color: 'red', priority: 'critical' },
  reminder: { icon: 'notifications', color: 'yellow', priority: 'medium' },
  info: { icon: 'information', color: 'indigo', priority: 'low' }
};
```

### State Management (Redux Example)
```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference | null;
  isLoading: boolean;
  error: string | null;
}

// Actions
const notificationSlice = {
  fetchNotifications: (petId?: string) => {},
  markAsRead: (notificationId: string) => {},
  markAllAsRead: () => {},
  updatePreferences: (preferences: UpdatePreferenceDto) => {},
  setUnreadCount: (count: number) => {}
};
```

---

## Health Reminder System

### Automatic Vaccination Scheduling
The system automatically creates vaccination reminders based on pet species and birth date:

**Dogs**: DHPP series (6, 9, 12 weeks), Rabies (16 weeks), Annual boosters
**Cats**: FVRCP series (6, 9, 12 weeks), Rabies (16 weeks), Annual boosters

### Cron Jobs
- Daily reminder check at 9 AM
- Sends notifications for upcoming/overdue health events
- Integrates with notification preferences

---

## Error Handling

### Common Error Responses
```typescript
// 401 Unauthorized
{ "statusCode": 401, "message": "Unauthorized" }

// 404 Not Found
{ "statusCode": 404, "message": "Notification not found" }

// 400 Bad Request
{ "statusCode": 400, "message": "Invalid petId format" }
```

### Frontend Error Handling
```typescript
try {
  const notifications = await notificationService.getNotifications();
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else {
    // Show error message
  }
}
```

---

## Performance Considerations

### Database Indexes
- `{ userId: 1, isRead: 1, createdAt: -1 }` - Optimized for user notification queries
- `{ userId: 1, petId: 1, type: 1 }` - Pet-specific filtering

### Pagination
- Notifications limited to 50 most recent per request
- Implement infinite scroll for better UX

### Caching
- Cache unread count in Redis for performance
- Cache user preferences to reduce database calls

---

## Testing Endpoints

### Create Test Notification
```bash
curl -X POST http://localhost:3001/api/v1/notifications \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "petId": "pet_id",
    "title": "Test Notification",
    "message": "This is a test notification",
    "type": "info"
  }'
```

### Update Preferences
```bash
curl -X PATCH http://localhost:3001/api/v1/notifications/preferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "petId": "pet_id",
    "petSettings": {
      "appointments": false,
      "medications": true
    }
  }'
```

---

## Implementation Checklist

### Backend ✅
- [x] Notification CRUD operations
- [x] Preference management
- [x] Health reminder scheduling
- [x] JWT authentication
- [x] Database schemas and indexes

### Frontend Requirements
- [ ] Notification list component
- [ ] Unread count badge
- [ ] Preference settings page
- [ ] Real-time updates (WebSocket/polling)
- [ ] Push notification setup
- [ ] Error handling and loading states

---

## Next Steps for Frontend

1. **Create notification components** using the provided API endpoints
2. **Implement state management** for notifications and preferences
3. **Add real-time updates** using WebSocket or polling
4. **Setup push notifications** using Firebase Cloud Messaging
5. **Add notification sounds** and visual indicators
6. **Implement offline support** with local storage fallback
