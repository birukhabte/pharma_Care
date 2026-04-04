#!/usr/bin/env node

// Test script to diagnose login issues
const https = require('https');
const http = require('http');

console.log('🔍 PharmaCare Login Diagnostic Tool\n');

// Test 1: Check if backend is running
console.log('Test 1: Checking backend health...');
http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Backend is running');
      console.log('   Response:', data);
      
      // Test 2: Try login with demo credentials
      console.log('\nTest 2: Testing login with demo credentials...');
      const credentials = JSON.stringify({
        email: 'ravi.patel@pharmacare.in',
        password: 'Pharma@2026'
      });
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': credentials.length
        }
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log('   Status Code:', res.statusCode);
          
          if (res.statusCode === 200) {
            console.log('✅ Login successful!');
            const response = JSON.parse(data);
            console.log('   User:', response.user.fullName);
            console.log('   Role:', response.user.role);
            console.log('   Token:', response.token.substring(0, 50) + '...');
            console.log('\n✨ Backend is working correctly!');
            console.log('\n📋 Next steps:');
            console.log('   1. Clear browser cache and localStorage');
            console.log('   2. Open browser DevTools (F12)');
            console.log('   3. Go to Application > Local Storage > Clear All');
            console.log('   4. Try logging in again');
            console.log('   5. Check Network tab for the actual request being sent');
          } else if (res.statusCode === 401) {
            console.log('❌ Login failed with 401 Unauthorized');
            console.log('   Response:', data);
            console.log('\n📋 This means:');
            console.log('   - Database might not be seeded');
            console.log('   - Run: cd server && npm run seed');
          } else {
            console.log('❌ Unexpected status code');
            console.log('   Response:', data);
          }
        });
      });
      
      req.on('error', (e) => {
        console.log('❌ Login request failed:', e.message);
      });
      
      req.write(credentials);
      req.end();
      
    } else {
      console.log('❌ Backend returned status:', res.statusCode);
    }
  });
}).on('error', (e) => {
  console.log('❌ Backend is not running');
  console.log('   Error:', e.message);
  console.log('\n📋 Start the backend:');
  console.log('   cd server && npm run dev');
});
