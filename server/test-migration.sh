#!/bin/bash

echo "🧪 Testing PharmaCare API Endpoints"
echo "===================================="
echo ""

API_URL="http://localhost:5000/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local endpoint=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 401 ]; then
        echo -e "${GREEN}✓${NC} $name - Status: $response"
    else
        echo -e "${RED}✗${NC} $name - Status: $response"
    fi
}

echo "Testing endpoints (some may require authentication):"
echo ""

# Test all endpoints
test_endpoint "/health" "Health Check"
test_endpoint "/customers" "Customers"
test_endpoint "/suppliers" "Suppliers"
test_endpoint "/prescriptions" "Prescriptions"
test_endpoint "/purchase-orders" "Purchase Orders"
test_endpoint "/stock-movements" "Stock Movements"
test_endpoint "/notifications" "Notifications"
test_endpoint "/settings" "Settings"
test_endpoint "/audit-logs" "Audit Logs"
test_endpoint "/medicines" "Medicines"
test_endpoint "/dashboard" "Dashboard"

echo ""
echo "===================================="
echo "Note: 401 status means endpoint exists but requires authentication"
echo "Note: 200 status means endpoint is working"
echo ""
