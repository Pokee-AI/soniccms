// A type for a single media item (image or video) with its caption
export type MediaItem = {
  url: string;
  caption?: string; // Caption can be optional
  type?: 'image' | 'video'; // Media type, defaults to 'image' if not specified
  thumbnailUrl?: string; // Optional thumbnail for videos
};

export type PerformanceMetric = {
  metric: string;
  value: string;
  source?: string;
};

// A type for the result from a single AI tool (Pokee AI or a competitor)
export type AIResult = {
  name: string;
  media: MediaItem[];
  analysis: string;
  performance_metrics?: PerformanceMetric[];
};

export type FAQ = {
  question: string;
  answer: string;
};

// Type for related comparison links
export type RelatedComparison = {
  title: string;
  slug: string;
  description?: string;
};

// The main type for the entire comparison blog post data structure
export type ComparisonData = {
  seo_title: string;
  slug: string;
  author: string;
  date_posted: string; // ISO date string or formatted date
  summary?: string;
  intro_framing?: string; // Why this comparison matters
  use_case_context?: string; // Practical scenario explanation
  prompt_text: string;
  prompt_analysis: string;
  pokee_ai: AIResult;
  competitors: AIResult[];
  conclusion: string;
  key_takeaways?: string[];
  faqs?: FAQ[];
  cta_text?: string; // Call to action text
  cta_link?: string; // Call to action link
  related_comparisons?: RelatedComparison[]; // Related blog posts
};

// Flattened database model type (matches the new schema)
export type FlattenedBlogPost = {
  id: string;
  seoTitle: string;
  slug: string;
  author: string;
  datePosted: number; // Unix timestamp
  summary?: string;
  introFraming?: string;
  useCaseContext?: string;
  promptText: string;
  promptAnalysis: string;
  
  // Flattened pokeeAi fields
  pokeeAiName: string;
  pokeeAiAnalysis: string;
  pokeeAiMediaUrls?: string; // Comma-separated URLs
  pokeeAiMediaCaptions?: string; // JSON array of captions
  
  // PokeeAI performance metrics (up to 3)
  pokeeAiMetric1?: string;
  pokeeAiValue1?: string;
  pokeeAiSource1?: string;
  pokeeAiMetric2?: string;
  pokeeAiValue2?: string;
  pokeeAiSource2?: string;
  pokeeAiMetric3?: string;
  pokeeAiValue3?: string;
  pokeeAiSource3?: string;
  
  // Flattened competitors fields
  competitor1Name: string;
  competitor1Analysis: string;
  competitor1MediaUrls?: string;
  competitor1MediaCaptions?: string;
  
  // Competitor 1 performance metrics (up to 3)
  competitor1Metric1?: string;
  competitor1Value1?: string;
  competitor1Source1?: string;
  competitor1Metric2?: string;
  competitor1Value2?: string;
  competitor1Source2?: string;
  competitor1Metric3?: string;
  competitor1Value3?: string;
  competitor1Source3?: string;
  
  competitor2Name?: string;
  competitor2Analysis?: string;
  competitor2MediaUrls?: string;
  competitor2MediaCaptions?: string;
  
  // Competitor 2 performance metrics (up to 3)
  competitor2Metric1?: string;
  competitor2Value1?: string;
  competitor2Source1?: string;
  competitor2Metric2?: string;
  competitor2Value2?: string;
  competitor2Source2?: string;
  competitor2Metric3?: string;
  competitor2Value3?: string;
  competitor2Source3?: string;
  
  competitor3Name?: string;
  competitor3Analysis?: string;
  competitor3MediaUrls?: string;
  competitor3MediaCaptions?: string;
  
  // Competitor 3 performance metrics (up to 3)
  competitor3Metric1?: string;
  competitor3Value1?: string;
  competitor3Source1?: string;
  competitor3Metric2?: string;
  competitor3Value2?: string;
  competitor3Source2?: string;
  competitor3Metric3?: string;
  competitor3Value3?: string;
  competitor3Source3?: string;
  
  conclusion: string;
  
  // Flattened key takeaways (up to 5 key points)
  keyTakeaway1?: string;
  keyTakeaway2?: string;
  keyTakeaway3?: string;
  keyTakeaway4?: string;
  keyTakeaway5?: string;
  
  // Flattened FAQs (up to 4 FAQ pairs)
  faq1Question?: string;
  faq1Answer?: string;
  faq2Question?: string;
  faq2Answer?: string;
  faq3Question?: string;
  faq3Answer?: string;
  faq4Question?: string;
  faq4Answer?: string;
  
  ctaText?: string;
  ctaLink?: string;
  relatedComparisons?: string; // JSON array as string
  status: 'draft' | 'published' | 'archived';
  createdOn?: number;
  updatedOn?: number;
};

// Legacy database model type (kept for backward compatibility)
export type BlogPost = {
  id: string;
  seoTitle: string;
  slug: string;
  author: string;
  datePosted: number; // Unix timestamp
  summary?: string;
  introFraming?: string;
  useCaseContext?: string;
  promptText: string;
  promptAnalysis: string;
  pokeeAi: AIResult;
  competitors: AIResult[];
  conclusion: string;
  keyTakeaways?: string[];
  faqs?: FAQ[];
  ctaText?: string;
  ctaLink?: string;
  relatedComparisons?: RelatedComparison[];
  status: 'draft' | 'published' | 'archived';
  featured: number; // 0 or 1
  userId: string;
  createdOn: number;
  updatedOn: number;
  createdBy: string;
  updatedBy: string;
};

// Form data type for creating/editing blog posts (using flattened structure)
export type BlogPostFormData = Omit<FlattenedBlogPost, 'id' | 'createdOn' | 'updatedOn'>;

// API response types
export type BlogPostListResponse = {
  data: FlattenedBlogPost[];
  total: number;
  page: number;
  limit: number;
};

export type BlogPostResponse = {
  data: FlattenedBlogPost;
};

// Search and filter types
export type BlogPostFilters = {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
};
