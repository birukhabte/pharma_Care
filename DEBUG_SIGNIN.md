# Debug Sign-In Issue

## What error are you seeing?

Please check and tell me which one:

### 1. Button does nothing when clicked
- Check browser console (F12) for JavaScript errors
- Make sure frontend is running

### 2. "Invalid credentials" error
- Database not seeded
- Run: `cd ~/pharma_care/server && npm run seed`

### 3. Network/Connection error
- Backend not running
- Check: `curl http://localhost:5000/api/health`

### 4. CORS error in console
- Backend not accessible
- Check backend terminal for errors

### 5. Page refreshes but doesn't redirect
- Check browser console for errors
- Check localStorage is working

## Quick Debug Steps

**Step 1: Is backend running?**
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

**Step 2: Is database seeded?**
```bash
cd ~/pharma_care/server
npm run seed
```

**Step 3: Test login API directly**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"abebe.bekele@pharmacare.et","password":"Pharma@2026"}'
```

Should return JSON with `token` and `user` fields.

**Step 4: Check browser console**
1. Open http://localhost:3000/sign-up-login-screen
2. Press F12 to open DevTools
3. Go to Console tab
4. Try to sign in
5. Copy any error messages you see

**Step 5: Check Network tab**
1. In DevTools, go to Network tab
2. Try to sign in
3. Look for a request to `/api/auth/login`
4. Click on it
5. Check:
   - Status code (should be 200)
   - Response tab (should have token)
   - Preview tab (should show user data)

## What to tell me

Please provide:
1. What happens when you click "Sign In"?
2. Any error messages in browser console?
3. Output of: `curl http://localhost:5000/api/health`
4. Did you run `npm run seed`?
5. Is backend terminal showing "MongoDB connected successfully"?
