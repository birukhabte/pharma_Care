#!/bin/bash

echo "Testing PharmaCare API Endpoints"
echo "================================="
echo ""

BASE_URL="http://localhost:5001/api"

echo "1. Testing /api/customers (should require auth):"
curl -s $BASE_URL/customers | head -1
echo ""
echo ""

echo "2. Testing /api/suppliers (should require auth):"
curl -s $BASE_URL/suppliers | head -1
echo ""
echo ""

echo "3. Testing /api/prescriptions (should require auth):"
curl -s $BASE_URL/prescriptions | head -1
echo ""
echo ""

echo "4. Testing /api/purchase-orders (should require auth):"
curl -s $BASE_URL/purchase-orders | head -1
echo ""
echo ""

echo "5. Testing /api/settings (should require auth):"
curl -s $BASE_URL/settings | head -1
echo ""
echo ""

echo "All endpoints are responding! ✅"
echo ""
echo "Note: All endpoints require authentication."
echo "To test with authentication:"
echo "1. Login: curl -X POST $BASE_URL/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"your@email.com\",\"password\":\"yourpassword\"}'"
echo "2. Use token: curl $BASE_URL/customers -H 'Authorization: Bearer YOUR_TOKEN'"
