# Vendora API - Issues & Fixes

## Summary of API Issues Found

Based on the Postman API test logs, the following issues have been identified:

---

## 1. ❌ **Auth Endpoints Rate Limiting Issue**
**Status:** `Too many authentication attempts, please try again after 15 minutes`

### Problem
- Both `/api/v1/auth/register` and `/api/v1/auth/login` are returning rate limit errors
- Rate limit is set to **5 requests per 15 minutes** in `authRateLimit.middleware.js`
- You've exceeded the limit

### Cause
- Location: `backend/src/middlewares/authRateLimit.middleware.js`
- The limiter is too strict for testing (5 requests in 15 minutes)

### Solution
**Option 1 (Recommended for Testing):**
- Reset the rate limiter by waiting 15 minutes OR
- Clear your IP from the rate limit store (requires Redis reset in production)

**Option 2 (Development Fix):**
Modify the rate limit window to be more permissive during testing:
```javascript
// backend/src/middlewares/authRateLimit.middleware.js
const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour (instead of 15 minutes)
  max: 20,                    // 20 requests (instead of 5)
  // ... rest of config
});
```

---

## 2. ❌ **Payment Endpoint Route Not Found**
**Status:** `Route not found: /api/v1/payment/create-order`

### Problem
- Postman is calling `/api/v1/payment/create-order` (singular)
- But the route is registered as `/api/v1/payments` (plural)

### Cause
- Location: `backend/src/app.js` line 71
```javascript
app.use("/api/v1/payments", paymentRoutes);  // ← PLURAL
```

### Solution
**Update Postman collection:**
Change the payment endpoint from:
```
POST http://localhost/api/v1/payment/create-order
```
To:
```
POST http://localhost/api/v1/payments/create-order
```

---

## 3. ❌ **Invalid Payment Request Body**
**Status:** `TypeError: Cannot read properties of undefined (reading 'id')`

### Problem
- Payment endpoint expects an `orderId` in the request body
- Postman is sending only `{ "amount": 500 }`

### Current Implementation
Location: `backend/src/controllers/payment.controller.js`
```javascript
const createRazorpayOrder = async (req, res, next) => {
  const { orderId } = req.body;  // ← Expects orderId, not amount
  
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Valid orderId is required" });
  }
  
  const order = await Order.findById(orderId);  // ← Tries to find order
  // ...
  const amountInPaise = Math.round(order.totalAmount * 100);
};
```

### Solution
**Correct Request Body:**
```json
{
  "orderId": "69f4537e8a6ab9c43d0c73b4"
}
```

**How to Get a Valid OrderId:**
1. First, create an order via `POST /api/v1/orders` (requires auth token and valid cart)
2. Use the returned `_id` as the `orderId` in the payment request

---

## 4. ❌ **Missing/Null Authentication Tokens**
**Status:** `Bearer null` in Authorization headers

### Problem
- All protected endpoints show `Authorization: Bearer null`
- Requests to `/products` (POST), `/cart`, `/orders`, `/payments` are failing with `Invalid or expired token`

### Cause
- Postman is not storing the JWT token from login response
- Token variable is not set in Postman environment

### Solution

**In Postman Pre-request Script** (for login endpoint):
Add this to extract and save the token from the login response to use in subsequent requests.

**In Postman Tests Tab** (for login endpoint):
```javascript
if (pm.response.code === 200) {
  const responseData = pm.response.json();
  if (responseData.data && responseData.data.accessToken) {
    pm.environment.set("authToken", responseData.data.accessToken);
    pm.environment.set("userId", responseData.data.user._id);
  }
}
```

**Then use the token in Authorization header:**
```
Authorization: Bearer {{authToken}}
```

**Manual Alternative:**
1. Call `/api/v1/auth/login` manually
2. Copy the `accessToken` from the response
3. Set it in Postman's Authorization tab as Bearer token
4. Or set environment variable: `Authorization: Bearer YOUR_TOKEN_HERE`

---

## 5. ⚠️ **GET Products Working (✅)**
**Status:** `Success - 23 products returned`
- This endpoint works because it doesn't require authentication
- Data is being fetched correctly from MongoDB

---

## 6. ⚠️ **Health Check Working (✅)**
**Status:** `OK - Database connected`
- Server is running
- Database connection is healthy

---

## API Test Sequence (Correct Order)

To properly test the API, follow this sequence:

### 1. **Health Check** (No auth needed)
```
GET http://localhost:5000/health
```
Expected response: `{ "status": "OK", "dbStatus": "connected" }`

### 2. **Register New User**
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "securePassword123"
}
```
Expected response: User created with `accessToken`

### 3. **Login** (Sets authToken for next requests)
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "securePassword123"
}
```
Expected response: `{ "accessToken": "..." }`

### 4. **Get Products** (No auth needed)
```
GET http://localhost:5000/api/v1/products
```

### 5. **Create Order** (Requires auth + valid cart)
```
POST http://localhost:5000/api/v1/orders
Authorization: Bearer {{authToken}}
Content-Type: application/json

{}
```
Expected response: Order created with `_id`

### 6. **Create Payment Order** (Requires auth + valid order)
```
POST http://localhost:5000/api/v1/payments/create-order
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "orderId": "USE_ORDER_ID_FROM_STEP_5"
}
```
Expected response: Razorpay order created

---

## Configuration Recommendations

### For Development (Current Setup)
The current rate limiting is too strict. Consider these changes:

**File:** `backend/src/middlewares/authRateLimit.middleware.js`
```javascript
const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour instead of 15 minutes
  max: 50,                    // 50 requests instead of 5
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 1 hour",
  },
});

module.exports = authRateLimiter;
```

### For Production
Keep stricter limits but consider:
- Add IP-based rate limiting per user (track by user ID after login)
- Use Redis for distributed rate limiting
- Implement account lockout after X failed attempts

---

## Testing Checklist

- [ ] Wait 15 minutes or restart server to reset auth rate limit
- [ ] Update Postman endpoint URLs to use `/api/v1/payments` (plural)
- [ ] Create a valid order before testing payment endpoint
- [ ] Set up Postman environment variables for `authToken`
- [ ] Test sequence: Health → Register → Login → Get Products → Create Order → Create Payment

---

## Next Steps

1. **Immediate:** Fix Postman URLs (add 's' to payment endpoint)
2. **Short-term:** Adjust rate limiting for development
3. **Long-term:** Implement proper token management in Postman or frontend
