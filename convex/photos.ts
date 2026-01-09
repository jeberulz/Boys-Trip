import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a URL for uploading a photo
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get a URL for viewing a stored photo
export const getPhotoUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get photo URL for a profile (handles both storage and external URLs)
export const getProfilePhotoUrl = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return null;

    // Prefer storage ID over external URL
    if (profile.photoStorageId) {
      return await ctx.storage.getUrl(profile.photoStorageId);
    }

    // Fallback to external URL if provided
    return profile.photoUrl || null;
  },
});
