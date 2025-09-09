# General Post Schema

The `generalPost` schema is a simplified blog post schema designed for general-purpose content creation. It provides a flexible structure for creating blog posts without the complex comparison structure of the main `blogPosts` schema.

## Key Features

### Required Fields
- `seoTitle` - SEO-optimized title for the post
- `slug` - URL-friendly identifier (unique)
- `datePosted` - Publication date (Unix timestamp)
- `status` - Post status (draft, published, archived)
- `author` - Post author name

### SEO Fields
- `metaDescription` - Meta description for search engines
- `tags` - Comma-separated tags for categorization
- `category` - Post category
- `socialTitle` - Custom title for social sharing
- `socialDescription` - Custom description for social sharing

### Content Fields
- `summary` - Post summary/excerpt
- `content` - Main post content
- `introduction` - Introduction section
- `conclusion` - Conclusion section

### Media Fields
- `featuredImage` - URL to featured image
- `featuredImageAlt` - Alt text for featured image
- `mediaUrls` - JSON array of additional media URLs
- `mediaCaptions` - JSON array of media captions

### Custom Fields
- `customField1` through `customField5` - Flexible text areas for custom content

### Related Content
- `relatedPosts` - JSON array of related post IDs

## Usage

The schema is automatically registered in the admin interface and can be accessed at:
- **List/Table View**: `/admin/tables/generalPost`
- **Create New Post**: `/admin/forms/generalPost`
- **Edit Post**: `/admin/forms/generalPost/[id]`

## API Endpoints

- **GET** `/api/v1/generalPost` - List all posts
- **GET** `/api/v1/generalPost/[id]` - Get specific post
- **POST** `/api/v1/generalPost` - Create new post
- **PUT** `/api/v1/generalPost/[id]` - Update post
- **DELETE** `/api/v1/generalPost/[id]` - Delete post

## Access Control

- **Read**: Public (anyone can read published posts)
- **Create**: Admin or Editor roles
- **Update**: Admin or Editor roles
- **Delete**: Admin role only

## Database Indexes

The schema includes optimized indexes for:
- `slug` (unique)
- `status`
- `category`
- `datePosted`

## TypeScript Support

Type definitions are available in `/src/types/generalPost.ts`:
- `GeneralPost` - Main interface
- `GeneralPostCreateInput` - For creating new posts
- `GeneralPostUpdateInput` - For updating existing posts
- `GeneralPostStatus` - Status type union

## Form Hints

Each field in the admin form includes helpful hint text that explains:
- What the field is for
- How to use it effectively
- Best practices and recommendations
- Format requirements (e.g., JSON arrays, character limits)

The hints appear below each form field to guide users in creating high-quality content.
