CREATE TABLE `generalPost` (
	`id` text PRIMARY KEY NOT NULL,
	`seoTitle` text NOT NULL,
	`slug` text NOT NULL,
	`datePosted` integer NOT NULL,
	`status` text DEFAULT 'draft',
	`author` text NOT NULL,
	`summary` text,
	`content` text,
	`metaDescription` text,
	`tags` text,
	`category` text,
	`featuredImage` text,
	`featuredImageAlt` text,
	`mediaUrls` text,
	`mediaCaptions` text,
	`introduction` text,
	`conclusion` text,
	`customField1` text,
	`customField2` text,
	`customField3` text,
	`customField4` text,
	`customField5` text,
	`socialTitle` text,
	`socialDescription` text,
	`relatedPosts` text,
	`createdOn` integer,
	`updatedOn` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `generalPost_slug_unique` ON `generalPost` (`slug`);--> statement-breakpoint
CREATE INDEX `generalPostSlugIndex` ON `generalPost` (`slug`);--> statement-breakpoint
CREATE INDEX `generalPostStatusIndex` ON `generalPost` (`status`);--> statement-breakpoint
CREATE INDEX `generalPostCategoryIndex` ON `generalPost` (`category`);--> statement-breakpoint
CREATE INDEX `generalPostDatePostedIndex` ON `generalPost` (`datePosted`);