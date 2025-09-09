import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { auditSchema } from "@schema/audit";
import { isAdminOrEditor, isAdminOrUser, isAdmin } from "../../../db/config-helpers";
import type { ApiConfig } from "../../../db/routes";

export const tableName = "blogPosts";

export const route = "blogPosts";
export const name = "Blog Posts";
export const icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 1 18 18a8.967 8.967 0 0 1-6 2.292m0-14.25v14.25" />
</svg>`;

export const definition = {
  id: text("id").primaryKey(),
  seoTitle: text("seoTitle").notNull(),
  slug: text("slug").notNull().unique(),
  author: text("author").notNull(),
  datePosted: integer("datePosted").notNull(), // Unix timestamp
  summary: text("summary"),
  introFraming: text("introFraming"),
  useCaseContext: text("useCaseContext"),
  promptText: text("promptText").notNull(),
  promptAnalysis: text("promptAnalysis").notNull(),
  
  // Flattened pokeeAi fields
  pokeeAiName: text("pokeeAiName").notNull(),
  pokeeAiAnalysis: text("pokeeAiAnalysis").notNull(),
  pokeeAiMediaUrls: text("pokeeAiMediaUrls"), // Comma-separated URLs
  pokeeAiMediaCaptions: text("pokeeAiMediaCaptions"), // JSON array of captions
  
  // PokeeAI performance metrics (up to 3)
  pokeeAiMetric1: text("pokeeAiMetric1"),
  pokeeAiValue1: text("pokeeAiValue1"),
  pokeeAiSource1: text("pokeeAiSource1"),
  pokeeAiMetric2: text("pokeeAiMetric2"),
  pokeeAiValue2: text("pokeeAiValue2"),
  pokeeAiSource2: text("pokeeAiSource2"),
  pokeeAiMetric3: text("pokeeAiMetric3"),
  pokeeAiValue3: text("pokeeAiValue3"),
  pokeeAiSource3: text("pokeeAiSource3"),
  
  // Flattened competitors fields (for first competitor)
  competitor1Name: text("competitor1Name").notNull(),
  competitor1Analysis: text("competitor1Analysis").notNull(),
  competitor1MediaUrls: text("competitor1MediaUrls"),
  competitor1MediaCaptions: text("competitor1MediaCaptions"),
  
  // Competitor 1 performance metrics (up to 3)
  competitor1Metric1: text("competitor1Metric1"),
  competitor1Value1: text("competitor1Value1"),
  competitor1Source1: text("competitor1Source1"),
  competitor1Metric2: text("competitor1Metric2"),
  competitor1Value2: text("competitor1Value2"),
  competitor1Source2: text("competitor1Source2"),
  competitor1Metric3: text("competitor1Metric3"),
  competitor1Value3: text("competitor1Value3"),
  competitor1Source3: text("competitor1Source3"),
  
  // Additional competitors (if needed)
  competitor2Name: text("competitor2Name"),
  competitor2Analysis: text("competitor2Analysis"),
  competitor2MediaUrls: text("competitor2MediaUrls"),
  competitor2MediaCaptions: text("competitor2MediaCaptions"),
  
  // Competitor 2 performance metrics (up to 3)
  competitor2Metric1: text("competitor2Metric1"),
  competitor2Value1: text("competitor2Value1"),
  competitor2Source1: text("competitor2Source1"),
  competitor2Metric2: text("competitor2Metric2"),
  competitor2Value2: text("competitor2Value2"),
  competitor2Source2: text("competitor2Source2"),
  competitor2Metric3: text("competitor2Metric3"),
  competitor2Value3: text("competitor2Value3"),
  competitor2Source3: text("competitor2Source3"),
  
  competitor3Name: text("competitor3Name"),
  competitor3Analysis: text("competitor3Analysis"),
  competitor3MediaUrls: text("competitor3MediaUrls"),
  competitor3MediaCaptions: text("competitor3MediaCaptions"),
  
  // Competitor 3 performance metrics (up to 3)
  competitor3Metric1: text("competitor3Metric1"),
  competitor3Value1: text("competitor3Value1"),
  competitor3Source1: text("competitor3Source1"),
  competitor3Metric2: text("competitor3Metric2"),
  competitor3Value2: text("competitor3Value2"),
  competitor3Source2: text("competitor3Source2"),
  competitor3Metric3: text("competitor3Metric3"),
  competitor3Value3: text("competitor3Value3"),
  competitor3Source3: text("competitor3Source3"),
  
  conclusion: text("conclusion").notNull(),
  
  // Flattened key takeaways (up to 5 key points)
  keyTakeaway1: text("keyTakeaway1"),
  keyTakeaway2: text("keyTakeaway2"),
  keyTakeaway3: text("keyTakeaway3"),
  keyTakeaway4: text("keyTakeaway4"),
  keyTakeaway5: text("keyTakeaway5"),
  
  // Flattened FAQs (up to 4 FAQ pairs)
  faq1Question: text("faq1Question"),
  faq1Answer: text("faq1Answer"),
  faq2Question: text("faq2Question"),
  faq2Answer: text("faq2Answer"),
  faq3Question: text("faq3Question"),
  faq3Answer: text("faq3Answer"),
  faq4Question: text("faq4Question"),
  faq4Answer: text("faq4Answer"),
  
  relatedComparisons: text("relatedComparisons"), // JSON array
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
      slugIndex: index("blogPostSlugIndex").on(table.slug),
      statusIndex: index("blogPostStatusIndex").on(table.status),
    };
  }
);

export const relation = relations(table, ({ }) => ({
  // No relations needed for this simplified schema
}));

export const access: ApiConfig["access"] = {
  operation: {
    read: true,           // Public read access (good)
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
      
      // Set default values for required fields if not provided
      if (!data.pokeeAiName) {
        data.pokeeAiName = "Pokee AI";
      }
      if (!data.pokeeAiAnalysis) {
        data.pokeeAiAnalysis = "Analysis of Pokee AI";
      }
      if (!data.competitor1Name) {
        data.competitor1Name = "Competitor 1";
      }
      if (!data.competitor1Analysis) {
        data.competitor1Analysis = "Analysis of competitor 1";
      }
      if (!data.conclusion) {
        data.conclusion = "Conclusion of the comparison";
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
};

export const fields: ApiConfig["fields"] = {
  id: {
    type: "id",
  },
  seoTitle: {
    type: "textField",
    hint: "SEO-optimized title for the comparison post. Keep it under 60 characters and include the main comparison terms.",
  },
  slug: {
    type: "textField",
    hint: "URL-friendly version of the title (e.g., 'pokee-ai-vs-competitor-comparison'). Use lowercase letters, numbers, and hyphens only.",
  },
  author: {
    type: "textField",
    hint: "Name of the comparison author. This will be displayed publicly with the post.",
  },
  datePosted: {
    type: "datetime",
    hint: "Publication date and time for the comparison post. This determines when it appears in chronological listings.",
  },
  summary: {
    type: "textArea",
    hint: "Brief summary of the comparison. This appears in post listings and social media previews.",
  },
  introFraming: {
    type: "textArea",
    hint: "Introduction that frames the comparison and explains why this comparison matters to readers.",
  },
  useCaseContext: {
    type: "textArea",
    hint: "Describe the specific use cases or scenarios where this comparison is most relevant.",
  },
  promptText: {
    type: "textArea",
  },
  promptAnalysis: {
    type: "textArea",
  },
  
  // PokeeAI fields
  pokeeAiName: {
    type: "textField",
  },
  pokeeAiAnalysis: {
    type: "textArea",
  },
  pokeeAiMediaUrls: {
    type: "textField",
  },
  pokeeAiMediaCaptions: {
    type: "textArea",
  },
  
  // PokeeAI performance metrics
  pokeeAiMetric1: {
    type: "textField",
  },
  pokeeAiValue1: {
    type: "textField",
  },
  pokeeAiSource1: {
    type: "textField",
  },
  pokeeAiMetric2: {
    type: "textField",
  },
  pokeeAiValue2: {
    type: "textField",
  },
  pokeeAiSource2: {
    type: "textField",
  },
  pokeeAiMetric3: {
    type: "textField",
  },
  pokeeAiValue3: {
    type: "textField",
  },
  pokeeAiSource3: {
    type: "textField",
  },
  
  // Competitor fields
  competitor1Name: {
    type: "textField",
  },
  competitor1Analysis: {
    type: "textArea",
  },
  competitor1MediaUrls: {
    type: "textField",
  },
  competitor1MediaCaptions: {
    type: "textArea",
  },
  
  // Competitor 1 performance metrics
  competitor1Metric1: {
    type: "textField",
  },
  competitor1Value1: {
    type: "textField",
  },
  competitor1Source1: {
    type: "textField",
  },
  competitor1Metric2: {
    type: "textField",
  },
  competitor1Value2: {
    type: "textField",
  },
  competitor1Source2: {
    type: "textField",
  },
  competitor1Metric3: {
    type: "textField",
  },
  competitor1Value3: {
    type: "textField",
  },
  competitor1Source3: {
    type: "textField",
  },
  
  competitor2Name: {
    type: "textField",
  },
  competitor2Analysis: {
    type: "textArea",
  },
  competitor2MediaUrls: {
    type: "textField",
  },
  competitor2MediaCaptions: {
    type: "textArea",
  },
  
  // Competitor 2 performance metrics
  competitor2Metric1: {
    type: "textField",
  },
  competitor2Value1: {
    type: "textField",
  },
  competitor2Source1: {
    type: "textField",
  },
  competitor2Metric2: {
    type: "textField",
  },
  competitor2Value2: {
    type: "textField",
  },
  competitor2Source2: {
    type: "textField",
  },
  competitor2Metric3: {
    type: "textField",
  },
  competitor2Value3: {
    type: "textField",
  },
  competitor2Source3: {
    type: "textField",
  },
  
  competitor3Name: {
    type: "textField",
  },
  competitor3Analysis: {
    type: "textArea",
  },
  competitor3MediaUrls: {
    type: "textField",
  },
  competitor3MediaCaptions: {
    type: "textArea",
  },
  
  // Competitor 3 performance metrics
  competitor3Metric1: {
    type: "textField",
  },
  competitor3Value1: {
    type: "textField",
  },
  competitor3Source1: {
    type: "textField",
  },
  competitor3Metric2: {
    type: "textField",
  },
  competitor3Value2: {
    type: "textField",
  },
  competitor3Source2: {
    type: "textField",
  },
  competitor3Metric3: {
    type: "textField",
  },
  competitor3Value3: {
    type: "textField",
  },
  competitor3Source3: {
    type: "textField",
  },
  
  conclusion: {
    type: "textArea",
  },
  
  // Key takeaways fields
  keyTakeaway1: {
    type: "textField",
  },
  keyTakeaway2: {
    type: "textField",
  },
  keyTakeaway3: {
    type: "textField",
  },
  keyTakeaway4: {
    type: "textField",
  },
  keyTakeaway5: {
    type: "textField",
  },
  
  // FAQ fields
  faq1Question: {
    type: "textField",
  },
  faq1Answer: {
    type: "textArea",
  },
  faq2Question: {
    type: "textField",
  },
  faq2Answer: {
    type: "textArea",
  },
  faq3Question: {
    type: "textField",
  },
  faq3Answer: {
    type: "textArea",
  },
  faq4Question: {
    type: "textField",
  },
  faq4Answer: {
    type: "textArea",
  },
  faq5Question: {
    type: "textField",
  },
  faq5Answer: {
    type: "textArea",
  },
  faq6Question: {
    type: "textField",
  },
  faq6Answer: {
    type: "textArea",
  },
  faq7Question: {
    type: "textField",
  },
  faq7Answer: {
    type: "textArea",
  },
  faq8Question: {
    type: "textField",
  },
  faq8Answer: {
    type: "textArea",
  },
  faq9Question: {
    type: "textField",
  },
  faq9Answer: {
    type: "textArea",
  },
  faq10Question: {
    type: "textField",
  },
  faq10Answer: {
    type: "textArea",
  },
  
  relatedComparisons: {
    type: "textArea",
  },
  status: {
    type: "textField",
  },
};

