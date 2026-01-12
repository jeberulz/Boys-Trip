import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Password hashing utilities using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const encoder = new TextEncoder();
  const data = encoder.encode(saltHex + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");

  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computedHash === hash;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("profiles").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) return null;
    // Exclude password hash from response
    const { passwordHash, ...safeProfile } = profile;
    return safeProfile;
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
    photoStorageId: v.optional(v.id("_storage")),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { password, ...profileData } = args;

    let passwordHashValue: string | undefined;
    if (password && password.trim()) {
      passwordHashValue = await hashPassword(password);
    }

    const profileId = await ctx.db.insert("profiles", {
      ...profileData,
      passwordHash: passwordHashValue,
      createdAt: Date.now(),
    });
    return profileId;
  },
});

export const hasPassword = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) return null;
    return !!profile.passwordHash;
  },
});

export const verifyProfilePassword = mutation({
  args: {
    id: v.id("profiles"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    // Profile has no password - allow edit
    if (!profile.passwordHash) {
      return { success: true, hasPassword: false };
    }

    // Verify password
    const isValid = await verifyPassword(args.password, profile.passwordHash);
    if (isValid) {
      return { success: true, hasPassword: true };
    }

    return { success: false, error: "Incorrect password" };
  },
});

export const countManagers = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    return profiles.filter((p) => p.isItineraryManager === true).length;
  },
});

export const setItineraryManager = mutation({
  args: {
    id: v.id("profiles"),
    isManager: v.boolean(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // If setting to manager, check the limit
    if (args.isManager) {
      const profiles = await ctx.db.query("profiles").collect();
      const managerCount = profiles.filter(
        (p) => p.isItineraryManager === true && p._id !== args.id
      ).length;
      if (managerCount >= 2) {
        throw new Error("Maximum of 2 managers allowed");
      }
    }

    await ctx.db.patch(args.id, {
      isItineraryManager: args.isManager,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const update = mutation({
  args: {
    id: v.id("profiles"),
    password: v.optional(v.string()),
    updates: v.object({
      name: v.optional(v.string()),
      location: v.optional(v.string()),
      family: v.optional(v.string()),
      background: v.optional(v.string()),
      passions: v.optional(v.string()),
      shortTermGoal: v.optional(v.string()),
      longTermGoal: v.optional(v.string()),
      funFact1: v.optional(v.string()),
      funFact2: v.optional(v.string()),
      funFact3: v.optional(v.string()),
      favoriteQuote: v.optional(v.string()),
      photoUrl: v.optional(v.string()),
      photoStorageId: v.optional(v.id("_storage")),
    }),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Verify password if profile has one
    if (profile.passwordHash) {
      if (!args.password) {
        throw new Error("Password required");
      }
      const isValid = await verifyPassword(args.password, profile.passwordHash);
      if (!isValid) {
        throw new Error("Incorrect password");
      }
    }

    // Update the profile
    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
