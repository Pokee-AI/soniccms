#!/bin/bash

# Test script for SonicJS API Key Authentication
# This script demonstrates how to create blog posts using API key authentication

# Configuration
API_KEY="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
BASE_URL="https://sonicjs.pokee-ai-internal.workers.dev"

echo "🚀 Testing SonicJS API Key Authentication"
echo "========================================"
echo ""

# Test 1: Create a blog post using X-API-Key header
echo "📝 Test 1: Creating blog post with X-API-Key header"
echo "--------------------------------------------------"

curl -X POST "$BASE_URL/api/v1/generalPost" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "data": {
      "seoTitle": "API Test Post - X-API-Key Header",
      "slug": "api-test-post-x-api-key-header",
      "author": "API Test User",
      "content": "This blog post was created using the X-API-Key header method. The API key authentication is working correctly!",
      "summary": "A test post created using X-API-Key header authentication",
      "status": "published",
      "category": "Technology",
      "tags": "api, testing, sonicjs, x-api-key"
    }
  }' \
  -w "\n\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s

echo ""
echo ""

# Test 2: Create a blog post using Authorization Bearer header
echo "📝 Test 2: Creating blog post with Authorization Bearer header"
echo "-------------------------------------------------------------"

curl -X POST "$BASE_URL/api/v1/generalPost" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "data": {
      "seoTitle": "API Test Post - Authorization Bearer",
      "slug": "api-test-post-authorization-bearer",
      "author": "API Test User",
      "content": "This blog post was created using the Authorization Bearer header method. Both authentication methods are working!",
      "summary": "A test post created using Authorization Bearer header authentication",
      "status": "draft",
      "category": "Technology",
      "tags": "api, testing, sonicjs, authorization-bearer"
    }
  }' \
  -w "\n\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s

echo ""
echo ""

# Test 3: Test without API key (should fail)
echo "❌ Test 3: Attempting to create post without API key (should fail)"
echo "----------------------------------------------------------------"

curl -X POST "$BASE_URL/api/v1/generalPost" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "seoTitle": "Unauthorized Test Post",
      "slug": "unauthorized-test-post",
      "author": "Unauthorized User",
      "content": "This should fail because no API key is provided.",
      "summary": "This request should be rejected",
      "status": "draft"
    }
  }' \
  -w "\n\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s

echo ""
echo ""

# Test 4: Test with wrong API key (should fail)
echo "❌ Test 4: Attempting to create post with wrong API key (should fail)"
echo "-------------------------------------------------------------------"

curl -X POST "$BASE_URL/api/v1/generalPost" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: wrong-api-key-12345" \
  -d '{
    "data": {
      "seoTitle": "Wrong Key Test Post",
      "slug": "wrong-key-test-post",
      "author": "Wrong Key User",
      "content": "This should fail because the API key is incorrect.",
      "summary": "This request should be rejected due to wrong API key",
      "status": "draft"
    }
  }' \
  -w "\n\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s

echo ""
echo ""

echo "🎉 API Key Testing Complete!"
echo "============================"
echo ""
echo "Expected Results:"
echo "- Tests 1 & 2: Should return HTTP 201 (Created) with blog post data"
echo "- Tests 3 & 4: Should return HTTP 401 (Unauthorized)"
echo ""
echo "If you see different results, check:"
echo "1. Your API key is correctly set in the environment"
echo "2. Your deployment URL is correct"
echo "3. Your Cloudflare Workers deployment is successful"
echo "4. The API_KEY environment variable is properly configured"
