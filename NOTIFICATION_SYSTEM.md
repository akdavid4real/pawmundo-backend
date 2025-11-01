# 🔔 Pet-Specific Notification System

## Overview
Implemented a comprehensive notification system that allows users to receive notifications for specific pets and event types. Users can customize notification preferences per pet with granular control over different notification categories.

---

## Backend Implementation

### 1. Database Schema

#### Notification Schema (`src/modules/notifications/schemas/notification.schema.ts`)
```typescript
- userId: ObjectId (ref: User)
- petId: ObjectId (ref: Pet) - Optional, for pet-specific notifications
- title: string
- message: string
- type: enum ['appointment', 'medication', 'vaccination', 'checkup', 'weight', 'health_alert', 'reminder', 'info']
- isRead: boolean
- actionUrl: string - Optional, for navigation
- metadata: Object - Additional data
- isActive: boolean
- timestamps: createdAt, updatedAt
```

#### Notification Preference Schema (`src/modules/notifications/schemas/notification-preference.schema.ts`)
```typescript
- userId: ObjectId (ref: User, unique)
- globalEnabled: boolean - Master toggle for all notifications
- petSettings: Record<petId, {
    appointments: boolean
    medications: boolean
    vaccinations: boolean
    checkups: boolean
    healthAlerts: boolean
    weightChanges: boolean
  }>
- emailNotifications: boolean
- pushNotifications: boolean
- reminderHoursBefore: number (default: 24)
- timestamps: createdAt, updatedAt
```

### 2. API Endpoints

#### Notifications Controller (`src/modules/notifications/notifications.controller.ts`)

**GET /api/v1/notifications**
- Get all notifications for authenticated user
- Optional query param: `petId` to filter by specific pet
- Returns: Array of notifications

**GET /api/v1/notifications/unread-count**
- Get count of unread notifications
- Returns: `{ count: number }`

**PATCH /api/v1/notifications/:id/read**
- Mark specific notification as read
- Returns: Updated notification

**PATCH /api/v1/notifications/read-all**
- Mark all user notifications as read
- Returns: `{ success: true }`

**GET /api/v1/notifications/preferences**
- Get user's notification preferences
- Returns: NotificationPreference object

**PATCH /api/v1/notifications/preferences**
- Update notification preferences
- Body: `UpdatePreferenceDto`
- Returns: Updated preferences

### 3. Service Layer

#### Notifications Service (`src/modules/notifications/notifications.service.ts`)

**Key Methods:**
- `create(createDto)` - Create notification with preference checking
- `findAllByUser(userId, petId?)` - Get user notifications with optional pet filter
- `markAsRead(notificationId, userId)` - Mark notification as read
- `markAllAsRead(userId)` - Mark all as read
- `getUnreadCount(userId)` - Get unread count
- `getPreferences(userId)` - Get or create user preferences
- `updatePreferences(userId, updateDto)` - Update preferences
- `shouldSendNotification(userId, petId, type)` - Check if notification should be sent
- `notifyAppointment(userId, petId, date, vetName)` - Send appointment notification
- `notifyMedication(userId, petId, medicationName)` - Send medication reminder
- `notifyVaccination(userId, petId, vaccineName, dueDate)` - Send vaccination reminder

### 4. DTOs

#### CreateNotificationDto
```typescript
- userId: string (MongoId)
- petId?: string (MongoId, optional)
- title: string
- message: string
- type: enum
- actionUrl?: string
- metadata?: Record<string, any>
```

#### UpdatePreferenceDto
```typescript
- globalEnabled?: boolean
- petId?: string
- petSettings?: PetNotificationSettingsDto
- emailNotifications?: boolean
- pushNotifications?: boolean
- reminderHoursBefore?: number
```

---

## Frontend Implementation

### 1. Redux State Management

#### Notifications Slice (`src/modules/notifications/reduxSlice/index.ts`)

**State:**
```typescript
{
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences | null
  isLoading: boolean
  error: string | null
}
```

**Actions:**
- `fetchNotificationsStart/Success/Failure`
- `addNotification`
- `markAsRead`
- `markAllAsRead`
- `setPreferences`
- `updatePetPreference`

### 2. Services

#### Notifications Service (`src/modules/notifications/services/notifications.service.ts`)

