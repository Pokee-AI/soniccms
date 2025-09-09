import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { auditSchema } from "@schema/audit";
import { isAdminOrEditor, isAdminOrUser, isAdmin } from "../../../db/config-helpers";
import type { ApiConfig } from "../../../db/routes";

export const tableName = "generalPost";

export const route = "generalPost";
export const name = "General Posts";
export const icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>`;

export const definition = {
  id: text("id").primaryKey(),
  
  // Required SEO fields
  seoTitle: text("seoTitle").notNull(),
  slug: text("slug").notNull().unique(),
  datePosted: integer("datePosted").notNull(), // Unix timestamp
  
  // Basic content fields
  author: text("author").notNull(),
  summary: text("summary"),
  content: text("content"), // Main content area
  
  // SEO and metadata
  metaDescription: text("metaDescription"),
  tags: text("tags"), // Comma-separated tags
  category: text("category"),
  
  // Media fields - flexible for different types of content
  mediaUrls: text("mediaUrls"), // Comma-separated URLs for file uploads
  mediaCaptions: text("mediaCaptions"), // JSON array of media captions
  
  // Additional content sections - flexible text areas
  introduction: text("introduction"),
  conclusion: text("conclusion"),
  
  // Status field - moved to the end
  status: text("status").$type<"draft" | "published" | "archived">().default("draft"),
};

export const table = sqliteTable(
  tableName,
  {
    ...definition,
    ...auditSchema,
  },
  (table) => {
    return {
      slugIndex: index("generalPostSlugIndex").on(table.slug),
      statusIndex: index("generalPostStatusIndex").on(table.status),
      categoryIndex: index("generalPostCategoryIndex").on(table.category),
      datePostedIndex: index("generalPostDatePostedIndex").on(table.datePosted),
    };
  }
);

export const relation = relations(table, ({ }) => ({
  // No relations needed for this simplified schema
}));

export const access: ApiConfig["access"] = {
  operation: {
    read: true,           // Public read access
    create: isAdminOrEditor,  // Only admins/editors can create
    update: isAdminOrEditor,  // Only admins/editors can update
    delete: isAdmin,      // Only admins can delete
  },
  fields: {
    // Add field-level restrictions
    id: {
      read: true,
      update: false,      // ID should never change
    },
    createdOn: {
      read: true,
      update: false,      // Creation date should never change
    },
    updatedOn: {
      read: true,
      update: isAdminOrEditor,  // Only admins/editors can modify
    },
    status: {
      read: true,
      update: isAdminOrEditor,  // Publishing status control
    }
  },
};

export const hooks: ApiConfig["hooks"] = {
  resolveInput: {
    create: (ctx, data) => {
      // Set current timestamp if datePosted is not provided
      if (!data.datePosted) {
        data.datePosted = Date.now();
      } else if (typeof data.datePosted === "string") {
        data.datePosted = new Date(data.datePosted).getTime();
      }
      
      // Set default author if not provided
      if (!data.author) {
        data.author = "Admin";
      }
      
      // Set default content if not provided
      if (!data.content) {
        data.content = "Write your content here...";
      }
      
      return data;
    },
    update: (ctx, id, data) => {
      // Convert date to timestamp if it's a string
      if (data.datePosted && typeof data.datePosted === "string") {
        data.datePosted = new Date(data.datePosted).getTime();
      }
      return data;
    },
  },
};3

export const fields: ApiConfig["fields"] = {
  // Basic fields
  id: {
    type: "id",
  },
  seoTitle: {
    type: "textField",
    hint: "SEO-optimized title that will appear in search results and browser tabs. Keep it under 60 characters for best results.",
  },
  slug: {
    type: "textField",
    hint: "URL-friendly version of the title (e.g., 'my-awesome-post'). Use lowercase letters, numbers, and hyphens only. This will be the post's URL.",
  },
  author: {
    type: "textField",
    hint: "Name of the post author. This will be displayed publicly with the post.",
  },
  datePosted: {
    type: "datetime",
    hint: "Publication date and time. This determines when the post appears in chronological listings.",
  },
  
  // Content fields
  summary: {
    type: "textArea",
    hint: "Brief summary or excerpt of the post. This often appears in post listings and social media previews.",
  },
  content: {
    type: "textArea",
    hint: "Main content of your post. Write your full article content here. You can use basic HTML formatting if needed.",
  },
  introduction: {
    type: "textArea",
    hint: "Optional introduction section that appears before the main content. Use this to hook readers or provide context.",
  },
  conclusion: {
    type: "textArea",
    hint: "Optional conclusion section that appears after the main content. Use this to summarize key points or call for action.",
  },
  
  // SEO fields
  metaDescription: {
    type: "textArea",
    hint: "Meta description for search engines. This appears in search results under your title. Keep it between 150-160 characters.",
  },
  tags: {
    type: "textField",
    hint: "Comma-separated tags to categorize your post (e.g., 'technology, web development, tutorial'). These help with organization and discovery.",
  },
  category: {
    type: "textField",
    hint: "Main category for this post (e.g., 'Technology', 'Lifestyle', 'News'). Helps organize content into broad topics.",
  },
  
  // Media fields
  mediaUrls: {
    type: "textField",
    hint: "Upload images, videos, or other media files. Multiple files can be uploaded and will be stored as comma-separated URLs.",
  },
  mediaCaptions: {
    type: "textArea",
    hint: "JSON array of captions for the media URLs. Should match the order of mediaUrls. Format: [\"caption1\", \"caption2\", \"caption3\"]",
  },
  
  // Status field - moved to the end
  status: {
    type: "textField",
    hint: "Post status: 'draft' (not visible to public), 'published' (visible to everyone), or 'archived' (hidden but preserved).",
  },
};
