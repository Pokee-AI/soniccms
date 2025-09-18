import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { auditSchema } from "@schema/audit";
import { isAdminOrEditor, isAdminOrUser, isAdmin, isAdminOrEditorOrApiKey } from "../../../db/config-helpers";
import type { ApiConfig } from "../../../db/routes";

export const tableName = "comparisonPosts";

export const route = "comparisonPosts";
export const name = "Comparison Posts";
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
      
      // Set default status to 'draft' if not provided or empty
      if (!data.status || data.status.trim() === "") {
        data.status = "draft";
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
    label: "SEO Title",
    hint: "SEO-optimized title for the comparison post. Keep it under 60 characters and include the main comparison terms.",
  },
  slug: {
    type: "textField",
    label: "Slug",
    hint: "URL-friendly version of the title (e.g., 'pokee-ai-vs-competitor-comparison'). Use lowercase letters, numbers, and hyphens only.",
  },
  author: {
    type: "textField",
    label: "Author",
    hint: "Name of the comparison author. This will be displayed publicly with the post.",
  },
  datePosted: {
    type: "datetime",
    label: "Publication Date",
    hint: "Publication date and time for the comparison post. This determines when it appears in chronological listings.",
  },
  summary: {
    type: "textArea",
    label: "Summary",
    hint: "Brief summary of the comparison. This appears in post listings and social media previews.",
  },
  introFraming: {
    type: "textArea",
    label: "Introduction Framing",
    hint: "Introduction that frames the comparison and explains why this comparison matters to readers.",
  },
  useCaseContext: {
    type: "textArea",
    label: "Use Case Context",
    hint: "Describe the specific use cases or scenarios where this comparison is most relevant.",
  },
  promptText: {
    type: "textArea",
    label: "Prompt Text",
  },
  promptAnalysis: {
    type: "textArea",
    label: "Prompt Analysis",
  },
  
  // PokeeAI fields
  pokeeAiName: {
    type: "textField",
    label: "PokeeAI Name",
  },
  pokeeAiAnalysis: {
    type: "textArea",
    label: "PokeeAI Analysis",
  },
  pokeeAiMediaUrls: {
    type: "textField",
    label: "PokeeAI Media Files",
  },
  pokeeAiMediaCaptions: {
    type: "textArea",
    label: "PokeeAI Media Captions",
  },
  
  // PokeeAI performance metrics
  pokeeAiMetric1: {
    type: "textField",
    label: "PokeeAI Metric 1",
  },
  pokeeAiValue1: {
    type: "textField",
    label: "PokeeAI Value 1",
  },
  pokeeAiSource1: {
    type: "textField",
    label: "PokeeAI Source 1",
  },
  pokeeAiMetric2: {
    type: "textField",
    label: "PokeeAI Metric 2",
  },
  pokeeAiValue2: {
    type: "textField",
    label: "PokeeAI Value 2",
  },
  pokeeAiSource2: {
    type: "textField",
    label: "PokeeAI Source 2",
  },
  pokeeAiMetric3: {
    type: "textField",
    label: "PokeeAI Metric 3",
  },
  pokeeAiValue3: {
    type: "textField",
    label: "PokeeAI Value 3",
  },
  pokeeAiSource3: {
    type: "textField",
    label: "PokeeAI Source 3",
  },
  
  // Competitor fields
  competitor1Name: {
    type: "textField",
    label: "Competitor 1 Name",
  },
  competitor1Analysis: {
    type: "textArea",
    label: "Competitor 1 Analysis",
  },
  competitor1MediaUrls: {
    type: "textField",
    label: "Competitor 1 Media Files",
  },
  competitor1MediaCaptions: {
    type: "textArea",
    label: "Competitor 1 Media Captions",
  },
  
  // Competitor 1 performance metrics
  competitor1Metric1: {
    type: "textField",
    label: "Competitor 1 Metric 1",
  },
  competitor1Value1: {
    type: "textField",
    label: "Competitor 1 Value 1",
  },
  competitor1Source1: {
    type: "textField",
    label: "Competitor 1 Source 1",
  },
  competitor1Metric2: {
    type: "textField",
    label: "Competitor 1 Metric 2",
  },
  competitor1Value2: {
    type: "textField",
    label: "Competitor 1 Value 2",
  },
  competitor1Source2: {
    type: "textField",
    label: "Competitor 1 Source 2",
  },
  competitor1Metric3: {
    type: "textField",
    label: "Competitor 1 Metric 3",
  },
  competitor1Value3: {
    type: "textField",
    label: "Competitor 1 Value 3",
  },
  competitor1Source3: {
    type: "textField",
    label: "Competitor 1 Source 3",
  },
  
  competitor2Name: {
    type: "textField",
    label: "Competitor 2 Name",
  },
  competitor2Analysis: {
    type: "textArea",
    label: "Competitor 2 Analysis",
  },
  competitor2MediaUrls: {
    type: "textField",
    label: "Competitor 2 Media Files",
  },
  competitor2MediaCaptions: {
    type: "textArea",
    label: "Competitor 2 Media Captions",
  },
  
  // Competitor 2 performance metrics
  competitor2Metric1: {
    type: "textField",
    label: "Competitor 2 Metric 1",
  },
  competitor2Value1: {
    type: "textField",
    label: "Competitor 2 Value 1",
  },
  competitor2Source1: {
    type: "textField",
    label: "Competitor 2 Source 1",
  },
  competitor2Metric2: {
    type: "textField",
    label: "Competitor 2 Metric 2",
  },
  competitor2Value2: {
    type: "textField",
    label: "Competitor 2 Value 2",
  },
  competitor2Source2: {
    type: "textField",
    label: "Competitor 2 Source 2",
  },
  competitor2Metric3: {
    type: "textField",
    label: "Competitor 2 Metric 3",
  },
  competitor2Value3: {
    type: "textField",
    label: "Competitor 2 Value 3",
  },
  competitor2Source3: {
    type: "textField",
    label: "Competitor 2 Source 3",
  },
  
  competitor3Name: {
    type: "textField",
    label: "Competitor 3 Name",
  },
  competitor3Analysis: {
    type: "textArea",
    label: "Competitor 3 Analysis",
  },
  competitor3MediaUrls: {
    type: "textField",
    label: "Competitor 3 Media Files",
  },
  competitor3MediaCaptions: {
    type: "textArea",
    label: "Competitor 3 Media Captions",
  },
  
  // Competitor 3 performance metrics
  competitor3Metric1: {
    type: "textField",
    label: "Competitor 3 Metric 1",
  },
  competitor3Value1: {
    type: "textField",
    label: "Competitor 3 Value 1",
  },
  competitor3Source1: {
    type: "textField",
    label: "Competitor 3 Source 1",
  },
  competitor3Metric2: {
    type: "textField",
    label: "Competitor 3 Metric 2",
  },
  competitor3Value2: {
    type: "textField",
    label: "Competitor 3 Value 2",
  },
  competitor3Source2: {
    type: "textField",
    label: "Competitor 3 Source 2",
  },
  competitor3Metric3: {
    type: "textField",
    label: "Competitor 3 Metric 3",
  },
  competitor3Value3: {
    type: "textField",
    label: "Competitor 3 Value 3",
  },
  competitor3Source3: {
    type: "textField",
    label: "Competitor 3 Source 3",
  },
  
  conclusion: {
    type: "textArea",
    label: "Conclusion",
  },
  
  // Key takeaways fields
  keyTakeaway1: {
    type: "textField",
    label: "Key Takeaway 1",
  },
  keyTakeaway2: {
    type: "textField",
    label: "Key Takeaway 2",
  },
  keyTakeaway3: {
    type: "textField",
    label: "Key Takeaway 3",
  },
  keyTakeaway4: {
    type: "textField",
    label: "Key Takeaway 4",
  },
  keyTakeaway5: {
    type: "textField",
    label: "Key Takeaway 5",
  },
  
  // FAQ fields
  faq1Question: {
    type: "textField",
    label: "FAQ 1 Question",
  },
  faq1Answer: {
    type: "textArea",
    label: "FAQ 1 Answer",
  },
  faq2Question: {
    type: "textField",
    label: "FAQ 2 Question",
  },
  faq2Answer: {
    type: "textArea",
    label: "FAQ 2 Answer",
  },
  faq3Question: {
    type: "textField",
    label: "FAQ 3 Question",
  },
  faq3Answer: {
    type: "textArea",
    label: "FAQ 3 Answer",
  },
  faq4Question: {
    type: "textField",
    label: "FAQ 4 Question",
  },
  faq4Answer: {
    type: "textArea",
    label: "FAQ 4 Answer",
  },
  faq5Question: {
    type: "textField",
    label: "FAQ 5 Question",
  },
  faq5Answer: {
    type: "textArea",
    label: "FAQ 5 Answer",
  },
  faq6Question: {
    type: "textField",
    label: "FAQ 6 Question",
  },
  faq6Answer: {
    type: "textArea",
    label: "FAQ 6 Answer",
  },
  faq7Question: {
    type: "textField",
    label: "FAQ 7 Question",
  },
  faq7Answer: {
    type: "textArea",
    label: "FAQ 7 Answer",
  },
  faq8Question: {
    type: "textField",
    label: "FAQ 8 Question",
  },
  faq8Answer: {
    type: "textArea",
    label: "FAQ 8 Answer",
  },
  faq9Question: {
    type: "textField",
    label: "FAQ 9 Question",
  },
  faq9Answer: {
    type: "textArea",
    label: "FAQ 9 Answer",
  },
  faq10Question: {
    type: "textField",
    label: "FAQ 10 Question",
  },
  faq10Answer: {
    type: "textArea",
    label: "FAQ 10 Answer",
  },
  
  relatedComparisons: {
    type: "textArea",
    label: "Related Comparisons",
  },
  status: {
    type: "textField",
    label: "Status",
  },
};