**API Methods:**
- `getNotifications(petId?)` - Fetch notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(notificationId)` - Mark as read
- `markAllAsRead()` - Mark all as read
- `getPreferences()` - Get preferences
- `updatePreferences(preferences)` - Update preferences

**Authentication:**
- Automatically includes JWT token from `localStorage.getItem('access_token')`
- All requests include `Authorization: Bearer <token>` header

### 3. UI Components

#### NotificationsPage (`src/modules/notifications/pages/NotificationsPage.tsx`)

**Features:**
- Display notifications grouped by read/unread status
- Click notification to mark as read and navigate to actionUrl
- "Mark all as read" button
- "Settings" button to access preferences
- Dynamic icons based on notification type
- Timestamp display

**Notification Types & Icons:**
- `appointment` - Calendar icon (blue)
- `medication` - Medical kit icon (green)
- `vaccination` - Fitness icon (purple)
- `checkup` - Medical kit icon (teal)
- `weight` - Fitness icon (orange)
- `health_alert` - Warning icon (red)
- `reminder` - Bell icon (yellow)
- `info` - Information icon (indigo)

#### NotificationPreferencesPage (`src/modules/notifications/pages/NotificationPreferencesPage.tsx`)

**Features:**
- Global notification settings
  - Enable/disable all notifications
  - Email notifications toggle
  - Push notifications toggle
  - Reminder hours before event (1, 6, 12, 24, 48 hours)
- Pet-specific settings
  - Dropdown to select pet
  - Individual toggles for each notification type per pet
  - Auto-loads first pet by default
  - Shows pet avatar, name, species, and breed
- Save button with success animation
- Loads saved preferences on mount
- Scrollable interface

### 4. Integration

#### Dashboard Header (`src/modules/dashboard/components/Header/header.tsx`)
- Displays unread notification count badge
- Fetches notifications on mount
- Updates Redux store with notification data
- Click to navigate to notifications page

---

## Key Features

### 1. Pet-Specific Notifications
- Each notification can be linked to a specific pet
- Users can filter notifications by pet
- Preferences are stored per pet

### 2. Granular Control
- 6 notification categories per pet:
  - Appointments
  - Medications
  - Vaccinations
  - Checkups
  - Health Alerts
  - Weight Changes

### 3. Smart Filtering
- Backend checks preferences before sending notifications
- Only sends notifications if:
  - Global notifications are enabled
  - Pet-specific setting is enabled (if applicable)
  - Notification type is enabled for that pet

### 4. User Experience
- Clean, intuitive UI with Ionic components
- Visual feedback on save
- Persistent preferences across sessions
- Real-time unread count updates

### 5. Scalability
- Indexed database queries for performance
- Efficient preference checking
- Support for multiple pets per user
- Extensible notification types

---

## Database Indexes

```typescript
// Notification Schema
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, petId: 1, type: 1 })
```

---

## Authentication Flow

1. User logs in → JWT token stored in `localStorage.getItem('access_token')`
2. All API requests include token in Authorization header
3. Backend validates token using JwtAuthGuard
4. JWT strategy returns `{ userId, email, role }`
5. Controllers use `req.user.userId` to identify user

---

## Future Enhancements

- [ ] Push notifications using Firebase Cloud Messaging
- [ ] Email notifications with templates
- [ ] SMS notifications
- [ ] Notification scheduling/batching
- [ ] Notification history/archive
- [ ] Custom notification sounds
- [ ] Notification priority levels
- [ ] Bulk notification management
- [ ] Notification analytics

---

## Testing

### Backend Testing
```bash
# Test notification creation
curl -X POST http://localhost:3001/api/v1/notifications \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "...",
    "petId": "...",
    "title": "Test Notification",
    "message": "This is a test",
    "type": "info"
  }'

# Test preferences update
curl -X PATCH http://localhost:3001/api/v1/notifications/preferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "petId": "...",
    "petSettings": {
      "appointments": false,
      "medications": true
    }
  }'
```

### Frontend Testing
1. Login to the app
2. Navigate to notifications page
3. Click "Settings" button
4. Select a pet from dropdown
5. Toggle notification preferences
6. Click "Save Preferences"
7. Verify "✓ Saved!" message appears
8. Navigate back and return to verify persistence

---

## Troubleshooting

### Issue: Notifications not showing
- Check if user is authenticated
- Verify JWT token in localStorage
- Check backend logs for errors
- Ensure notifications exist in database

### Issue: Preferences not saving
- Check network tab for API errors
- Verify Authorization header is present
- Check backend logs for validation errors
- Ensure petId is valid

### Issue: Unread count not updating
- Verify Redux store is properly configured
- Check if notifications reducer is registered
- Ensure fetchNotificationsSuccess action is dispatched

---

## Files Modified/Created

### Backend
- ✅ `src/modules/notifications/notifications.module.ts`
- ✅ `src/modules/notifications/notifications.controller.ts`
- ✅ `src/modules/notifications/notifications.service.ts`
- ✅ `src/modules/notifications/schemas/notification.schema.ts`
- ✅ `src/modules/notifications/schemas/notification-preference.schema.ts`
- ✅ `src/modules/notifications/dto/create-notification.dto.ts`
- ✅ `src/modules/notifications/dto/update-preference.dto.ts`
- ✅ `src/modules/auth/strategies/jwt.strategy.ts` (Updated)
- ✅ `src/modules/pets/pets.controller.ts` (Updated)
- ✅ `src/modules/user/user.controller.ts` (Updated)

### Frontend
- ✅ `src/modules/notifications/reduxSlice/index.ts` (Updated)
- ✅ `src/modules/notifications/pages/NotificationsPage.tsx` (Updated)
- ✅ `src/modules/notifications/pages/NotificationPreferencesPage.tsx` (Created)
- ✅ `src/modules/notifications/services/notifications.service.ts` (Created)
- ✅ `src/modules/notifications/pages/index.ts` (Updated)
- ✅ `src/layouts/RootLayout.tsx` (Updated)
- ✅ `src/layouts/PetLayout/pet.layout.tsx` (Updated)
- ✅ `src/layouts/routes.ts` (Updated)
- ✅ `src/redux/index.ts` (Updated)
- ✅ `src/modules/shared/config/api.config.ts` (Updated)
- ✅ `src/modules/dashboard/components/Header/header.tsx` (Updated)

---

## Summary

Successfully implemented a complete pet-specific notification system with:
- ✅ Backend API with MongoDB schemas
- ✅ Granular per-pet notification preferences
- ✅ Frontend UI with Redux state management
- ✅ Real-time unread count tracking
- ✅ Persistent preferences across sessions
- ✅ Clean, intuitive user interface
- ✅ Proper authentication and authorization
- ✅ Scalable and maintainable architecture
