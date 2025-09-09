export type GeneralPostStatus = "draft" | "published" | "archived";

export interface GeneralPost {
  id: string;
  seoTitle: string;
  slug: string;
  datePosted: number; // Unix timestamp
  status: GeneralPostStatus;
  author: string;
  summary?: string;
  content?: string;
  metaDescription?: string;
  tags?: string; // Comma-separated tags
  category?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  mediaUrls?: string; // JSON array of media URLs
  mediaCaptions?: string; // JSON array of media captions
  introduction?: string;
  conclusion?: string;
  customField1?: string;
  customField2?: string;
  customField3?: string;
  customField4?: string;
  customField5?: string;
  socialTitle?: string;
  socialDescription?: string;
  relatedPosts?: string; // JSON array of related post IDs
  createdOn?: number;
  updatedOn?: number;
}

export interface GeneralPostCreateInput {
  seoTitle: string;
  slug: string;
  datePosted?: number;
  status?: GeneralPostStatus;
  author?: string;
  summary?: string;
  content?: string;
  metaDescription?: string;
  tags?: string;
  category?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  mediaUrls?: string;
  mediaCaptions?: string;
  introduction?: string;
  conclusion?: string;
  customField1?: string;
  customField2?: string;
  customField3?: string;
  customField4?: string;
  customField5?: string;
  socialTitle?: string;
  socialDescription?: string;
  relatedPosts?: string;
}

export interface GeneralPostUpdateInput extends Partial<GeneralPostCreateInput> {
  id: string;
}
