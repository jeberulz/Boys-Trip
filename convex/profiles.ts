import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("profiles").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    return profiles.length;
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const profileId = await ctx.db.insert("profiles", {
      ...args,
      createdAt: Date.now(),
    });
    return profileId;
  },
});
