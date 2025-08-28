CREATE TABLE `blogPosts` (
	`id` text PRIMARY KEY NOT NULL,
	`seoTitle` text NOT NULL,
	`slug` text NOT NULL,
	`author` text NOT NULL,
	`datePosted` integer NOT NULL,
	`summary` text,
	`introFraming` text,
	`useCaseContext` text,
	`promptText` text NOT NULL,
	`promptAnalysis` text NOT NULL,
	
	-- Flattened pokeeAi fields
	`pokeeAiName` text NOT NULL,
	`pokeeAiAnalysis` text NOT NULL,
	`pokeeAiMediaUrls` text,
	`pokeeAiMediaCaptions` text,
	
	-- PokeeAI performance metrics (up to 3)
	`pokeeAiMetric1` text,
	`pokeeAiValue1` text,
	`pokeeAiSource1` text,
	`pokeeAiMetric2` text,
	`pokeeAiValue2` text,
	`pokeeAiSource2` text,
	`pokeeAiMetric3` text,
	`pokeeAiValue3` text,
	`pokeeAiSource3` text,
	
	-- Flattened competitors fields
	`competitor1Name` text NOT NULL,
	`competitor1Analysis` text NOT NULL,
	`competitor1MediaUrls` text,
	`competitor1MediaCaptions` text,
	
	-- Competitor 1 performance metrics (up to 3)
	`competitor1Metric1` text,
	`competitor1Value1` text,
	`competitor1Source1` text,
	`competitor1Metric2` text,
	`competitor1Value2` text,
	`competitor1Source2` text,
	`competitor1Metric3` text,
	`competitor1Value3` text,
	`competitor1Source3` text,
	
	`competitor2Name` text,
	`competitor2Analysis` text,
	`competitor2MediaUrls` text,
	`competitor2MediaCaptions` text,
	
	-- Competitor 2 performance metrics (up to 3)
	`competitor2Metric1` text,
	`competitor2Value1` text,
	`competitor2Source1` text,
	`competitor2Metric2` text,
	`competitor2Value2` text,
	`competitor2Source2` text,
	`competitor2Metric3` text,
	`competitor2Value3` text,
	`competitor2Source3` text,
	
	`competitor3Name` text,
	`competitor3Analysis` text,
	`competitor3MediaUrls` text,
	`competitor3MediaCaptions` text,
	
	-- Competitor 3 performance metrics (up to 3)
	`competitor3Metric1` text,
	`competitor3Value1` text,
	`competitor3Source1` text,
	`competitor3Metric2` text,
	`competitor3Value2` text,
	`competitor3Source2` text,
	`competitor3Metric3` text,
	`competitor3Value3` text,
	`competitor3Source3` text,
	
	`conclusion` text NOT NULL,
	
	-- Flattened key takeaways (up to 5 key points)
	`keyTakeaway1` text,
	`keyTakeaway2` text,
	`keyTakeaway3` text,
	`keyTakeaway4` text,
	`keyTakeaway5` text,
	
	-- Flattened FAQs (up to 4 FAQ pairs)
	`faq1Question` text,
	`faq1Answer` text,
	`faq2Question` text,
	`faq2Answer` text,
	`faq3Question` text,
	`faq3Answer` text,
	`faq4Question` text,
	`faq4Answer` text,
	
	`ctaText` text,
	`ctaLink` text,
	`relatedComparisons` text,
	`status` text DEFAULT 'draft',
	`createdOn` integer,
	`updatedOn` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blogPosts_slug_unique` ON `blogPosts` (`slug`);--> statement-breakpoint
CREATE INDEX `blogPostSlugIndex` ON `blogPosts` (`slug`);--> statement-breakpoint
CREATE INDEX `blogPostStatusIndex` ON `blogPosts` (`status`);