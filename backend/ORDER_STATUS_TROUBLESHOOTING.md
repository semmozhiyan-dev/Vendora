# 🔧 Order Status Update - Troubleshooting Guide

## ❌ Error: 400 Bad Request

**Endpoint**: `PUT /api/v1/admin/orders/:id/status`

---

## 🔍 Common Causes

### 1. Missing or Invalid Request Body

**Problem**: Status not provided in request body

**Solution**: Ensure you're sending the status in the request body

**Correct Request**:
```bash
curl -X PUT http://localhost:5000/api/v1/admin/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHIPPED"}'
```

**Postman**:
- Method: `PUT`
- URL: `http://localhost:5000/api/v1/admin/orders/69f832954c77d313e4ed34e0/status`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "status": "SHIPPED"
}
```

---

### 2. Invalid Status Transition

**Problem**: Trying to transition to an invalid status

**Valid Status Flow**:
```
PENDING  →  PAID, CANCELLED
PAID     →  SHIPPED, CANCELLED
SHIPPED  →  DELIVERED, CANCELLED
DELIVERED  →  (locked - no transitions)
CANCELLED  →  (locked - no transitions)
```

**Examples**:

✅ **Valid Transitions**:
- PENDING → PAID
- PENDING → CANCELLED
- PAID → SHIPPED
- PAID → CANCELLED
- SHIPPED → DELIVERED
- SHIPPED → CANCELLED

❌ **Invalid Transitions**:
- PENDING → SHIPPED (must go through PAID first)
- PENDING → DELIVERED (must go through PAID and SHIPPED)
- PAID → DELIVERED (must go through SHIPPED first)
- DELIVERED → anything (order is complete)
- CANCELLED → anything (order is cancelled)

---

### 3. Invalid Status Value

**Problem**: Status value is not one of the allowed values

**Valid Status Values**:
- `PENDING`
- `PAID`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Note**: Status values are case-sensitive and must be UPPERCASE

❌ **Invalid**:
```json
{"status": "shipped"}     // lowercase
{"status": "Shipped"}     // mixed case
{"status": "PROCESSING"}  // not in enum
```

✅ **Valid**:
```json
{"status": "SHIPPED"}     // correct
```

---

## 🧪 Step-by-Step Testing

### Step 1: Get Order Details

First, check the current order status:

```bash
curl -X GET http://localhost:5000/api/v1/admin/orders/69f832954c77d313e4ed34e0 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "69f832954c77d313e4ed34e0",
    "status": "PENDING",  // Current status
    "totalAmount": 1998,
    "items": [...]
  }
}
```

**Note the current status**: `PENDING`

---

### Step 2: Choose Valid Transition

Based on current status, choose a valid next status:

| Current Status | Valid Next Status |
|----------------|-------------------|
| PENDING | PAID, CANCELLED |
| PAID | SHIPPED, CANCELLED |
| SHIPPED | DELIVERED, CANCELLED |
| DELIVERED | (none) |
| CANCELLED | (none) |

---

### Step 3: Update Status

**If current status is PENDING**, you can update to PAID:

```bash
curl -X PUT http://localhost:5000/api/v1/admin/orders/69f832954c77d313e4ed34e0/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "PAID"}'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "69f832954c77d313e4ed34e0",
    "status": "PAID",
    "totalAmount": 1998
  }
}
```

---

### Step 4: Continue Status Flow

**Now that status is PAID**, you can update to SHIPPED:

```bash
curl -X PUT http://localhost:5000/api/v1/admin/orders/69f832954c77d313e4ed34e0/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHIPPED"}'
```

**Then to DELIVERED**:

```bash
curl -X PUT http://localhost:5000/api/v1/admin/orders/69f832954c77d313e4ed34e0/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "DELIVERED"}'
```

---

## 🐛 Debugging Your Request

### Check 1: Verify Request Body

**In Postman**:
1. Go to Body tab
2. Select "raw"
3. Select "JSON" from dropdown
4. Ensure body is:
```json
{
  "status": "SHIPPED"
}
```

**Common Mistakes**:
- ❌ Forgetting quotes: `{status: SHIPPED}`
- ❌ Wrong key name: `{"orderStatus": "SHIPPED"}`
- ❌ Lowercase: `{"status": "shipped"}`
- ❌ Extra fields: `{"status": "SHIPPED", "other": "field"}`

---

### Check 2: Verify Headers

**Required Headers**:
```
Authorization: Bearer YOUR_ACTUAL_TOKEN
Content-Type: application/json
```

**In Postman**:
1. Go to Headers tab
2. Ensure both headers are present
3. Token should start with `eyJ...`

---

### Check 3: Verify Order Exists

```bash
curl -X GET http://localhost:5000/api/v1/admin/orders/69f832954c77d313e4ed34e0 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**If order doesn't exist (404)**:
```json
{
  "success": false,
  "message": "Order not found"
}
```

