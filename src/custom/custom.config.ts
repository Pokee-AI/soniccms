import * as comparisonPosts from "@custom/db/schema/comparisonPosts";
import * as generalPost from "@custom/db/schema/generalPost";

export const tableSchemas = {
    comparisonPosts,
    generalPost,
    users, // Core table schema DO NOT REMOVE
    userSessions, // Core table schema DO NOT REMOVE
    cacheRequests, // Core table schema DO NOT REMOVE
    cacheStats, // Core table schema DO NOT REMOVE
};

// Export all constants from comparisonPosts
export const {
    table: comparisonPostsTable,
    relation: comparisonPostsRelation,
} = comparisonPosts;

// Export all constants from generalPost
export const {
    table: generalPostTable,
    relation: generalPostRelation,
} = generalPost;

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