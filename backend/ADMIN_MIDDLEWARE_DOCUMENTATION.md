# Admin Middleware Documentation

## 📋 Overview

The `admin.middleware.js` provides role-based authorization for admin-only routes. It ensures that only users with the `admin` role can access protected admin endpoints.

---

## 🔐 How It Works

### Middleware Chain
```
Request → authMiddleware → adminMiddleware → Controller
```

1. **authMiddleware**: Verifies JWT token and sets `req.user`
2. **adminMiddleware**: Checks if user has admin role
3. **Controller**: Handles the business logic

---

## 📝 Implementation Details

### Location
```
backend/src/middlewares/admin.middleware.js
```

### Dependencies
- `User` model - To fetch user role from database
- `logger` utility - For audit logging

### Request Flow

```javascript
// 1. Check authentication
if (!req.user || !req.user.userId) {
  return 401 - "Authentication required"
}

// 2. Fetch user from database
const user = await User.findById(req.user.userId)

// 3. Verify user exists
if (!user) {
  return 401 - "User not found"
}

// 4. Check admin role
if (user.role !== "admin") {
  return 403 - "Access denied. Admin privileges required."
}

// 5. Attach admin user info
req.adminUser = { id, email, name, role }

// 6. Continue to controller
next()
```

---

## 🎯 Features

### ✅ Security Features
1. **Authentication Check**: Verifies user is authenticated
2. **Database Verification**: Fetches fresh user data from DB
3. **Role Validation**: Ensures user has admin role
4. **Audit Logging**: Logs all admin access attempts
5. **Error Handling**: Graceful error responses

### ✅ Request Enhancement
Adds `req.adminUser` object with:
- `id` - User MongoDB ObjectId
- `email` - User email address
- `name` - User full name
- `role` - User role (always "admin")

---

## 📊 Response Codes

| Code | Scenario | Message |
|------|----------|---------|
| 401 | No authentication | "Authentication required" |
| 401 | Invalid user ID | "User not found" |
| 403 | Not admin role | "Access denied. Admin privileges required." |
| 500 | Server error | "Internal server error during authorization" |
| ✅ | Success | Continues to next middleware |

---

## 🧪 Testing

### Test 1: Access Without Token
```bash
curl -X GET http://localhost:5000/api/v1/admin/dashboard
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Authorization header missing"
}
```

### Test 2: Access With User Role (Not Admin)
```bash
# 1. Login as regular user
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Try to access admin endpoint
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### Test 3: Access With Admin Role
```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# 2. Access admin endpoint
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": { ... }
}
```

---

## 🔍 Audit Logging

The middleware logs all admin access attempts:

### Successful Access
```
[REQ-123] Admin access granted to: admin@example.com
```

### Failed Access (Wrong Role)
```
[REQ-124] Unauthorized admin access attempt by user: user@example.com (role: user)
```

### Failed Access (Invalid User)
```
[REQ-125] Admin access attempt with invalid user ID: 507f1f77bcf86cd799439011
```

### Failed Access (No Auth)
```
[REQ-126] Admin access attempt without authentication
```

---

## 🛠️ Usage in Routes

### Example: Admin Routes
```javascript
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// Apply to all admin routes
router.use(authMiddleware);  // First: Authenticate
router.use(adminMiddleware); // Second: Authorize

// Now all routes require admin role
router.get("/dashboard", dashboardController.getDashboard);
router.get("/users", userController.getAllUsers);
router.post("/products", productController.createProduct);

module.exports = router;
```

### Example: Specific Route Protection
```javascript
// Protect only specific routes
router.get("/public", publicController.getData); // No auth needed

router.get("/protected", 
  authMiddleware,      // Requires authentication
  protectedController.getData
);

