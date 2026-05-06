# 🔐 Admin API Testing - Complete Guide

## ⚠️ STEP 0: Verify Admin Role in MongoDB

Before testing ANY admin endpoints, ensure your user has `role: "admin"`.

### Check Current Role
```javascript
// In MongoDB shell or MongoDB Compass
db.users.findOne({ email: "your_email@example.com" })

// Result should show:
{
  "_id": ObjectId("..."),
  "name": "Your Name",
  "email": "your_email@example.com",
  "role": "admin",        // ← MUST BE "admin"
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### Update Role to Admin (if needed)
```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "admin" } }
)

// Result:
{
  "acknowledged": true,
  "modifiedCount": 1
}
```

### Create Test Admin User (if no users exist)
```javascript
// Insert with pre-hashed password (or hash in app first)
db.users.insertOne({
  name: "Admin User",
  email: "admin@test.com",
  password: "$2a$10$...", // hashed password
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 🔑 STEP 1: Login & Get Token

### API Request
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

### Expected Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Your Name",
      "email": "your_email@example.com",
      "role": "admin"
    }
  }
}
```

### ❌ If Not Admin (403)
```json
{
  "success": false,
  "message": "Invalid credentials or not an admin"
}
```

**Fix:** Update user role to "admin" in MongoDB (see STEP 0)

---

## 🧪 STEP 2: Call Admin APIs with Token

### Required Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test 1: Get Dashboard (Simplest Test)
```http
GET http://localhost:5000/api/v1/admin/dashboard
Authorization: Bearer <your_token_from_login>
```

### Expected Response (200)
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalUsers": 5,
    "totalOrders": 12,
    "totalRevenue": 5000.50,
    "recentOrders": []
  }
}
```

---

## 🔍 STEP 3: Verify Access Control

### ❌ Test Without Token
```http
GET http://localhost:5000/api/v1/admin/dashboard
(no Authorization header)
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Authorization header missing"
}
```

### ❌ Test with Non-Admin User
1. Create a user with `role: "user"`
2. Login to get token
3. Call admin endpoint:

```http
GET http://localhost:5000/api/v1/admin/dashboard
Authorization: Bearer <user_token>
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### ❌ Test with Invalid Token
```http
GET http://localhost:5000/api/v1/admin/dashboard
Authorization: Bearer invalid_token_12345
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 📝 Complete Testing Workflow

### Setup
```bash
# 1. Ensure MongoDB is running
# 2. Start server
cd backend
npm run dev

# Should see:
# [timestamp] info: Connected to MongoDB
# [timestamp] info: Server running on port 5000
```

### Test Sequence

**Step 1: Check User Role**
```javascript
// MongoDB
db.users.findOne({ email: "your_email@example.com" })
// Verify role: "admin"
```

**Step 2: Login**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_email@example.com",
    "password": "your_password"
  }'
```

Copy the `token` from response.

**Step 3: Test Admin Endpoints**
```bash
# Get Dashboard
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer <your_token>"

# List Products
curl -X GET http://localhost:5000/api/v1/admin/products \
  -H "Authorization: Bearer <your_token>"

# List Users
curl -X GET http://localhost:5000/api/v1/admin/users \
  -H "Authorization: Bearer <your_token>"

# List Orders
curl -X GET http://localhost:5000/api/v1/admin/orders \
  -H "Authorization: Bearer <your_token>"
```

**Step 4: Verify Access Control**
```bash
# Try without token
curl -X GET http://localhost:5000/api/v1/admin/dashboard
# Expected: 401 Unauthorized

# Try with non-admin token
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer <non_admin_token>"
# Expected: 403 Forbidden
```

---

## 🚀 Using Postman

### Import Environment
```json
{
  "name": "Vendora Admin",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:5000",
      "enabled": true
    },
    {
      "key": "token",
      "value": "",
      "enabled": true
    }
  ]
}
```

### Create Requests

**1. Login (Get Token)**
```
POST {{base_url}}/api/v1/auth/login
Body (raw JSON):
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

Add Pre-request Script:
```javascript
// Extract token from response
if (pm.response.code === 200) {
  let response = pm.response.json();
  pm.environment.set("token", response.data.token);
}
```

**2. Get Dashboard**
```
GET {{base_url}}/api/v1/admin/dashboard
Headers:
Authorization: Bearer {{token}}
```

**3. Create Product**
```
POST {{base_url}}/api/v1/admin/products
Headers:
Authorization: Bearer {{token}}
Body (raw JSON):
{
  "name": "Test Product",
  "description": "A test product",
  "price": 99.99,
  "stock": 50,
  "category": "Electronics"
}
```

**4. List Products**
```
GET {{base_url}}/api/v1/admin/products?page=1&limit=10
Headers:
Authorization: Bearer {{token}}
```

---

## 📊 Troubleshooting

### Issue: 401 "Authorization header missing"
**Solution:** Add header to request:
```
Authorization: Bearer <token>
```

### Issue: 403 "Admin access required"
**Solution:** User is not admin. Update in MongoDB:
```javascript
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "admin" } }
)
```

### Issue: 401 "Invalid or expired token"
**Solution:** Token expired or malformed. Login again to get fresh token:
```
POST /api/v1/auth/login
```

### Issue: Cannot login - wrong credentials
**Solution:** Verify user exists in database:
```javascript
db.users.findOne({ email: "your_email@example.com" })
```

### Issue: User not in database
**Solution:** Create test user:
```javascript
// First, hash password in your app or use a known hash
db.users.insertOne({
  name: "Test Admin",
  email: "admin@test.com",
  password: "$2a$10$...", // bcrypt hash
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] User has `role: "admin"` in MongoDB
- [ ] Login returns token successfully
- [ ] Token is valid and not expired
- [ ] Dashboard endpoint returns 200 with data
- [ ] Products endpoint returns 200 with list
- [ ] Users endpoint returns 200 with list
- [ ] Orders endpoint returns 200 with list
- [ ] Without token returns 401
- [ ] Non-admin user returns 403
- [ ] All logs show successful requests with request IDs

---

## 📡 Full API Endpoints

Once verified as admin, test these endpoints:

### Products (4)
```
POST   /api/v1/admin/products           - Create
GET    /api/v1/admin/products           - List
PUT    /api/v1/admin/products/:id       - Update
DELETE /api/v1/admin/products/:id       - Delete
```

### Orders (3)
```
GET    /api/v1/admin/orders             - List
GET    /api/v1/admin/orders/:id         - Get details
PUT    /api/v1/admin/orders/:id/status  - Update status
```

### Users (3)
```
GET    /api/v1/admin/users              - List
PUT    /api/v1/admin/users/:id/role     - Update role
DELETE /api/v1/admin/users/:id          - Delete
```

### Dashboard (1)
```
GET    /api/v1/admin/dashboard          - Get stats
```

---

## 🎯 Quick Command Line Test

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}' \
  | jq -r '.data.token')

echo "Token: $TOKEN"

# 2. Test dashboard
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN" \
  | jq

# 3. Test without token (should fail)
curl -X GET http://localhost:5000/api/v1/admin/dashboard | jq
```

---

## 🔐 Security Notes

- ⚠️ Never share tokens publicly
- ⚠️ Tokens expire after 24 hours (configurable)
- ⚠️ Always use HTTPS in production
- ⚠️ Store tokens securely (never in plain text)
- ✅ Tokens are JWT signed with JWT_SECRET
- ✅ Invalid tokens are rejected immediately
- ✅ Non-admin users cannot access admin routes

