# Testing Guide: Timeout Middleware & Graceful Shutdown

## Setup

### 1. Environment Configuration ✅
Added to `.env`:
```
REQUEST_TIMEOUT_MS=10000
```

### 2. Test Routes & Controller ✅
Created temporary test routes for validation:
- **Test Controller**: `src/controllers/test.controller.js`
- **Test Routes**: `src/routes/test.routes.js`
- **App Integration**: Registered at `/api/v1/test`

---

## Test 1: Request Timeout Middleware ⏱️

### Prerequisites
```bash
cd backend
npm run dev
```

### Test Case: Slow Request (Should timeout after 10s)

**Endpoint:**
```
GET http://localhost:5000/api/v1/test/slow
```

**Expected Behavior:**
- Request hangs for 10 seconds
- Server responds with **503 Service Unavailable**

**Expected Response:**
```json
{
  "success": false,
  "message": "Request timeout"
}
```

**Expected Logs:**
```
[REQUEST-ID] GET /api/v1/test/slow
[REQUEST-ID] Request timeout after 10000ms
[REQUEST-ID] 503 GET /api/v1/test/slow - 10001ms
```

### Test Case: Fast Request (Should complete normally)

**Endpoint:**
```
GET http://localhost:5000/api/v1/test/fast
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Fast request completed"
}
```

### Using Postman

1. **Create Request 1 - Slow Test**
   - Method: `GET`
   - URL: `http://localhost:5000/api/v1/test/slow`
   - Click **Send**
   - Wait 10 seconds → Observe 503 timeout response

2. **Create Request 2 - Fast Test**
   - Method: `GET`
   - URL: `http://localhost:5000/api/v1/test/fast`
   - Click **Send**
   - Should respond immediately with success

### Using cURL

**Slow request:**
```bash
curl -v http://localhost:5000/api/v1/test/slow
```

**Fast request:**
```bash
curl -v http://localhost:5000/api/v1/test/fast
```

---

## Test 2: Graceful Shutdown 🛑

### Prerequisites
Ensure server is running:
```bash
npm run dev
```

### Test Procedure

1. **Server is running** - You see:
   ```
   [timestamp] info: Connected to MongoDB
   [timestamp] info: Server running on port 5000
   ```

2. **Send a slow request in another terminal:**
   ```bash
   curl http://localhost:5000/api/v1/test/slow
   ```

3. **Press `Ctrl + C` in the server terminal**

### Expected Shutdown Logs

```
[timestamp] info: SIGINT received, starting graceful shutdown...
[timestamp] info: Server closed, closing database connection...
[timestamp] info: MongoDB connection closed
[timestamp] info: Graceful shutdown completed
```

### What Happens

✅ **Step 1:** SIGINT signal received  
✅ **Step 2:** Server stops accepting new connections  
✅ **Step 3:** MongoDB connection closes  
✅ **Step 4:** Process exits cleanly (exit code 0)  

**Important:** The slow request will timeout, and the server will shut down gracefully without forcing connections closed.

---

## Test 3: Docker/K8s Graceful Shutdown (SIGTERM)

### Simulate Docker termination:
```bash
# In one terminal
npm run dev

# In another terminal
kill -TERM <pid>
# or
pkill -TERM -f "node server.js"
```

### Expected Logs
Same as Ctrl+C test, but initiated by `SIGTERM`:
```
[timestamp] info: SIGTERM received, starting graceful shutdown...
```

---

## Verification Checklist ✓

### Timeout Middleware
- [ ] Slow request times out at 10 seconds
- [ ] Response status is 503
- [ ] Response body has `{ success: false, message: "Request timeout" }`
- [ ] Request ID is logged with timeout message
- [ ] Fast request completes normally
- [ ] Timeout can be configured via `REQUEST_TIMEOUT_MS` env variable

### Graceful Shutdown
- [ ] SIGINT (Ctrl+C) triggers shutdown
- [ ] SIGTERM triggers shutdown
- [ ] Server stops accepting new connections
- [ ] MongoDB connection closes cleanly
- [ ] Process exits with code 0
- [ ] Graceful shutdown completes within 10 seconds
- [ ] Force exit occurs if shutdown takes longer than 10 seconds
- [ ] All shutdown events are logged with timestamps

---

## Cleanup: Remove Test Routes Before Production ⚠️

Before deploying:

1. **Remove test routes from `src/app.js`:**
   ```javascript
   // ⚠️ REMOVE THESE LINES
   const testRoutes = require("./routes/test.routes");
   // ...
   app.use("/api/v1/test", testRoutes);
   ```

2. **Delete test files:**
   ```bash
   rm src/controllers/test.controller.js
   rm src/routes/test.routes.js
   ```

3. **Keep these in production:**
   - ✅ `src/middlewares/timeout.middleware.js` (Core feature)
   - ✅ `server.js` with graceful shutdown (Core feature)
   - ✅ `.env` with `REQUEST_TIMEOUT_MS` (Configuration)

---

## Troubleshooting

### Issue: Timeout not working
- Check `REQUEST_TIMEOUT_MS` is set in `.env`
- Ensure `timeoutMiddleware` is loaded in app.js
- Check middleware order (must be before routes)

### Issue: Shutdown hangs
- Check if there are active database operations
- Verify MongoDB connection can close
- Check for long-running timers in handlers

### Issue: Logs not appearing
- Ensure Winston logger is initialized
- Check log file permissions in `logs/` directory
- Verify `REQUEST_ID` middleware is active

---

## Files Modified/Created

```
✅ .env - Added REQUEST_TIMEOUT_MS=10000
✅ src/middlewares/timeout.middleware.js - NEW
✅ src/app.js - Integrated timeout middleware
✅ server.js - Updated with graceful shutdown
✅ src/controllers/test.controller.js - NEW (temporary)
✅ src/routes/test.routes.js - NEW (temporary)
```
