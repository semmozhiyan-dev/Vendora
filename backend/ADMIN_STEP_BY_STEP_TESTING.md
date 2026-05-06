# 🎯 Admin Panel Testing Guide - Step by Step

## STEP 0: Verify/Create Admin User

### Option A: Create New Admin User (Recommended)

```bash
cd backend
node create-admin.js
```

**Interactive prompts:**
```
Admin Name: Admin User
Admin Email: admin@example.com
Admin Password: Admin@123456
```

**Expected Output:**
```
✓ Connected to MongoDB
✓ Admin user created successfully!

Admin Details:
  ID: 507f1f77bcf86cd799439011
  Name: Admin User
  Email: admin@example.com
  Role: admin
```

### Option B: Update Existing User to Admin

**Using MongoDB Compass or Shell:**
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

**Or using environment variables:**
```bash
ADMIN_NAME="Admin" ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="Admin@123456" node create-admin.js
```

---

## STEP 1: Login & Get Token

### Start Server (if not running)
```bash
npm start
```

**Expected:**
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
```

### Login as Admin

**cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBhYjEyM2RlZjQ1Njc4OTBhYmNkZWYiLCJpYXQiOjE3Mjg4MjM0NTYsImV4cCI6MTcyODkwOTg1Nn0.abc123xyz...",
  "user": {
    "id": "670ab123def4567890abcdef",
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### 🔑 SAVE THE TOKEN!

**Copy the token value from the response:**
```bash
# Example token (yours will be different)
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBhYjEyM2RlZjQ1Njc4OTBhYmNkZWYiLCJpYXQiOjE3Mjg4MjM0NTYsImV4cCI6MTcyODkwOTg1Nn0.abc123xyz..."
```

**Or save to a file:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}' \
  | jq -r '.token' > token.txt

# Use it
export TOKEN=$(cat token.txt)
```

---

## STEP 2: Call Admin APIs with Token

### 2.1 Dashboard - Get Analytics

```bash
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalUsers": 5,
    "totalOrders": 10,
    "totalRevenue": 5000,
    "recentOrders": [
      {
        "_id": "...",
        "userId": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "totalAmount": 500,
        "status": "PAID",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 2.2 Products - Create Product

```bash
curl -X POST http://localhost:5000/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest Apple flagship phone with A17 Pro chip",
    "price": 999,
    "stock": 50,
    "category": "Electronics",
    "image": "https://example.com/iphone15.jpg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "670ab456def4567890abcdef",
    "name": "iPhone 15 Pro",
    "description": "Latest Apple flagship phone with A17 Pro chip",
    "price": 999,
    "stock": 50,
    "category": "Electronics",
    "image": "https://example.com/iphone15.jpg",
    "rating": 0,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Save the product ID:**
```bash
export PRODUCT_ID="670ab456def4567890abcdef"
```

---

### 2.3 Products - Get All Products

```bash
# Get all products (page 1, limit 10)
curl -X GET "http://localhost:5000/api/v1/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Filter by category
curl -X GET "http://localhost:5000/api/v1/admin/products?category=Electronics" \
  -H "Authorization: Bearer $TOKEN"

# Filter by active status
curl -X GET "http://localhost:5000/api/v1/admin/products?isActive=true" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "670ab456def4567890abcdef",
      "name": "iPhone 15 Pro",
      "price": 999,
      "stock": 50,
      "category": "Electronics",
      "isActive": true
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

### 2.4 Products - Update Product

```bash
curl -X PUT http://localhost:5000/api/v1/admin/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899,
    "stock": 100
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "670ab456def4567890abcdef",
    "name": "iPhone 15 Pro",
    "price": 899,
    "stock": 100,
    "category": "Electronics"
  }
}
```

---

### 2.5 Products - Delete Product

```bash
curl -X DELETE http://localhost:5000/api/v1/admin/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "670ab456def4567890abcdef",
    "name": "iPhone 15 Pro"
  }
}
```

---

### 2.6 Users - Get All Users

```bash
# Get all users
curl -X GET "http://localhost:5000/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Filter by role
curl -X GET "http://localhost:5000/api/v1/admin/users?role=admin" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "670ab123def4567890abcdef",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "670ab789def4567890abcdef",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

**Save a user ID:**
```bash
export USER_ID="670ab789def4567890abcdef"
```

---

### 2.7 Users - Update User Role

**Important:** The API blocks updating your own role. Use this step on a different user account, or create a second admin account first.

