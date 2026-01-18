# Notification System Debugging Guide

## 🔍 Why Notifications Might Not Be Appearing

### ✅ **What's Working**
1. **Database Table**: Notifications table exists with proper schema
2. **Backend Models**: Notification model loads correctly with all methods
3. **Notification Service**: All event trigger methods available
4. **API Routes**: Notification endpoints are properly registered
5. **Frontend Components**: NotificationBell integrated into Header
6. **Context Provider**: NotificationContext wraps the entire app

### 🚨 **Common Issues & Solutions**

## 1. **Database Setup**
**Issue**: Notifications table might not be populated
**Solution**: 
```sql
-- Run this SQL in your MySQL database
USE hotel_management;

-- Check if table exists
SHOW TABLES LIKE 'notifications';

-- If not exists, run the migration
SOURCE database/migrations/001_create_notifications_table.sql;
```

## 2. **Authentication Issues**
**Issue**: API calls might not include auth token
**Solution**: Check browser localStorage:
```javascript
// In browser console
console.log('Auth token:', localStorage.getItem('auth_token'));
console.log('User data:', JSON.parse(localStorage.getItem('user')));
```

## 3. **CORS Issues**
**Issue**: Frontend can't reach backend API
**Solution**: Check server startup logs and ensure CORS is configured

## 4. **Event Triggers Not Firing**
**Issue**: Booking/payment events might not be triggering notifications
**Solution**: Test event triggers manually:
```javascript
// In booking controller - add this debug line
console.log('Creating notification for booking:', booking);
await NotificationService.onBookingCreated(booking, customer.name, room.room_number);
```

## 5. **React State Management**
**Issue**: Context might not be properly initialized
**Solution**: Check if NotificationProvider is wrapped correctly

### 🔧 **Step-by-Step Debugging**

## Step 1: Database Verification
```sql
-- Check if users exist for notifications
SELECT id, name, role FROM users LIMIT 5;

-- Check recent notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
```

## Step 2: Manual Notification Test
Create a test booking or use existing one to trigger notifications:
```bash
# Using curl with valid JWT token
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "customer_id": "existing_customer_id",
    "room_id": "existing_room_id", 
    "check_in_date": "2026-01-18",
    "check_out_date": "2026-01-19"
  }'
```

## Step 3: Check Server Logs
Look for these log messages:
- ✅ MySQL Database Connected Successfully
- 📱 Notification creation logs
- 🔍 Any error messages

## Step 4: Frontend Debugging
Check browser console for:
- NotificationContext fetch logs
- API response errors  
- Network request failures

## 🛠️ **Quick Fixes to Try**

### Fix 1: Add Debug Logging
Add to your booking controller after successful operations:
```javascript
// In createBooking function
console.log('📧 DEBUG: Booking created, triggering notification');
await NotificationService.onBookingCreated(booking, customer.name, room.room_number);
console.log('📧 DEBUG: Notification should have been sent');
```

### Fix 2: Verify User IDs
Make sure notifications are created with valid user IDs:
```javascript
// In notification service
const users = await User.findAll({ role: "receptionist", is_active: true });
console.log('📧 DEBUG: Found users for notifications:', users.length);
```

### Fix 3: Check API Responses
Test notification endpoints directly:
```bash
# Get unread count (replace TOKEN with real JWT)
curl -X GET http://localhost:5000/api/v1/notifications/unread-count \
  -H "Authorization: Bearer TOKEN"
```

## 📊 **Expected Behavior**

### When System Works:
1. **Bell Icon**: Should show red badge with unread count
2. **Click Bell**: Should open dropdown with recent notifications  
3. **New Booking**: Should create notification for receptionists/managers
4. **Check-in/Check-out**: Should notify relevant staff immediately
5. **Real-time Updates**: Bell count should update without page refresh

### Log Output to Look For:
```
✅ MySQL Database Connected Successfully
📧 DEBUG: Booking created, triggering notification
📱 NotificationService.onBookingCreated called
🔔 Notification created successfully
📡 NotificationContext: Fetching notifications...
📡 NotificationContext: Notifications response: {...}
📢 NotificationBell: Rendering with state: {...}
```

## 🚨 **Troubleshooting Checklist**

- [ ] Database table exists and is accessible
- [ ] Server starts without errors
- [ ] JWT authentication is working
- [ ] API endpoints are accessible (test with curl)
- [ ] Frontend can fetch notifications
- [ ] Event triggers are being called
- [ ] Browser console shows no JavaScript errors
- [ ] Network tab shows successful API calls

## 🔗 **Helpful Commands**

```bash
# Check database tables
mysql -u root -p -e "USE hotel_management; SHOW TABLES;"

# Start server with debug logs
DEBUG=hms:* node src/app.js

# Test API endpoint
curl http://localhost:5000/api/v1/notifications/unread-count

# Check node_modules
ls node_modules/mysql2 package.json

# Rebuild frontend
npm run build
```

Follow these steps systematically to identify and fix the notification system issues.