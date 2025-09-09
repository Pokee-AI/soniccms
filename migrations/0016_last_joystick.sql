ALTER TABLE `blogPosts` RENAME TO `comparisonPosts`;--> statement-breakpoint
DROP INDEX `blogPosts_slug_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `comparisonPosts_slug_unique` ON `comparisonPosts` (`slug`);