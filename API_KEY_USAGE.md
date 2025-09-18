# API Key Authentication for SonicJS

This document explains how to use API key authentication to create blog posts via curl requests.

## Setup

1. **Set your API key** in your `wrangler.toml` file:
   ```toml
   [vars]
   API_KEY = "your-secure-api-key-here"
   ```

2. **Deploy your changes** to Cloudflare Workers:
   ```bash
   npm run build
   npx wrangler deploy
   ```

## Usage

### Creating a Blog Post via API Key

You can now create blog posts using curl with either of these header formats:

#### Option 1: Using X-API-Key header
```bash
curl -X POST https://soniccms.pages.dev/api/v1/generalPost \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-api-key-here" \
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

#### Option 2: Using Authorization Bearer header
```bash
curl -X POST https://soniccms.pages.dev/api/v1/generalPost \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secure-api-key-here" \
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

### Required Fields

The following fields are required for creating a blog post:
- `seoTitle`: The title of the blog post
- `slug`: URL-friendly version of the title (must be unique)
- `author`: Name of the post author
- `content`: Main content of the post

### Optional Fields

- `summary`: Brief summary or excerpt
- `introduction`: Introduction section
- `conclusion`: Conclusion section
- `metaDescription`: Meta description for SEO
- `tags`: Comma-separated tags
- `category`: Main category
- `coverMediaUrl`: URL to cover image
- `mediaUrls`: Comma-separated media URLs
- `mediaCaptions`: JSON array of media captions
- `status`: "draft", "published", or "archived" (defaults to "draft")
- `datePosted`: Unix timestamp (defaults to current time if not provided)

## Security Notes

- **Keep your API key secure** - treat it like a password
- **Use HTTPS** in production to prevent API key interception
- **Rotate your API key** periodically for security
- **Monitor API usage** to detect any unauthorized access

## Admin Panel Access

The admin panel at https://soniccms.pages.dev/admin continues to work with session-based authentication. Users can still log in with their admin/editor credentials and create posts through the web interface.

## Error Responses

- **401 Unauthorized**: Invalid or missing API key
- **400 Bad Request**: Invalid data format or missing required fields
- **500 Internal Server Error**: Server-side error

## Example Response

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