```bash
# Promote user to admin
curl -X PUT http://localhost:5000/api/v1/admin/users/$USER_ID/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'

# Demote admin to user
curl -X PUT http://localhost:5000/api/v1/admin/users/$USER_ID/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "_id": "670ab789def4567890abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**If you see this instead:**
```json
{
  "success": false,
  "message": "Cannot modify your own role"
}
```
That means `$USER_ID` matches the user encoded in `$TOKEN`. Pick another user ID.

---

### 2.8 Users - Delete User

```bash
curl -X DELETE http://localhost:5000/api/v1/admin/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "_id": "670ab789def4567890abcdef",
    "name": "John Doe"
  }
}
```

**Postman note:** If you add a test script for this request, do not use top-level `await`. Postman evaluates scripts in a sandbox that only supports synchronous code unless you wrap async logic in an async IIFE.

Safe pattern:
```javascript
(async () => {
  const response = pm.response.json();
  pm.environment.set("token", response.token);
})();
```

If you do not need async work, keep the script synchronous:
```javascript
const response = pm.response.json();
pm.environment.set("token", response.token);
```

---

### 2.9 Orders - Get All Orders

```bash
# Get all orders
curl -X GET "http://localhost:5000/api/v1/admin/orders?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl -X GET "http://localhost:5000/api/v1/admin/orders?status=PAID" \
  -H "Authorization: Bearer $TOKEN"

# Filter by user
curl -X GET "http://localhost:5000/api/v1/admin/orders?userId=$USER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "_id": "670ab999def4567890abcdef",
      "userId": {
        "_id": "670ab789def4567890abcdef",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "productId": {
            "_id": "670ab456def4567890abcdef",
            "name": "iPhone 15 Pro",
            "price": 999
          },
          "quantity": 2,
          "price": 999
        }
      ],
      "totalAmount": 1998,
      "status": "PAID",
      "shippingAddress": "123 Main St, City, State 12345",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

**Save an order ID:**
```bash
export ORDER_ID="670ab999def4567890abcdef"
```

---

### 2.10 Orders - Get Order by ID

```bash
curl -X GET http://localhost:5000/api/v1/admin/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "_id": "670ab999def4567890abcdef",
    "userId": {
      "_id": "670ab789def4567890abcdef",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [...],
    "totalAmount": 1998,
    "status": "PAID",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2.11 Orders - Update Order Status

```bash
# Update to SHIPPED
curl -X PUT http://localhost:5000/api/v1/admin/orders/$ORDER_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHIPPED"
  }'

# Update to DELIVERED
curl -X PUT http://localhost:5000/api/v1/admin/orders/$ORDER_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DELIVERED"
  }'
```

**Valid Status Transitions:**
```
PENDING  →  PAID, CANCELLED
PAID     →  SHIPPED, CANCELLED
SHIPPED  →  DELIVERED, CANCELLED
DELIVERED  →  (no transitions)
CANCELLED  →  (no transitions)
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "670ab999def4567890abcdef",
    "status": "SHIPPED"
  }
}
```

---

## 🧪 Testing Non-Admin Access (Should Fail)

### Create Regular User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Regular User",
    "email": "user@example.com",
    "password": "User@123456"
  }'
```

**Save the user token:**
```bash
export USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Try Admin Endpoint with User Token

```bash
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## 📊 Complete Test Script

Save this as `test-admin.sh`:

