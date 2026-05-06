# Admin Backend Module Documentation

## 📋 Overview

Complete admin backend module for managing products, orders, users, and dashboard analytics in an eCommerce system.

### Features
- ✅ Product management (Create, Read, Update, Delete)
- ✅ Order management with status transitions
- ✅ User management and role assignment
- ✅ Dashboard analytics
- ✅ Role-based access control
- ✅ Pagination and filtering
- ✅ Comprehensive validation
- ✅ Request logging and error handling

---

## 🏗️ Architecture

### Folder Structure
```
src/modules/admin/
├── controllers/
│   ├── admin.product.controller.js      # Product endpoints
│   ├── admin.order.controller.js        # Order endpoints
│   ├── admin.user.controller.js         # User endpoints
│   └── admin.dashboard.controller.js    # Dashboard analytics
├── routes/
│   └── admin.routes.js                  # Route definitions
├── services/
│   └── admin.service.js                 # Business logic
└── validations/
    └── admin.validation.js              # Input validation
```

### Layer Separation
- **Controllers**: HTTP request/response handling
- **Services**: Business logic (database operations)
- **Validations**: Input validation and error checking
- **Routes**: API endpoint definitions with middleware

---

## 🔐 Authorization

All admin routes require:
1. **Authentication**: Valid JWT token via `Authorization: Bearer <token>`
2. **Admin Role**: User must have `role: "admin"` in the database

Middleware chain:
```javascript
authMiddleware → adminMiddleware → controller
```

---

## 📦 API Endpoints

### Base URL
```
/api/v1/admin
```

### 1. PRODUCT MANAGEMENT

#### Create Product
```http
POST /api/v1/admin/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 50,
  "category": "Electronics",
  "image": "https://example.com/image.jpg"
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Product Name",
    "price": 99.99,
    "stock": 50,
    "category": "Electronics",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get All Products
```http
GET /api/v1/admin/products?page=1&limit=10&category=Electronics&isActive=true
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Product Name",
      "price": 99.99,
      "stock": 50,
      "category": "Electronics",
      "isActive": true
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Update Product
```http
PUT /api/v1/admin/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 149.99,
  "stock": 100
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Updated Name",
    "price": 149.99,
    "stock": 100
  }
}
```

#### Delete Product
```http
DELETE /api/v1/admin/products/:id
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Product Name"
  }
}
```

---

### 2. ORDER MANAGEMENT

#### Get All Orders
```http
GET /api/v1/admin/orders?page=1&limit=10&status=PAID&userId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "productId": {
            "_id": "507f1f77bcf86cd799439010",
            "name": "Product Name",
            "price": 99.99
          },
          "quantity": 2,
          "price": 99.99
        }
      ],
      "totalAmount": 199.98,
      "status": "PAID",
      "shippingAddress": "123 Main St, City, State 12345",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Get Order by ID
```http
GET /api/v1/admin/orders/:id
Authorization: Bearer <token>
```

#### Update Order Status
```http
PUT /api/v1/admin/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "SHIPPED"
}
```

**Status Flow (Valid Transitions)**
```
PENDING  →  PAID, CANCELLED
PAID     →  SHIPPED, CANCELLED
SHIPPED  →  DELIVERED, CANCELLED
DELIVERED  →  (no transitions)
CANCELLED  →  (no transitions)
```

**Response (200)**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "SHIPPED"
  }
}
```

---

### 3. USER MANAGEMENT

#### Get All Users
```http
GET /api/v1/admin/users?page=1&limit=10&role=admin
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 500,
    "pages": 50
  }
}
```

#### Update User Role
```http
PUT /api/v1/admin/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Allowed Roles**: `"user"`, `"admin"`

#### Delete User
```http
DELETE /api/v1/admin/users/:id
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe"
  }
}
```

**Restrictions**:
- Cannot delete yourself
- Cannot update your own role

---

### 4. DASHBOARD ANALYTICS

#### Get Dashboard Statistics
```http
GET /api/v1/admin/dashboard
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalUsers": 500,
    "totalOrders": 1250,
    "totalRevenue": 125000.50,
    "recentOrders": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "userId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "totalAmount": 299.99,
        "status": "DELIVERED",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## ✅ Validation Rules

### Product Validation
- `name`: Required, non-empty string
- `description`: Required, non-empty string
- `price`: Required, positive number
- `stock`: Required, non-negative number
- `category`: Required, non-empty string

### Order Status
- Must match one of: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- Must follow valid transition flow

### User Role
- Must be: `"user"` or `"admin"`

### Pagination
- `page`: Positive number (default: 1)
- `limit`: Number between 1-100 (default: 10)

---

## 🧪 Testing with Postman

### Setup
1. Create collection: "Admin Module"
2. Add environment variable: `token` = your_jwt_token
3. Use base URL: `{{base_url}}/api/v1/admin`

### Test Sequence

**1. Authenticate** (from auth routes)
```http
POST /api/v1/auth/login
```
Save `token` from response

**2. Create Product**
```http
POST /api/v1/admin/products
Authorization: Bearer {{token}}
```

**3. Get Products**
```http
GET /api/v1/admin/products
Authorization: Bearer {{token}}
```

**4. Update Product**
```http
PUT /api/v1/admin/products/:id
Authorization: Bearer {{token}}
```

**5. Create Order** (or use existing)
Get order ID from orders endpoint

**6. Update Order Status**
```http
PUT /api/v1/admin/orders/:id/status
Authorization: Bearer {{token}}
```

**7. Get Dashboard Stats**
```http
GET /api/v1/admin/dashboard
Authorization: Bearer {{token}}
```

---

## 🚨 Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes

| Code | Scenario |
|------|----------|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Not authorized (not admin) |
| 404 | Resource not found |
| 500 | Server error |

### Example Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Product name is required",
    "price": "Valid product price is required"
  }
}
```

---

## 📝 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  role: String (enum: ["user", "admin"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  image: String,
  rating: Number (0-5),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (enum: [...]),
  paymentId: String,
  shippingAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Best Practices

1. **Always include request ID** in logs for tracking
2. **Validate all inputs** before processing
3. **Check authorization** before sensitive operations
4. **Use pagination** for list endpoints
5. **Handle errors gracefully** with meaningful messages
6. **Log important operations** for audit trail
7. **Prevent self-modification** (role, delete)
8. **Validate status transitions** for orders

---

## 📈 Performance Tips

- Use pagination to limit data transfer
- Add indexes on frequently queried fields (userId, status)
- Cache dashboard stats if called frequently
- Use projections to exclude sensitive fields
- Consider rate limiting for write operations

---

## 🔄 Future Enhancements

- [ ] Export data to CSV/Excel
- [ ] Bulk operations (update/delete multiple)
- [ ] Advanced filtering and search
- [ ] Order fulfillment tracking
- [ ] Inventory alerts
- [ ] Admin activity audit log
- [ ] Sales analytics by category
- [ ] User behavior analytics

