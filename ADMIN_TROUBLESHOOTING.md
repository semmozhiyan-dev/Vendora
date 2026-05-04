# Admin Panel Troubleshooting Guide

## Issue: Admin Panel Not Opening

### ✅ Fixes Applied:

1. **User Persistence** - Added localStorage to persist user login across page refreshes
2. **Loading State** - Added loading spinner while checking authentication
3. **Proper Redirects** - Redirects to `/login` when not authenticated (instead of `/`)
4. **User Data Storage** - Stores both token and user data in localStorage

### How to Access Admin Panel:

#### Step 1: Start Backend
```bash
cd backend
npm start
```
- Backend should run on: `http://localhost:5000`
- Check console for "Server running on port 5000"

#### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```
- Frontend should run on: `http://localhost:5173`
- Check console for "Local: http://localhost:5173/"

#### Step 3: Create Admin User (if not exists)
```bash
cd backend
node create-admin.js
```
This will create an admin user with:
- Email: `admin@vendora.com`
- Password: (check the script output)

#### Step 4: Login
1. Open browser: `http://localhost:5173/login`
2. Enter admin credentials
3. Click "Sign in"
4. Should redirect to: `http://localhost:5173/admin/dashboard`

### Common Issues & Solutions:

#### 1. "Cannot connect to backend"
**Symptoms:** Network errors, CORS errors
**Solution:**
- Ensure backend is running on port 5000
- Check `frontend/src/api/axios.js` has correct baseURL
- Verify no firewall blocking localhost

#### 2. "Redirects to login immediately"
**Symptoms:** Can't stay on admin pages
**Solution:**
- Check browser console for errors
- Verify token exists: `localStorage.getItem('token')`
- Verify user exists: `localStorage.getItem('user')`
- Check user role is "admin"

#### 3. "Login successful but redirects to home"
**Symptoms:** Login works but goes to `/` instead of `/admin/dashboard`
**Solution:**
- Check user role in database: `db.users.findOne({email: 'admin@vendora.com'})`
- Role must be exactly "admin" (lowercase)
- Clear localStorage and login again

#### 4. "Dashboard shows loading forever"
**Symptoms:** Spinner never stops
**Solution:**
- Check backend API is responding: `curl http://localhost:5000/api/v1/admin/dashboard`
- Check browser Network tab for failed requests
- Verify MongoDB is running and connected

#### 5. "401 Unauthorized error"
**Symptoms:** API calls fail with 401
**Solution:**
- Token might be expired or invalid
- Clear localStorage: `localStorage.clear()`
- Login again

#### 6. "403 Forbidden error"
**Symptoms:** API calls fail with 403
**Solution:**
- User doesn't have admin role
- Update user role in database:
  ```javascript
  db.users.updateOne(
    {email: 'admin@vendora.com'},
    {$set: {role: 'admin'}}
  )
  ```

### Verify Setup:

#### Check Backend is Running:
```bash
curl http://localhost:5000/api/v1/health
```
Should return: `{"status":"OK"}`

#### Check Admin Endpoint (with token):
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/v1/admin/dashboard
```

#### Check Frontend is Running:
Open browser to: `http://localhost:5173`

### Debug Checklist:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Admin user exists in database
- [ ] Admin user has role: "admin"
- [ ] Can login successfully
- [ ] Token saved in localStorage
- [ ] User data saved in localStorage
- [ ] No console errors in browser
- [ ] No CORS errors

### Browser Console Commands:

Check if logged in:
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

Clear and retry:
```javascript
localStorage.clear();
window.location.href = '/login';
```

### File Changes Made:

1. `/frontend/src/context/AuthContext.jsx` - Added user persistence
2. `/frontend/src/routes/AdminRoute.jsx` - Added loading state and proper redirects
3. `/frontend/src/pages/auth/Login.jsx` - Save user to localStorage
4. `/frontend/src/layouts/AdminLayout.jsx` - Clear user from localStorage on logout

### Next Steps if Still Not Working:

1. Check browser console for errors
2. Check backend logs for errors
3. Verify database connection
4. Try creating a new admin user
5. Clear all browser data and try again
6. Check if ports 5000 and 5173 are available

### Success Indicators:

✅ Backend console shows: "Server running on port 5000"
✅ Frontend console shows: "Local: http://localhost:5173/"
✅ Login redirects to `/admin/dashboard`
✅ Dashboard shows stat cards with data
✅ Recent orders table displays
✅ Sidebar navigation works
✅ No errors in browser console
