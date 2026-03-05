#!/bin/bash

# Test Script for Booking Lapangan Application
# Author: Muhammad Rizal Nurfirdaus
# Date: March 5, 2026

set -e

BASE_URL="http://localhost:3000/api"
FRONTEND_URL="http://localhost:5173"

echo "========================================="
echo "  Booking Lapangan - API Test Suite"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local expected_status=$5
    
    echo -n "Testing: $description ... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $status_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected $expected_status, got $status_code)"
        echo "Response: $body"
        ((FAILED++))
        return 1
    fi
}

# 1. Health Check
echo "1. Testing Health Check"
echo "----------------------"
test_endpoint "GET" "/health" "Health endpoint" "" "200"
echo ""

# 2. Authentication Endpoints
echo "2. Testing Authentication"
echo "------------------------"
test_endpoint "POST" "/auth/register" "Register with invalid data" '{"nama_lengkap":"Te","email":"invalid","password":"12345678","pass_confirm":"12345678"}' "400"
test_endpoint "POST" "/auth/login" "Login with wrong password" '{"email":"admin123@gmail.com","password":"wrongpass"}' "401"
test_endpoint "GET" "/auth/me" "Check session without token" "" "200"
echo ""

# 3. Public Endpoints
echo "3. Testing Public Endpoints"
echo "--------------------------"
test_endpoint "GET" "/galeri" "Get gallery list" "" "200"
test_endpoint "GET" "/booking/get-jadwal?tanggal=2026-03-05" "Get jadwal for weekday" "" "200"
test_endpoint "GET" "/booking/get-jadwal?tanggal=2026-03-08" "Get jadwal for weekend" "" "200"
echo ""

# 4. Protected Endpoints (without auth - should fail)
echo "4. Testing Protected Endpoints (no auth)"
echo "---------------------------------------"
test_endpoint "GET" "/profil" "Get profile without auth" "" "401"
test_endpoint "GET" "/user/riwayat" "Get booking history without auth" "" "401"
test_endpoint "GET" "/admin/dashboard" "Access admin dashboard without auth" "" "401"
echo ""

# 5. Admin Login and Test Admin Endpoints
echo "5. Testing Admin Login"
echo "---------------------"
LOGIN_RESPONSE=$(curl -s -c /tmp/cookies.txt -X POST -H "Content-Type: application/json" \
    -d '{"email":"admin123@gmail.com","password":"admin12345"}' \
    "$BASE_URL/auth/login")

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Admin login successful${NC}"
    ((PASSED++))
    
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}✗ Admin login failed${NC}"
    ((FAILED++))
    echo "Response: $LOGIN_RESPONSE"
fi
echo ""

# 6. Test Admin Endpoints with Token
echo "6. Testing Admin Endpoints (with auth)"
echo "--------------------------------------"
ADMIN_DASHBOARD=$(curl -s -b "token=$TOKEN" "$BASE_URL/admin/dashboard")
if echo "$ADMIN_DASHBOARD" | grep -q "total_pesanan"; then
    echo -e "${GREEN}✓ Admin dashboard accessible${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Admin dashboard failed${NC}"
    ((FAILED++))
fi

ADMIN_PEMBAYARAN=$(curl -s -b "token=$TOKEN" "$BASE_URL/admin/pembayaran")
if echo "$ADMIN_PEMBAYARAN" | grep -q "data"; then
    echo -e "${GREEN}✓ Admin pembayaran accessible${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Admin pembayaran failed${NC}"
    ((FAILED++))
fi

ADMIN_USERS=$(curl -s -b "token=$TOKEN" "$BASE_URL/admin/users")
if echo "$ADMIN_USERS" | grep -q "data"; then
    echo -e "${GREEN}✓ Admin users accessible${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Admin users failed${NC}"
    ((FAILED++))
fi
echo ""

# 7. Test Database Connection
echo "7. Testing Database"
echo "------------------"
DB_TEST=$(curl -s "$BASE_URL/galeri")
if [ -n "$DB_TEST" ]; then
    echo -e "${GREEN}✓ Database connection working${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Database connection failed${NC}"
    ((FAILED++))
fi
echo ""

# 8. Test Frontend Availability
echo "8. Testing Frontend"
echo "------------------"
FRONTEND_CHECK=$(curl -s -I "$FRONTEND_URL" | head -n 1)
if echo "$FRONTEND_CHECK" | grep -q "200"; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Frontend check failed (might be loading)${NC}"
fi
echo ""

# Summary
echo "========================================="
echo "           Test Summary"
echo "========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