```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"

echo -e "${YELLOW}=== Admin Panel Testing ===${NC}\n"

# Step 1: Login
echo -e "${YELLOW}Step 1: Login as Admin${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
  echo "Token: ${TOKEN:0:20}..."
else
  echo -e "${RED}✗ Login failed${NC}"
  exit 1
fi

echo ""

# Step 2: Dashboard
echo -e "${YELLOW}Step 2: Get Dashboard Stats${NC}"
DASHBOARD=$(curl -s -X GET $BASE_URL/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN")

if [ $(echo $DASHBOARD | jq -r '.success') == "true" ]; then
  echo -e "${GREEN}✓ Dashboard retrieved${NC}"
  echo "Total Users: $(echo $DASHBOARD | jq -r '.data.totalUsers')"
  echo "Total Orders: $(echo $DASHBOARD | jq -r '.data.totalOrders')"
  echo "Total Revenue: $(echo $DASHBOARD | jq -r '.data.totalRevenue')"
else
  echo -e "${RED}✗ Dashboard failed${NC}"
fi

echo ""

# Step 3: Create Product
echo -e "${YELLOW}Step 3: Create Product${NC}"
PRODUCT=$(curl -s -X POST $BASE_URL/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Created by test script",
    "price": 99,
    "stock": 10,
    "category": "Test"
  }')

PRODUCT_ID=$(echo $PRODUCT | jq -r '.data._id')

if [ "$PRODUCT_ID" != "null" ]; then
  echo -e "${GREEN}✓ Product created${NC}"
  echo "Product ID: $PRODUCT_ID"
else
  echo -e "${RED}✗ Product creation failed${NC}"
fi

echo ""

# Step 4: Get Products
echo -e "${YELLOW}Step 4: Get All Products${NC}"
PRODUCTS=$(curl -s -X GET "$BASE_URL/api/v1/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ $(echo $PRODUCTS | jq -r '.success') == "true" ]; then
  echo -e "${GREEN}✓ Products retrieved${NC}"
  echo "Total Products: $(echo $PRODUCTS | jq -r '.pagination.total')"
else
  echo -e "${RED}✗ Products retrieval failed${NC}"
fi

echo ""

# Step 5: Get Users
echo -e "${YELLOW}Step 5: Get All Users${NC}"
USERS=$(curl -s -X GET "$BASE_URL/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ $(echo $USERS | jq -r '.success') == "true" ]; then
  echo -e "${GREEN}✓ Users retrieved${NC}"
  echo "Total Users: $(echo $USERS | jq -r '.pagination.total')"
else
  echo -e "${RED}✗ Users retrieval failed${NC}"
fi

echo ""

# Step 6: Test Non-Admin Access
echo -e "${YELLOW}Step 6: Test Non-Admin Access (Should Fail)${NC}"
USER_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"testuser'$(date +%s)'@example.com","password":"Test@123"}')

USER_TOKEN=$(echo $USER_RESPONSE | jq -r '.token')

FORBIDDEN=$(curl -s -X GET $BASE_URL/api/v1/admin/dashboard \
  -H "Authorization: Bearer $USER_TOKEN")

if [ $(echo $FORBIDDEN | jq -r '.success') == "false" ]; then
  echo -e "${GREEN}✓ Non-admin access blocked correctly${NC}"
else
  echo -e "${RED}✗ Security issue: Non-admin accessed admin endpoint${NC}"
fi

echo ""
echo -e "${GREEN}=== Testing Complete ===${NC}"
```

**Run the test:**
```bash
chmod +x test-admin.sh
./test-admin.sh
```

---

## 📝 Postman Collection

Import this JSON into Postman:

**File**: `Admin-Panel-Tests.postman_collection.json`

```json
{
  "info": {
    "name": "Admin Panel Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "1. Login Admin",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 200) {",
              "    const response = pm.response.json();",
              "    pm.collectionVariables.set('token', response.token);",
              "    console.log('Token saved:', response.token);",
              "}"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"admin@example.com\",\n  \"password\": \"Admin@123456\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/auth/login",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "auth", "login"]
        }
      }
    },
    {
      "name": "2. Get Dashboard",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/admin/dashboard",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "admin", "dashboard"]
        }
      }
    },
    {
      "name": "3. Create Product",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"iPhone 15 Pro\",\n  \"description\": \"Latest Apple phone\",\n  \"price\": 999,\n  \"stock\": 50,\n  \"category\": \"Electronics\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/admin/products",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "admin", "products"]
        }
      }
    },
    {
      "name": "4. Get All Products",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/admin/products?page=1&limit=10",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "admin", "products"],
          "query": [
            {
              "key": "page",
              "value": "1"
            },
            {
              "key": "limit",
              "value": "10"
            }
          ]
        }
      }
    },
    {
      "name": "5. Get All Users",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/admin/users?page=1&limit=10",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "admin", "users"],
          "query": [
            {
              "key": "page",
              "value": "1"
            },
            {
              "key": "limit",
              "value": "10"
            }
          ]
        }
      }
    },
    {
      "name": "6. Get All Orders",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/admin/orders?page=1&limit=10",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "admin", "orders"],
          "query": [
            {
              "key": "page",
              "value": "1"
            },
            {
              "key": "limit",
              "value": "10"
            }
          ]
        }
      }
    }
  ]
}
```

---

## ✅ Verification Checklist

- [ ] Admin user created (`node create-admin.js`)
- [ ] Server started (`npm start`)
- [ ] Admin login successful (token received)
- [ ] Dashboard endpoint works
- [ ] Product creation works
- [ ] Product listing works
- [ ] User listing works
- [ ] Order listing works
- [ ] Non-admin access blocked (403)
- [ ] Logs show admin activity

---

## 🎉 Success Criteria

All tests should pass with:
- ✅ Status 200/201 for successful operations
- ✅ Status 403 for non-admin access
- ✅ Proper JSON responses
- ✅ Token authentication working
- ✅ Admin role verification working

**Your admin panel is ready to use!** 🚀
