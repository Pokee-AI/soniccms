# Form Field Hints

The SonicCMS form system supports helpful hint text for each field to guide users in creating high-quality content.

## How to Add Hints

In your schema's `fields` definition, add a `hint` property to any field:

```typescript
export const fields: ApiConfig["fields"] = {
  seoTitle: {
    type: "textField",
    hint: "SEO-optimized title that will appear in search results. Keep it under 60 characters for best results.",
  },
  content: {
    type: "textArea",
    hint: "Main content of your post. Write your full article content here. You can use basic HTML formatting if needed.",
  },
  tags: {
    type: "textField",
    hint: "Comma-separated tags to categorize your post (e.g., 'technology, web development, tutorial').",
  },
  mediaUrls: {
    type: "textArea",
    hint: "JSON array of additional media URLs (images, videos, etc.). Format: [\"url1\", \"url2\", \"url3\"]",
  },
};
```

## Hint Best Practices

### 1. **Be Specific and Actionable**
- ❌ "Enter a title"
- ✅ "SEO-optimized title that will appear in search results and browser tabs. Keep it under 60 characters for best results."

### 2. **Explain the Purpose**
- ❌ "Enter tags"
- ✅ "Comma-separated tags to categorize your post. These help with organization and discovery."

### 3. **Provide Format Examples**
- ❌ "Enter media URLs"
- ✅ "JSON array of additional media URLs (images, videos, etc.). Format: [\"url1\", \"url2\", \"url3\"]"

### 4. **Include Best Practices**
- ❌ "Enter a description"
- ✅ "Meta description for search engines. This appears in search results under your title. Keep it between 150-160 characters."

### 5. **Explain Technical Requirements**
- ❌ "Enter a slug"
- ✅ "URL-friendly version of the title (e.g., 'my-awesome-post'). Use lowercase letters, numbers, and hyphens only. This will be the post's URL."

## Supported Field Types

Hints work with all field types:
- `textField` - Single-line text input
- `textArea` - Multi-line text input
- `datetime` - Date/time picker
- `file` - File upload
- `password` - Password input
- `ckeditor` - Rich text editor
- `quill` - Quill editor

## Example: Complete Field Definition

```typescript
export const fields: ApiConfig["fields"] = {
  // Basic fields with hints
  title: {
    type: "textField",
    hint: "The main title of your post. Make it engaging and descriptive.",
  },
  slug: {
    type: "textField",
    hint: "URL-friendly version of the title. Use lowercase letters, numbers, and hyphens only.",
  },
  content: {
    type: "textArea",
    hint: "Main content of your post. Write your full article content here.",
  },
  featuredImage: {
    type: "textField",
    hint: "URL of the featured image for this post. This image will be displayed prominently.",
  },
  tags: {
    type: "textField",
    hint: "Comma-separated tags to categorize your post (e.g., 'technology, tutorial, web development').",
  },
  publishDate: {
    type: "datetime",
    hint: "When this post should be published. Leave empty to publish immediately.",
  },
};
```

## Visual Appearance

Hints appear as small gray text below each form field, providing context without cluttering the interface. They help users understand:

- What each field is for
- How to format their input
- What the field will be used for
- Best practices for that specific field

This makes the admin interface much more user-friendly, especially for non-technical users who might not understand the purpose of each field.
