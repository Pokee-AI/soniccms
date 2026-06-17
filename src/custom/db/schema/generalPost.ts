import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { auditSchema } from "@schema/audit";
import { isAdminOrEditor, isAdminOrUser, isAdmin, isAdminOrEditorOrApiKey } from "../../../db/config-helpers";
import type { ApiConfig } from "../../../db/routes";

export const tableName = "generalPost";

export const route = "generalPost";
export const name = "Blog Posts";
export const icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>`;

export const definition = {
  id: text("id").primaryKey(),
  
  // Required SEO fields
  seoTitle: text("seoTitle").notNull(),
  coverMediaUrl: text("coverMediaUrl"), // Cover image for the blog post
  slug: text("slug").notNull().unique(),
  datePosted: integer("datePosted").notNull(), // Unix timestamp
  
  // Basic content fields
  author: text("author").notNull(),
  tags: text("tags"), // Comma-separated tags
  category: text("category"),
  summary: text("summary"),
  introduction: text("introduction"),
  content: text("content"), // Main content area
  
  // SEO and metadata
  metaDescription: text("metaDescription"),
  
  // Media fields - flexible for different types of content
  mediaUrls: text("mediaUrls"), // Comma-separated URLs for file uploads
  mediaCaptions: text("mediaCaptions"), // JSON array of media captions
  
  // Additional content sections - flexible text areas
  conclusion: text("conclusion"),
  
  // Comparison post fields
  competitorName: text("competitorName"), // Optional: competitor name for comparison posts (e.g., "Make.com", "Lovable")

  // Integration post fields
  integrationName: text("integrationName"), // Optional: integration/service name for integration posts (e.g., "Gmail", "Slack")

  // Card display fields
  hook: text("hook"), // Optional: short teaser text shown on blog cards instead of summary (1-2 sentences)

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
    create: isAdminOrEditorOrApiKey,  // Admins/editors or API key can create
    update: isAdminOrEditorOrApiKey,  // Admins/editors or API key can update
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
      update: isAdminOrEditorOrApiKey,  // Admins/editors or API key can modify
    },
    status: {
      read: true,
      update: isAdminOrEditorOrApiKey,  // Publishing status control
    }
  },
};

// Normalize any datePosted input into a unix-millisecond integer so the value
// is consistent no matter how it was written (an agent via the API, or the CMS
// date field):
//   - number in ms (≈1.7e12)              -> kept
//   - number in seconds (≈1.7e9)          -> ×1000
//   - numeric string                      -> same rules
//   - ISO / datetime-local ("2026-06-17T23:52") -> parsed to ms
//   - unparseable                         -> undefined (caller falls back)
const toTimestamp = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "number") {
    if (Number.isNaN(value)) return undefined;
    return value < 1e11 ? Math.round(value * 1000) : Math.round(value);
  }
  const str = String(value).trim();
  if (/^\d+$/.test(str)) {
    const n = Number(str);
    return n < 1e11 ? n * 1000 : n;
  }
  const ms = new Date(str).getTime();
  return Number.isNaN(ms) ? undefined : ms;
};

export const hooks: ApiConfig["hooks"] = {
  resolveInput: {
    create: (ctx, data) => {
      // Always store datePosted as a unix-ms integer; default to now.
      data.datePosted = toTimestamp(data.datePosted) ?? Date.now();

      if (!data.author) {
        data.author = "Admin";
      }
      if (!data.content) {
        data.content = "Write your content here...";
      }
      if (!data.status || data.status.trim() === "") {
        data.status = "draft";
      }
      return data;
    },
    update: (ctx, id, data) => {
      // Only touch datePosted when the update includes it; normalize to ms so
      // a datetime-local string from the form never gets stored verbatim.
      if (data.datePosted !== undefined && data.datePosted !== null) {
        const ts = toTimestamp(data.datePosted);
        if (ts !== undefined) {
          data.datePosted = ts;
        }
      }
      return data;
    },
  },
};

// Columns shown in the admin list view (in order). Keeps the table scannable
// instead of dumping all ~18 fields. Everything else stays editable in the form.
export const listFields = [
  "seoTitle",
  "status",
  "category",
  "author",
  "datePosted",
];

export const fields: ApiConfig["fields"] = {
  // Basic fields
  id: {
    type: "id",
  },
  seoTitle: {
    type: "textField",
    label: "SEO Title",
    hint: "Title that will appear in search results and browser tabs. Keep it under 60 characters for best results.",
  },
  coverMediaUrl: {
    type: "textField",
    label: "Cover Image",
    hint: "The cover iamge. Only one image is allowed. This will be displayed prominently at the top of the post and in post listings.",
  },
  slug: {
    type: "textField",
    label: "Slug",
    hint: "URL-friendly version of the title (e.g., 'my-awesome-post'). Use lowercase letters, numbers, and hyphens only. This will be the post's URL.",
  },
  author: {
    type: "textField",
    label: "Author",
    hint: "Name of the post author. This will be displayed publicly with the post.",
  },
  datePosted: {
    type: "datetime",
    label: "Publication Date",
    hint: "Publication date and time. This determines when the post appears in chronological listings.",
  },
  
  // Content fields
  summary: {
    type: "textArea",
    label: "Summary",
    hint: "Brief summary or excerpt of the post.",
  },
  content: {
    type: "textArea",
    label: "Content",
    hint: "Main content of your post. Write your full article content here. You can use basic HTML formatting if needed.",
  },
  introduction: {
    type: "textArea",
    label: "Introduction",
    hint: "Optional introduction section that appears before the main content. Use this to hook readers or provide context.",
  },
  conclusion: {
    type: "textArea",
    label: "Conclusion",
    hint: "Optional conclusion section that appears after the main content. Use this to summarize key points or call for action.",
  },
  
  // SEO fields
  metaDescription: {
    type: "textArea",
    label: "Meta Description",
    hint: "Meta description for search engines. This appears in search results under your title. Keep it between 150-160 characters.",
  },
  tags: {
    type: "textField",
    label: "Tags",
    hint: "Comma-separated tags to categorize your post (e.g., 'technology, web development, tutorial'). These help with organization and discovery.",
  },
  category: {
    type: "select",
    label: "Category",
    options: ["Insights", "Integrations", "Use Cases"],
    hint: "Which blog tab this post appears under. 'Integrations' and 'Use Cases' have their own tabs; anything else shows under Insights. (Comparisons are detected automatically when you fill in 'Competitor Name'.)",
  },
  
  // Media fields
  mediaUrls: {
    type: "textField",
    label: "Media Files",
    hint: "Upload images, videos, or other media files. Multiple files can be uploaded.",
  },
  mediaCaptions: {
    type: "textArea",
    label: "Media Captions",
    hint: "JSON array of captions for the media URLs. Should match the order of media files. Format: [\"caption1\", \"caption2\", \"caption3\"]",
  },
  
  // Comparison post fields
  competitorName: {
    type: "textField",
    label: "Competitor Name",
    hint: "Optional. For comparison posts, the name of the competitor being compared (e.g., 'Make.com', 'Lovable'). Used to display the competitor icon on the blog card.",
  },

  // Integration post fields
  integrationName: {
    type: "textField",
    label: "Integration Name",
    hint: "Optional. For integration posts, the service name (e.g., 'Gmail', 'Slack', 'HubSpot'). Used to display the integration icon on the blog card.",
  },

  // Card display fields
  hook: {
    type: "textArea",
    label: "Hook",
    hint: "Optional. Short teaser text (1-2 sentences) shown on blog cards instead of summary. Keep it punchy and action-oriented.",
  },

  // Status field - moved to the end
  status: {
    type: "select",
    label: "Status",
    options: ["draft", "published", "archived"],
    hint: "draft = not visible to the public (use Preview to see it). published = live on the blog. archived = hidden.",
  },
};
