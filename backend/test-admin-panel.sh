#!/bin/bash

# Admin Panel Automated Testing Script
# Tests all admin endpoints with proper authentication

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin@123456"

# Counters
PASSED=0
FAILED=0
TOTAL=0

# Helper functions
print_header() {
    echo -e "\n${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  $1"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
    ((TOTAL++))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
    ((TOTAL++))
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is not installed${NC}"
    echo "Install it with: sudo apt-get install jq (Ubuntu/Debian) or brew install jq (macOS)"
    exit 1
fi

# Check if server is running
print_header "Checking Server Status"
print_step "Pinging server..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)

if [ "$HEALTH_CHECK" == "200" ]; then
    print_success "Server is running"
else
    print_error "Server is not running on $BASE_URL"
    echo "Please start the server with: npm start"
    exit 1
fi

# STEP 0: Verify Admin User Exists
print_header "STEP 0: Verify Admin User"
print_step "Attempting to login as admin..."

LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    print_error "Admin user not found or invalid credentials"
    print_info "Create admin user with: node create-admin.js"
    exit 1
else
    print_success "Admin user verified"
fi

# STEP 1: Login & Get Token
print_header "STEP 1: Login & Get Token"
print_step "Logging in as admin..."

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
    print_success "Login successful"
    print_info "Token: ${TOKEN:0:30}..."
    
    USER_NAME=$(echo $LOGIN_RESPONSE | jq -r '.user.name')
    USER_EMAIL=$(echo $LOGIN_RESPONSE | jq -r '.user.email')
    print_info "Logged in as: $USER_NAME ($USER_EMAIL)"
else
    print_error "Login failed"
    exit 1
fi

# STEP 2: Test Admin APIs
print_header "STEP 2: Testing Admin APIs"

# Test 2.1: Dashboard
print_step "Test 2.1: Get Dashboard Stats"
DASHBOARD=$(curl -s -X GET $BASE_URL/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN")

if [ $(echo $DASHBOARD | jq -r '.success') == "true" ]; then
    print_success "Dashboard retrieved"
    TOTAL_USERS=$(echo $DASHBOARD | jq -r '.data.totalUsers')
    TOTAL_ORDERS=$(echo $DASHBOARD | jq -r '.data.totalOrders')
    TOTAL_REVENUE=$(echo $DASHBOARD | jq -r '.data.totalRevenue')
    print_info "  Total Users: $TOTAL_USERS"
    print_info "  Total Orders: $TOTAL_ORDERS"
    print_info "  Total Revenue: $TOTAL_REVENUE"
else
    print_error "Dashboard retrieval failed"
    echo "Response: $DASHBOARD"
fi

echo ""

# Test 2.2: Create Product
print_step "Test 2.2: Create Product"
PRODUCT=$(curl -s -X POST $BASE_URL/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product '$(date +%s)'",
    "description": "Created by automated test script",
    "price": 99.99,
    "stock": 50,
    "category": "Test"
  }')

PRODUCT_ID=$(echo $PRODUCT | jq -r '.data._id')

if [ "$PRODUCT_ID" != "null" ] && [ ! -z "$PRODUCT_ID" ]; then
    print_success "Product created"
    print_info "  Product ID: $PRODUCT_ID"
    PRODUCT_NAME=$(echo $PRODUCT | jq -r '.data.name')
    print_info "  Product Name: $PRODUCT_NAME"
else
    print_error "Product creation failed"
    echo "Response: $PRODUCT"
fi

echo ""

# Test 2.3: Get All Products
print_step "Test 2.3: Get All Products"
PRODUCTS=$(curl -s -X GET "$BASE_URL/api/v1/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ $(echo $PRODUCTS | jq -r '.success') == "true" ]; then
    print_success "Products retrieved"
    PRODUCT_COUNT=$(echo $PRODUCTS | jq -r '.pagination.total')
    print_info "  Total Products: $PRODUCT_COUNT"
else
    print_error "Products retrieval failed"
fi

echo ""

# Test 2.4: Update Product
if [ "$PRODUCT_ID" != "null" ] && [ ! -z "$PRODUCT_ID" ]; then
    print_step "Test 2.4: Update Product"
    UPDATED_PRODUCT=$(curl -s -X PUT $BASE_URL/api/v1/admin/products/$PRODUCT_ID \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "price": 79.99,
        "stock": 100
      }')

    if [ $(echo $UPDATED_PRODUCT | jq -r '.success') == "true" ]; then
        print_success "Product updated"
        NEW_PRICE=$(echo $UPDATED_PRODUCT | jq -r '.data.price')
        NEW_STOCK=$(echo $UPDATED_PRODUCT | jq -r '.data.stock')
        print_info "  New Price: $NEW_PRICE"
        print_info "  New Stock: $NEW_STOCK"
    else
        print_error "Product update failed"
    fi
    echo ""
fi

# Test 2.5: Get All Users
print_step "Test 2.5: Get All Users"
USERS=$(curl -s -X GET "$BASE_URL/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ $(echo $USERS | jq -r '.success') == "true" ]; then
    print_success "Users retrieved"
    USER_COUNT=$(echo $USERS | jq -r '.pagination.total')
    print_info "  Total Users: $USER_COUNT"
else
    print_error "Users retrieval failed"
fi

echo ""

# Test 2.6: Get All Orders
print_step "Test 2.6: Get All Orders"
ORDERS=$(curl -s -X GET "$BASE_URL/api/v1/admin/orders?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ $(echo $ORDERS | jq -r '.success') == "true" ]; then
    print_success "Orders retrieved"
    ORDER_COUNT=$(echo $ORDERS | jq -r '.pagination.total')
    print_info "  Total Orders: $ORDER_COUNT"
else
    print_error "Orders retrieval failed"
fi

echo ""

# Test 2.7: Delete Product
if [ "$PRODUCT_ID" != "null" ] && [ ! -z "$PRODUCT_ID" ]; then
    print_step "Test 2.7: Delete Product"
    DELETED_PRODUCT=$(curl -s -X DELETE $BASE_URL/api/v1/admin/products/$PRODUCT_ID \
      -H "Authorization: Bearer $TOKEN")

    if [ $(echo $DELETED_PRODUCT | jq -r '.success') == "true" ]; then
        print_success "Product deleted"
    else
        print_error "Product deletion failed"
    fi
    echo ""
fi

# Test 2.8: Test Non-Admin Access (Should Fail)
print_step "Test 2.8: Test Non-Admin Access (Should Fail)"
USER_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser'$(date +%s)'@example.com",
    "password": "Test@123456"
  }')

USER_TOKEN=$(echo $USER_RESPONSE | jq -r '.token')

if [ "$USER_TOKEN" != "null" ] && [ ! -z "$USER_TOKEN" ]; then
    FORBIDDEN=$(curl -s -X GET $BASE_URL/api/v1/admin/dashboard \
      -H "Authorization: Bearer $USER_TOKEN")

    if [ $(echo $FORBIDDEN | jq -r '.success') == "false" ]; then
        print_success "Non-admin access blocked correctly (403)"
        print_info "  Message: $(echo $FORBIDDEN | jq -r '.message')"
    else
        print_error "Security issue: Non-admin accessed admin endpoint!"
    fi
else
    print_error "Could not create test user"
fi

echo ""

# Test 2.9: Test Without Token (Should Fail)
print_step "Test 2.9: Test Without Token (Should Fail)"
NO_AUTH=$(curl -s -X GET $BASE_URL/api/v1/admin/dashboard)

if [ $(echo $NO_AUTH | jq -r '.success') == "false" ]; then
    print_success "Unauthenticated access blocked correctly (401)"
    print_info "  Message: $(echo $NO_AUTH | jq -r '.message')"
else
    print_error "Security issue: Unauthenticated access allowed!"
fi

# Summary
print_header "Test Summary"
echo -e "${GREEN}✓ Passed:${NC} $PASSED"
echo -e "${RED}✗ Failed:${NC} $FAILED"
echo -e "${BLUE}━ Total:${NC}  $TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}  🎉 All tests passed! Admin panel is working perfectly! 🎉"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║${NC}  ⚠️  Some tests failed. Please review the errors above."
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
