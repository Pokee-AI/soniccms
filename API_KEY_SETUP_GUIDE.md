# Complete API Key Setup Guide for SonicJS

This guide will walk you through setting up API key authentication for your SonicJS blog post management system.

## Prerequisites

Before setting up the API key, you need to have your Cloudflare Workers environment properly configured:

1. **Cloudflare Account**: You need a Cloudflare account
2. **D1 Database**: Set up your D1 database
3. **KV Namespace**: Set up your KV namespace
4. **Environment Variables**: Configure all required environment variables

## Step 1: Generate a Secure API Key

Generate a secure 64-character API key using one of these methods:

### Option A: Using Node.js (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option B: Using OpenSSL
```bash
openssl rand -hex 32
```

### Option C: Online Generator
Visit [randomkeygen.com](https://randomkeygen.com/) and use a "CodeIgniter Encryption Keys" generator.

**Example generated key:** `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

## Step 2: Configure Your Environment

### 2.1 Update wrangler.toml

Make sure your `wrangler.toml` includes the API key:

```toml
name = "sonicjs"
main = "dist/_worker.js/index.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

# Your existing KV and D1 configurations...
kv_namespaces = [
  { binding = "KV", preview_id="YOUR_PREVIEW_ID", id = "YOUR_KV_ID" }
]

[[d1_databases]]
binding = "D1"
database_name = "sonicjs"
database_id = "YOUR_D1_ID"

[vars]
# ... your existing variables ...
API_KEY = "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
```

### 2.2 Set Up Cloudflare Resources

If you haven't already, create the required Cloudflare resources:

```bash
# Create D1 database
npx wrangler d1 create sonicjs

# Create KV namespace
npx wrangler kv namespace create sonicjs

# Apply database migrations
npm run up:prod
```

## Step 3: Deploy Your Changes

```bash
# Build the project
npm run build

# Deploy to Cloudflare Workers
npx wrangler deploy
```

## Step 4: Test the API Key

Once deployed, you can test the API key authentication with curl:

### Test 1: Create a Blog Post with X-API-Key Header

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/api/v1/generalPost \
  -H "Content-Type: application/json" \
  -H "X-API-Key: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456" \
  -d '{
    "data": {
      "seoTitle": "My First API Blog Post",
      "slug": "my-first-api-blog-post",
      "author": "API User",
      "content": "This blog post was created via API key authentication!",
      "summary": "A test post created using curl and API key",
      "status": "published",
      "category": "Technology",
      "tags": "api, testing, sonicjs"
    }
  }'
```

### Test 2: Create a Blog Post with Authorization Bearer Header

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/api/v1/generalPost \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456" \
  -d '{
    "data": {
      "seoTitle": "My Second API Blog Post",
      "slug": "my-second-api-blog-post",
      "author": "API User",
      "content": "Another blog post created via API key authentication!",
      "summary": "Another test post created using curl and API key",
      "status": "draft",
      "category": "Technology",
      "tags": "api, testing, sonicjs"
    }
  }'
```

## Step 5: Share with Your Team

### 5.1 Secure API Key Distribution

**DO NOT** commit the API key to version control. Instead:

1. **Share via secure channels**: Use encrypted messaging, password managers, or secure file sharing
2. **Document the key**: Keep it in a secure password manager or team secrets management system
3. **Set up environment variables**: For team members, set the API key as an environment variable

### 5.2 Team Usage Examples

Create a simple script for your team to use:

```bash
#!/bin/bash
# create-blog-post.sh

API_KEY="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
BASE_URL="https://your-worker.your-subdomain.workers.dev"

curl -X POST "$BASE_URL/api/v1/generalPost" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "data": {
      "seoTitle": "'"$1"'",
      "slug": "'"$2"'",
      "author": "'"$3"'",
      "content": "'"$4"'",
      "summary": "'"$5"'",
      "status": "published",
      "category": "Technology",
      "tags": "api, automation"
    }
  }'
```

Usage:
```bash
./create-blog-post.sh "Post Title" "post-title" "Author Name" "Post content here" "Post summary"
```

## Step 6: Security Best Practices

### 6.1 API Key Security
- **Keep it secret**: Never expose the API key in client-side code
- **Use HTTPS**: Always use HTTPS in production
- **Rotate regularly**: Change the API key periodically
- **Monitor usage**: Keep track of API usage for security

### 6.2 Access Control
- **Limit permissions**: The API key only allows create/update operations
- **Admin-only delete**: Only admins can delete posts via the web interface
- **Field restrictions**: Some fields have additional access controls

## Step 7: Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check that your API key is correct and matches the environment variable
2. **400 Bad Request**: Ensure all required fields are provided
3. **500 Internal Server Error**: Check your Cloudflare Workers logs

### Debugging

Enable debug logging by checking the Cloudflare Workers logs:

```bash
npx wrangler tail
```

## Step 8: Production Considerations

### 8.1 Environment Variables
- Set `TESTING_MODE = false` in production
- Use a strong, unique API key
- Configure proper email settings
- Set up proper cache settings

### 8.2 Monitoring
- Monitor API usage patterns
- Set up alerts for unusual activity
- Log all API key usage for audit purposes

## Example Response

When successful, you'll receive a response like this:

```json
{
  "data": {
    "id": "generated-uuid",
    "seoTitle": "My First API Blog Post",
    "slug": "my-first-api-blog-post",
    "author": "API User",
    "content": "This blog post was created via API key authentication!",
    "status": "published",
    "createdOn": 1703123456789,
    "updatedOn": 1703123456789
  }
}
```

## Next Steps

1. **Test thoroughly**: Make sure both session-based and API key authentication work
2. **Document for team**: Share this guide with your team members
3. **Set up monitoring**: Monitor API usage and performance
4. **Plan for scaling**: Consider rate limiting and usage quotas for production

Your SonicJS blog post management system now supports both web-based admin interface and programmatic API access with secure API key authentication!