**Solution**: Use a valid order ID from the orders list

---

### Check 4: Check Server Logs

```bash
tail -f logs/app.log
```

**Look for**:
- `Invalid status transition: PENDING -> DELIVERED`
- `Status not provided for order update`
- `Order not found`

---

## 📋 Complete Working Example

### 1. Get All Orders
```bash
curl -X GET "http://localhost:5000/api/v1/admin/orders?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Copy an order ID from response**

---

### 2. Get Order Details
```bash
ORDER_ID="69f832954c77d313e4ed34e0"

curl -X GET http://localhost:5000/api/v1/admin/orders/$ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Note the current status**

---

### 3. Update Status (PENDING → PAID)
```bash
curl -X PUT http://localhost:5000/api/v1/admin/orders/$ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "PAID"}'
```

---

### 4. Update Status (PAID → SHIPPED)
```bash
curl -X PUT http://localhost:5000/api/v1/admin/orders/$ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHIPPED"}'
```

---

### 5. Update Status (SHIPPED → DELIVERED)
```bash
curl -X PUT http://localhost:5000/api/v1/admin/orders/$ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "DELIVERED"}'
```

---

## 🎯 Quick Fix Checklist

- [ ] Request body includes `{"status": "VALUE"}`
- [ ] Status value is UPPERCASE
- [ ] Status value is one of: PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
- [ ] Transition is valid for current order status
- [ ] Content-Type header is `application/json`
- [ ] Authorization header includes valid token
- [ ] Order ID exists in database
- [ ] Order is not already DELIVERED or CANCELLED

---

## 📊 Error Response Examples

### Missing Status
**Request**:
```json
{}
```

**Response (400)**:
```json
{
  "success": false,
  "message": "Status is required"
}
```

---

### Invalid Transition
**Request** (when order is PENDING):
```json
{"status": "DELIVERED"}
```

**Response (400)**:
```json
{
  "success": false,
  "message": "Cannot transition from PENDING to DELIVERED"
}
```

---

### Invalid Status Value
**Request**:
```json
{"status": "PROCESSING"}
```

**Response (400)**:
```json
{
  "success": false,
  "message": "Invalid status. Allowed: PENDING, PAID, SHIPPED, DELIVERED, CANCELLED"
}
```

---

### Order Not Found
**Response (404)**:
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

## 🔧 Postman Collection

Save this as a Postman request:

**Name**: Update Order Status

**Method**: PUT

**URL**: `{{baseUrl}}/api/v1/admin/orders/{{orderId}}/status`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "status": "SHIPPED"
}
```

**Variables**:
- `baseUrl`: `http://localhost:5000`
- `token`: Your JWT token
- `orderId`: Order ID from database

---

## 💡 Pro Tips

1. **Always check current status first** before updating
2. **Follow the status flow** - don't skip steps
3. **Use UPPERCASE** for status values
4. **Check logs** for detailed error messages
5. **Test with cURL first** to isolate Postman issues
6. **Verify token is valid** - re-login if needed

---

## 🎉 Success Indicators

✅ **Status 200** - Update successful
✅ **Response includes updated order**
✅ **Status changed in database**
✅ **Logs show successful update**

---

## 📞 Still Having Issues?

1. **Check server logs**: `tail -f logs/app.log`
2. **Verify order exists**: GET `/api/v1/admin/orders/:id`
3. **Check current status**: Note what status the order is in
4. **Verify transition**: Ensure you're following valid flow
5. **Test with cURL**: Rule out Postman issues
6. **Check token**: Re-login if token expired

---

**Need help? Check the logs for specific error messages!**
