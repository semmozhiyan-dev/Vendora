# Admin Dashboard - Backend Connection Summary

## ✅ Backend Connection Status: CONNECTED

### API Endpoint
- **URL**: `GET /api/v1/admin/dashboard`
- **Authentication**: Required (Bearer Token)
- **Authorization**: Admin role required

### Backend Structure

#### 1. Route Registration
- File: `/backend/src/app.js`
- Route: `/api/v1/admin` → `admin.routes.js`

#### 2. Admin Routes
- File: `/backend/src/modules/admin/routes/admin.routes.js`
- Middleware: `authMiddleware` + `adminMiddleware`
- Dashboard Route: `GET /dashboard` → `dashboardController.getDashboard`

#### 3. Controller
- File: `/backend/src/modules/admin/controllers/admin.dashboard.controller.js`
- Function: `getDashboard()`
- Calls: `adminService.getDashboardStats()`

#### 4. Service
- File: `/backend/src/modules/admin/services/admin.service.js`
- Function: `getDashboardStats()`
- Returns:
  ```javascript
  {
    totalUsers: Number,
    totalProducts: Number,
    totalOrders: Number,
    totalRevenue: Number,
    recentOrders: Array[5]
  }
  ```

### Response Format

```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalUsers": 150,
    "totalProducts": 45,
    "totalOrders": 320,
    "totalRevenue": 45678.50,
    "recentOrders": [
      {
        "_id": "order_id",
        "user": { "name": "John Doe", "email": "john@example.com" },
        "totalAmount": 299.99,
        "status": "delivered",
        "createdAt": "2024-01-15T10:30:00Z",
        "items": [...]
      }
    ]
  }
}
```

### Frontend Integration

#### 1. API Configuration
- File: `/frontend/src/api/axios.js`
- Base URL: `http://localhost:5000/api/v1`
- Auto-attaches JWT token from localStorage

#### 2. Dashboard Component
- File: `/frontend/src/pages/admin/Dashboard.jsx`
- Fetches data on mount
- Handles loading, error, and success states
- Displays 4 stat cards + recent orders table

#### 3. Admin Layout
- File: `/frontend/src/layouts/AdminLayout.jsx`
- Fixed sidebar with navigation
- Active route highlighting
- User profile + logout

### Authentication Flow

1. User logs in → receives JWT token
2. Token stored in localStorage
3. Axios interceptor adds token to all requests
4. Backend validates token with `authMiddleware`
5. Backend checks admin role with `adminMiddleware`
6. Dashboard data returned if authorized

### Data Flow

```
Frontend Dashboard Component
    ↓
API.get('/admin/dashboard')
    ↓
Axios Interceptor (adds Bearer token)
    ↓
Backend: authMiddleware (validates token)
    ↓
Backend: adminMiddleware (checks admin role)
    ↓
admin.routes.js → dashboardController.getDashboard()
    ↓
adminService.getDashboardStats()
    ↓
MongoDB queries (Users, Products, Orders)
    ↓
Response sent back to frontend
    ↓
Dashboard renders with data
```

### Testing the Connection

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login as Admin**:
   - Navigate to `/login`
   - Use admin credentials
   - Should redirect to `/admin/dashboard`

4. **Verify Dashboard**:
   - Check if stat cards show data
   - Check if recent orders table populates
   - Check browser console for any errors

### Troubleshooting

**If dashboard shows loading forever:**
- Check backend is running on port 5000
- Check MongoDB connection
- Check browser console for CORS errors

**If you get 401 Unauthorized:**
- Token might be expired or invalid
- Try logging out and logging in again

**If you get 403 Forbidden:**
- User doesn't have admin role
- Check user role in database

**If you get 500 Server Error:**
- Check backend logs
- Verify MongoDB is running
- Check database connection

### Next Steps

✅ Dashboard page - COMPLETE
✅ AdminLayout with sidebar - COMPLETE
✅ Backend connection - COMPLETE

**TODO:**
- Products page
- Orders page
- Users page
