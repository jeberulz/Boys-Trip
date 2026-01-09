import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    name: v.string(),
    location: v.string(),
    family: v.string(),
    background: v.string(),
    passions: v.string(),
    shortTermGoal: v.string(),
    longTermGoal: v.string(),
    funFact1: v.string(),
    funFact2: v.string(),
    funFact3: v.string(),
    favoriteQuote: v.string(),
    photoUrl: v.optional(v.string()),
    photoStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  }),
  activities: defineTable({
    day: v.number(), // 1-7
    timeSlot: v.string(), // "Morning", "Afternoon", "Evening"
    title: v.string(),
    description: v.string(),
    location: v.string(),
    cost: v.string(),
    source: v.string(), // "ai" or "user"
    createdAt: v.number(),
  }).index("by_day", ["day"]),
  votes: defineTable({
    activityId: v.id("activities"),
    userId: v.string(), // localStorage identifier
    voteType: v.number(), // 1 for upvote, -1 for downvote
    createdAt: v.number(),
  })
    .index("by_activity", ["activityId"])
    .index("by_user_and_activity", ["userId", "activityId"]),
  comments: defineTable({
    activityId: v.id("activities"),
    userName: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_activity", ["activityId"]),
});
