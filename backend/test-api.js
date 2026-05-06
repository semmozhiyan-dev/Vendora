#!/usr/bin/env node
/**
 * Comprehensive API Test Script
 * Tests all endpoints with proper authentication flow
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api/v1`;

// Test data
let authToken = null;
let userId = null;
let productId = null;
let orderId = null;

// Generate unique email for testing
const timestamp = Date.now();
const testEmail = `test_${timestamp}@example.com`;

// Axios instance with better error handling
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  validateStatus: () => true, // Don't throw on any status
});

// Helper to log responses
const logResponse = (title, response) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${title}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Status: ${response.status} ${response.statusText}`);
  console.log(`Data:`, JSON.stringify(response.data, null, 2));
  
  if (response.status >= 400) {
    console.log('❌ FAILED');
  } else {
    console.log('✅ SUCCESS');
  }
};

// Test functions
const testHealthCheck = async () => {
  const response = await api.get('/health');
  logResponse('1. Health Check', response);
  return response.status === 200;
};

const testRegister = async () => {
  const response = await api.post(`${API_BASE}/auth/register`, {
    name: 'Test User',
    email: testEmail,
    password: 'Test@123456',
  });
  
  logResponse('2. Register User', response);
  
  if (response.status === 201 && response.data.token) {
    authToken = response.data.token;
    userId = response.data.user.id;
    console.log(`\n🔑 Auth Token: ${authToken.substring(0, 20)}...`);
    console.log(`👤 User ID: ${userId}`);
    return true;
  }
  return false;
};

const testLogin = async () => {
  const response = await api.post(`${API_BASE}/auth/login`, {
    email: testEmail,
    password: 'Test@123456',
  });
  
  logResponse('3. Login User', response);
  
  if (response.status === 200 && response.data.token) {
    authToken = response.data.token;
    console.log(`\n🔑 Updated Auth Token: ${authToken.substring(0, 20)}...`);
    return true;
  }
  return false;
};

const testCreateProduct = async () => {
  const response = await api.post(
    `${API_BASE}/products`,
    {
      name: 'Test Product',
      description: 'Created by automated test',
      price: 999,
      stock: 50,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  
  logResponse('4. Create Product', response);
  
  if (response.status === 201 && response.data.product) {
    productId = response.data.product._id;
    console.log(`\n📦 Product ID: ${productId}`);
    return true;
  }
  return false;
};

const testGetProducts = async () => {
  const response = await api.get(`${API_BASE}/products`);
  logResponse('5. Get All Products', response);
  
  // If we don't have a productId yet, try to get one from the list
  if (!productId && response.data.items && response.data.items.length > 0) {
    productId = response.data.items[0]._id;
    console.log(`\n📦 Using existing Product ID: ${productId}`);
  }
  
  return response.status === 200;
};

const testAddToCart = async () => {
  if (!productId) {
    console.log('\n⚠️  Skipping cart test - no product available');
    return false;
  }
  
  const response = await api.post(
    `${API_BASE}/cart`,
    {
      productId: productId,
      quantity: 2,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  
  logResponse('6. Add to Cart', response);
  return response.status === 200 || response.status === 201;
};

const testGetCart = async () => {
  const response = await api.get(`${API_BASE}/cart`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  
  logResponse('7. Get Cart', response);
  return response.status === 200;
};

const testCreateOrder = async () => {
  const response = await api.post(
    `${API_BASE}/orders`,
    {},
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  
  logResponse('8. Create Order', response);
  
  if (response.status === 201 && response.data.order) {
    orderId = response.data.order._id;
    console.log(`\n🛒 Order ID: ${orderId}`);
    return true;
  }
  return false;
};

const testGetOrders = async () => {
  const response = await api.get(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  
  logResponse('9. Get Orders', response);
  return response.status === 200;
};

const testCreatePaymentOrder = async () => {
  // Test with amount only (simplified flow)
  const response = await api.post(
    `${API_BASE}/payment/create-order`,
    {
      amount: 500,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  
  logResponse('10. Create Payment Order (Test Mode)', response);
  return response.status === 201;
};

const testCreatePaymentOrderWithOrderId = async () => {
  if (!orderId) {
    console.log('\n⚠️  Skipping payment with orderId - no order available');
    return false;
  }
  
  const response = await api.post(
    `${API_BASE}/payment/create-order`,
    {
      orderId: orderId,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  
  logResponse('11. Create Payment Order (Full Flow)', response);
  return response.status === 201;
};

// Main test runner
const runTests = async () => {
  console.log('\n🚀 Starting API Tests...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Email: ${testEmail}\n`);
  
  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Register', fn: testRegister },
    { name: 'Login', fn: testLogin },
    { name: 'Get Products', fn: testGetProducts },
    { name: 'Create Product', fn: testCreateProduct },
    { name: 'Add to Cart', fn: testAddToCart },
    { name: 'Get Cart', fn: testGetCart },
    { name: 'Create Order', fn: testCreateOrder },
    { name: 'Get Orders', fn: testGetOrders },
    { name: 'Create Payment (Test)', fn: testCreatePaymentOrder },
    { name: 'Create Payment (Full)', fn: testCreatePaymentOrderWithOrderId },
  ];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.log(`\n❌ Test "${test.name}" threw an error:`);
      console.log(error.message);
      results.failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📊 Total: ${results.passed + results.failed + results.skipped}`);
  console.log('='.repeat(60));
  
  process.exit(results.failed > 0 ? 1 : 0);
};

// Run tests
runTests().catch((error) => {
  console.error('\n💥 Fatal error:', error.message);
  process.exit(1);
});
