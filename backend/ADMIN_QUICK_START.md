# Admin Module Quick Start Guide

## 🚀 Setup

### 1. Database
Ensure you have the following models created:
- ✅ User (with role field: "user" | "admin")
- ✅ Product
- ✅ Order

### 2. Required Middleware
- ✅ `auth.middleware.js` - Authentication
- ✅ `admin.middleware.js` - Authorization
- ✅ `requestId.middleware.js` - Request tracking
- ✅ `logger.middleware.js` - Logging
- ✅ `timeout.middleware.js` - Request timeout

### 3. Environment Variables
```bash
# .env
JWT_SECRET=your_secret_here
REQUEST_TIMEOUT_MS=10000
```

---

## 📌 Integration Steps

### Step 1: Start Server
```bash
cd backend
npm run dev
```

### Step 2: Get Admin Access
You need a user with role `"admin"`:

```bash
# Login as regular user first
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get token, then ask another admin to upgrade your role:
PUT /api/v1/admin/users/:your-id/role
Authorization: Bearer <admin_token>
{
  "role": "admin"
}
```

Or directly update user in MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
);
```

### Step 3: Test Endpoints
Use Postman to test:

**1. Get Dashboard**
```
GET http://localhost:5000/api/v1/admin/dashboard
Authorization: Bearer <your_token>
```

**2. Create Product**
```
POST http://localhost:5000/api/v1/admin/products
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Test Product",
  "description": "A test product",
  "price": 99.99,
  "stock": 50,
  "category": "Electronics"
}
```

**3. Get Products**
```
GET http://localhost:5000/api/v1/admin/products?page=1&limit=10
Authorization: Bearer <your_token>
```

---

## 🧪 Common Test Cases

### Test Case 1: Unauthorized Access
```bash
# Without token
GET http://localhost:5000/api/v1/admin/dashboard

# Expected: 401 Unauthorized
{
  "success": false,
  "message": "Authorization header missing"
}
```

### Test Case 2: Non-Admin User
```bash
# User with role: "user"
GET http://localhost:5000/api/v1/admin/dashboard
Authorization: Bearer <user_token>

# Expected: 403 Forbidden
{
  "success": false,
  "message": "Admin access required"
}
```

### Test Case 3: Create Product
```bash
POST http://localhost:5000/api/v1/admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "stock": 20,
  "category": "Electronics",
  "image": "https://example.com/laptop.jpg"
}

# Expected: 201 Created
```

### Test Case 4: Update Order Status
```bash
# First, get an order ID from GET /orders
PUT http://localhost:5000/api/v1/admin/orders/:order-id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "SHIPPED"
}

# Expected: 200 OK with updated order
```

### Test Case 5: Prevent Self-Deletion
```bash
# Try to delete yourself
DELETE http://localhost:5000/api/v1/admin/users/:your-id
Authorization: Bearer <your_admin_token>

# Expected: 403 Forbidden
{
  "success": false,
  "message": "Cannot delete your own account"
}
```

---

## 📊 API Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **PRODUCTS** | | |
| POST | `/admin/products` | Create product |
| GET | `/admin/products` | List products |
| PUT | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |
| **ORDERS** | | |
| GET | `/admin/orders` | List orders |
| GET | `/admin/orders/:id` | Get order details |
| PUT | `/admin/orders/:id/status` | Update status |
| **USERS** | | |
| GET | `/admin/users` | List users |
| PUT | `/admin/users/:id/role` | Update role |
| DELETE | `/admin/users/:id` | Delete user |
| **DASHBOARD** | | |
| GET | `/admin/dashboard` | Get stats |

---

## 🐛 Troubleshooting

### Issue: 404 Admin Routes Not Found
**Solution**: Ensure admin routes are imported in `src/app.js`:
```javascript
const adminRoutes = require("./modules/admin/routes/admin.routes");
app.use("/api/v1/admin", adminRoutes);
```

### Issue: 403 Admin Access Required
**Solution**: Make sure user has `role: "admin"` in database:
```javascript
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { role: "admin" } }
);
```

### Issue: Validation Errors
**Solution**: Check error details in response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "price": "Valid product price is required"
  }
}
```

### Issue: Status Transition Not Allowed
**Solution**: Check order status flow:
```
PENDING → PAID, CANCELLED
PAID → SHIPPED, CANCELLED
SHIPPED → DELIVERED, CANCELLED
DELIVERED, CANCELLED → (no transitions)
```

---

## 📚 File Structure

```
src/
├── models/
│   ├── user.model.js          ← Has role field
│   ├── product.model.js       ← NEW
│   └── order.model.js         ← NEW
├── middlewares/
│   ├── auth.middleware.js     ← Verify JWT
│   ├── admin.middleware.js    ← Check admin role
│   ├── requestId.middleware.js
│   ├── logger.middleware.js
│   └── timeout.middleware.js
├── modules/
│   └── admin/                 ← NEW MODULE
│       ├── controllers/
│       │   ├── admin.product.controller.js
│       │   ├── admin.order.controller.js
│       │   ├── admin.user.controller.js
│       │   └── admin.dashboard.controller.js
│       ├── routes/
│       │   └── admin.routes.js
│       ├── services/
│       │   └── admin.service.js
│       └── validations/
│           └── admin.validation.js
└── app.js                     ← Updated with admin routes
```

---

## ✅ Checklist

Before using admin module:
- [ ] User model has `role` field
- [ ] Product and Order models exist
- [ ] Auth middleware is working
- [ ] Admin middleware is created
- [ ] All required middleware in app.js
- [ ] At least one user with `role: "admin"`
- [ ] .env has JWT_SECRET and REQUEST_TIMEOUT_MS
- [ ] Admin routes imported in app.js

---

## 🔗 Related Documentation

- [ADMIN_MODULE_DOCUMENTATION.md](ADMIN_MODULE_DOCUMENTATION.md) - Full API reference
- [TESTING_TIMEOUT_AND_SHUTDOWN.md](TESTING_TIMEOUT_AND_SHUTDOWN.md) - Middleware testing

---

## 💡 Tips

1. **Create test admin user** for development:
   ```javascript
   db.users.insertOne({
     name: "Admin User",
     email: "admin@test.com",
     password: "hashed_password",
     role: "admin"
   });
   ```

2. **Use Postman collections** for organized testing
3. **Check logs** for troubleshooting
4. **Test pagination** with `?page=1&limit=5` parameters
5. **Always include auth header** in requests

