# Sign-In Troubleshooting Guide

## Step 1: Check Backend is Running

In your backend terminal, you should see:
```
PharmaCare API running on port 5000
MongoDB connected successfully
```

If you see "MongoDB connection error", go back to MONGODB_SETUP.md

## Step 2: Seed the Database

Run this ONCE to create demo users:
```bash
cd ~/pharma_care/server
npm run seed
```

You should see:
```
Database seeded successfully!
Created 3 users
Created 4 medicines
Created 2 sample sales
```

## Step 3: Test Backend API Directly

Open a new terminal and test:
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test login with demo credentials
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"abebe.bekele@pharmacare.et","password":"Pharma@2026"}'
```

If login works, you should get a response with a token.

## Step 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to sign in
4. Look for errors (red text)

Common errors:
- **CORS error**: Backend not running or wrong URL
- **Network error**: Backend not accessible
- **401 Unauthorized**: Wrong credentials or database not seeded
- **500 Server error**: Backend crash, check backend terminal

## Step 5: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try to sign in
4. Look for the login request
5. Click on it to see:
   - Request URL (should be http://localhost:5000/api/auth/login)
   - Status code (should be 200 for success)
   - Response (should have token and user data)

## Demo Credentials

After seeding, use these:
- Email: `abebe.bekele@pharmacare.et`
- Password: `Pharma@2026`

OR

- Email: `tigist.haile@pharmacare.et`
- Password: `Staff@2026`

OR

- Email: `dawit.tesfaye@pharmacare.et`
- Password: `Invent@2026`

## Common Issues

### Issue: "Invalid credentials"
**Solution**: Run `npm run seed` in the server directory

### Issue: Network error / Can't connect
**Solution**: 
1. Check backend is running on port 5000
2. Check frontend .env has: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### Issue: CORS error
**Solution**: Backend CORS is configured, but make sure backend is running

### Issue: MongoDB connection failed
**Solution**: Check server/.env has correct MongoDB Atlas credentials

## Quick Test Commands

```bash
# Terminal 1 - Backend
cd ~/pharma_care/server
npm run seed  # Run once
npm run dev   # Keep running

# Terminal 2 - Frontend  
cd ~/pharma_care/pharmacare
npm run dev   # Keep running

# Terminal 3 - Test API
curl http://localhost:5000/api/health
```
