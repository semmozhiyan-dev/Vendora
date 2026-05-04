# 🚀 Admin Panel - Quick Reference Card

## ⚡ Quick Start (3 Commands)

```bash
# 1. Create admin user
node create-admin.js

# 2. Start server
npm start

# 3. Run automated tests
./test-admin-panel.sh
```

---

## 🔑 Manual Testing

### Get Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}' \
  | jq -r '.token'
```

**Save it:**
```bash
export TOKEN="your_token_here"
```

---

## 📊 Admin Endpoints Cheat Sheet

### Dashboard
```bash
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Products
```bash
# Create
curl -X POST http://localhost:5000/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","description":"Desc","price":99,"stock":10,"category":"Cat"}'

# List
curl -X GET "http://localhost:5000/api/v1/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Update
curl -X PUT http://localhost:5000/api/v1/admin/products/PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":79,"stock":20}'

# Delete
curl -X DELETE http://localhost:5000/api/v1/admin/products/PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Users
```bash
# List
curl -X GET "http://localhost:5000/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Update Role
curl -X PUT http://localhost:5000/api/v1/admin/users/USER_ID/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'

# Delete
curl -X DELETE http://localhost:5000/api/v1/admin/users/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Orders
```bash
# List
curl -X GET "http://localhost:5000/api/v1/admin/orders?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Get by ID
curl -X GET http://localhost:5000/api/v1/admin/orders/ORDER_ID \
  -H "Authorization: Bearer $TOKEN"

# Update Status
curl -X PUT http://localhost:5000/api/v1/admin/orders/ORDER_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"SHIPPED"}'
```

---

## 🎯 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔄 Order Status Flow

```
PENDING → PAID → SHIPPED → DELIVERED
   ↓        ↓        ↓
CANCELLED ← ← ← ← ← ← ←
```

**Valid Transitions:**
- PENDING → PAID, CANCELLED
- PAID → SHIPPED, CANCELLED
- SHIPPED → DELIVERED, CANCELLED
- DELIVERED → (locked)
- CANCELLED → (locked)

---

## 🧪 Testing Checklist

```bash
# 1. Create admin
node create-admin.js

# 2. Start server
npm start

# 3. Run tests
./test-admin-panel.sh

# 4. Check logs
tail -f logs/app.log
```

---

## 🐛 Troubleshooting

### "Access denied. Admin privileges required."
```bash
# Check user role in database
# Update role to admin if needed
node create-admin.js
```

### "Invalid or expired token"
```bash
# Login again to get fresh token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}'
```

### "Cannot find module 'admin.middleware'"
```bash
# File should exist at:
ls -la src/middlewares/admin.middleware.js
# If missing, it was created - restart server
```

---

## 📁 Files Reference

| File | Purpose |
|------|---------|
| `create-admin.js` | Create admin user |
| `test-admin-panel.sh` | Automated tests |
| `ADMIN_STEP_BY_STEP_TESTING.md` | Detailed guide |
| `ADMIN_COMPLETE.md` | Full documentation |
| `src/middlewares/admin.middleware.js` | Admin authorization |

---

## 🎓 Common Tasks

### Create First Admin
```bash
node create-admin.js
# Follow prompts
```

### Test Everything
```bash
./test-admin-panel.sh
```

### Get Dashboard Stats
```bash
TOKEN="your_token"
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Create Product
```bash
TOKEN="your_token"
curl -X POST http://localhost:5000/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Latest Apple phone",
    "price": 999,
    "stock": 50,
    "category": "Electronics"
  }' | jq
```

### Promote User to Admin
```bash
TOKEN="your_token"
USER_ID="user_id_here"
curl -X PUT http://localhost:5000/api/v1/admin/users/$USER_ID/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' | jq
```

---

## 📊 All 15 Admin Endpoints

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/admin/dashboard` | Analytics |
| 2 | POST | `/admin/products` | Create product |
| 3 | GET | `/admin/products` | List products |
| 4 | PUT | `/admin/products/:id` | Update product |
| 5 | DELETE | `/admin/products/:id` | Delete product |
| 6 | GET | `/admin/orders` | List orders |
| 7 | GET | `/admin/orders/:id` | Get order |
| 8 | PUT | `/admin/orders/:id/status` | Update status |
| 9 | GET | `/admin/users` | List users |
| 10 | PUT | `/admin/users/:id/role` | Update role |
| 11 | DELETE | `/admin/users/:id` | Delete user |

**All require:** `Authorization: Bearer TOKEN`

---

## 🎉 Success Indicators

✅ Server starts without errors
✅ Admin user created
✅ Login returns token
✅ Dashboard returns stats
✅ All CRUD operations work
✅ Non-admin access blocked (403)
✅ No auth access blocked (401)
✅ Logs show admin activity

---

## 📞 Quick Help

**Server not starting?**
```bash
# Check logs
tail -f logs/app.log

# Check port
lsof -i :5000
```

**Tests failing?**
```bash
# Ensure server is running
curl http://localhost:5000/health

# Ensure admin exists
node create-admin.js

# Check token is valid
echo $TOKEN
```

**Need to reset?**
```bash
# Delete test data from MongoDB
# Recreate admin user
node create-admin.js
```

---

## 🔗 Full Documentation

- **Quick Start**: This file
- **Step-by-Step**: `ADMIN_STEP_BY_STEP_TESTING.md`
- **Complete Guide**: `ADMIN_COMPLETE.md`
- **API Reference**: `ADMIN_MODULE_DOCUMENTATION.md`
- **Middleware**: `ADMIN_MIDDLEWARE_DOCUMENTATION.md`

---

**Your admin panel is ready! 🚀**

**Quick test:** `./test-admin-panel.sh`
