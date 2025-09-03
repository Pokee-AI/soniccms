import * as blogPosts from "@custom/db/schema/blogPosts";

export const tableSchemas = {
    blogPosts,
    users, // Core table schema DO NOT REMOVE
    userSessions, // Core table schema DO NOT REMOVE
    cacheRequests, // Core table schema DO NOT REMOVE
    cacheStats, // Core table schema DO NOT REMOVE
};

// Export all constants from blogPosts
export const {
    table: blogPostsTable,
    relation: blogPostsRelation,
} = blogPosts;

// Core table schemas DO NOT EDIT BELOW THIS LINE

import * as users from "../db/schema/users";
import * as userSessions from "../db/schema/userSessions";
import * as cacheRequests from "../db/schema/cacheRequests";
import * as cacheStats from "../db/schema/cacheStats";

// Export all constants from users
export const {
    table: usersTable,
    relation: usersRelation,
} = users;

// Export all constants from userSessions
export const {
    table: userSessionsTable,
    relation: userSessionsRelation,
} = userSessions;

// Export all constants from cacheRequests
export const {
    table: cacheRequestsTable,
} = cacheRequests;

// Export all constants from cacheStats
export const {
    table: cacheStatsTable,
    relation: cacheStatsRelation,
} = cacheStats;