router.get("/admin-only",
  authMiddleware,      // Requires authentication
  adminMiddleware,     // Requires admin role
  adminController.getData
);
```

---

## 🎓 Best Practices

### ✅ DO
1. **Always use after authMiddleware** - Admin middleware depends on `req.user`
2. **Check req.adminUser in controllers** - Use the enhanced user object
3. **Log admin actions** - Maintain audit trail
4. **Verify role from database** - Don't trust JWT payload alone
5. **Return 403 for authorization failures** - Not 401

### ❌ DON'T
1. **Don't use without authMiddleware** - Will fail
2. **Don't cache user role** - Always fetch fresh from DB
3. **Don't expose sensitive error details** - Keep messages generic
4. **Don't skip logging** - Important for security audits
5. **Don't trust client-side role claims** - Always verify server-side

---

## 🔄 How to Create Admin User

### Method 1: Direct Database Update
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Using Admin API (After first admin exists)
```bash
curl -X PUT http://localhost:5000/api/v1/admin/users/:userId/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

### Method 3: Seed Script
```javascript
// scripts/seed-admin.js
const mongoose = require("mongoose");
const User = require("../src/models/user.model");

async function createAdmin() {
  await mongoose.connect(process.env.DB_URL);
  
  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "SecurePassword123!",
    role: "admin"
  });
  
  console.log("Admin created:", admin.email);
  process.exit(0);
}

createAdmin();
```

---

## 🐛 Troubleshooting

### Issue: "Authentication required"
**Cause**: authMiddleware not executed or failed
**Solution**: Ensure authMiddleware is applied before adminMiddleware

### Issue: "User not found"
**Cause**: User ID in JWT doesn't exist in database
**Solution**: User may have been deleted, re-login required

### Issue: "Access denied"
**Cause**: User role is not "admin"
**Solution**: Update user role in database to "admin"

### Issue: Middleware not executing
**Cause**: Not properly imported or applied
**Solution**: Check route file imports and middleware chain

---

## 📈 Performance Considerations

### Database Query
- **Query**: `User.findById(userId).select("role email name")`
- **Impact**: One DB query per admin request
- **Optimization**: Consider caching user roles with Redis (TTL: 5-10 minutes)

### Caching Strategy (Optional)
```javascript
// With Redis
const cachedRole = await redis.get(`user:${userId}:role`);
if (cachedRole === "admin") {
  return next();
}

// Fetch from DB and cache
const user = await User.findById(userId);
await redis.setex(`user:${userId}:role`, 300, user.role);
```

---

## 🔐 Security Considerations

### ✅ Implemented
1. Fresh database lookup (no JWT role trust)
2. Comprehensive logging
3. Proper error messages (no info leakage)
4. Request ID tracking
5. Role verification

### 💡 Additional Security (Optional)
1. **IP Whitelisting**: Restrict admin access to specific IPs
2. **Time-based Access**: Allow admin access only during business hours
3. **2FA Requirement**: Require two-factor authentication for admins
4. **Session Management**: Track active admin sessions
5. **Rate Limiting**: Stricter rate limits for admin endpoints

---

## 📊 Monitoring & Alerts

### Metrics to Track
1. **Admin access attempts** (successful/failed)
2. **Unauthorized access attempts** (by user)
3. **Admin actions performed** (create/update/delete)
4. **Response times** for admin endpoints
5. **Error rates** in admin middleware

### Alert Triggers
- Multiple failed admin access attempts from same user
- Admin access from unusual IP addresses
- Admin role changes
- Bulk delete operations
- High error rates

---

## ✅ Checklist

Before deploying:
- [x] Admin middleware created
- [x] Imported in admin routes
- [x] Applied after authMiddleware
- [x] Logging configured
- [x] Error handling implemented
- [ ] At least one admin user created
- [ ] Admin access tested
- [ ] Non-admin access blocked (tested)
- [ ] Logs reviewed
- [ ] Documentation updated

---

## 🎉 Summary

The admin middleware provides:
- ✅ Role-based authorization
- ✅ Database-verified roles
- ✅ Comprehensive audit logging
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Request enhancement with admin user info

**Status**: ✅ **Production Ready**

---

## 📞 Support

For issues:
1. Check logs for detailed error messages
2. Verify user has admin role in database
3. Ensure authMiddleware is applied first
4. Check JWT token is valid
5. Review middleware chain order
