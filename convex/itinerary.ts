import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Get full itinerary grouped by day with vote counts
export const getItinerary = query({
  args: {},
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();

    // Get vote counts for each activity
    const activitiesWithVotes = await Promise.all(
      activities.map(async (activity) => {
        const votes = await ctx.db
          .query("votes")
          .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
          .collect();

        const voteScore = votes.reduce((sum, vote) => sum + vote.voteType, 0);
        const upvotes = votes.filter(v => v.voteType === 1).length;
        const downvotes = votes.filter(v => v.voteType === -1).length;

        return {
          ...activity,
          voteScore,
          upvotes,
          downvotes,
        };
      })
    );

    // Group by day and sort
    const groupedByDay: Record<number, typeof activitiesWithVotes> = {};

    activitiesWithVotes.forEach((activity) => {
      if (!groupedByDay[activity.day]) {
        groupedByDay[activity.day] = [];
      }
      groupedByDay[activity.day].push(activity);
    });

    // Sort activities within each day by time slot then vote score
    const timeSlotOrder = { "Morning": 1, "Afternoon": 2, "Evening": 3 };

    Object.keys(groupedByDay).forEach((day) => {
      groupedByDay[Number(day)].sort((a, b) => {
        const timeCompare = timeSlotOrder[a.timeSlot as keyof typeof timeSlotOrder] -
                          timeSlotOrder[b.timeSlot as keyof typeof timeSlotOrder];
        if (timeCompare !== 0) return timeCompare;
        return b.voteScore - a.voteScore; // Higher votes first
      });
    });

    return groupedByDay;
  },
});

// Get single activity with full details, votes, and comments
export const getActivityDetails = query({
  args: { activityId: v.id("activities") },
  handler: async (ctx, args) => {
    const activity = await ctx.db.get(args.activityId);
    if (!activity) return null;

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_activity", (q) => q.eq("activityId", args.activityId))
      .collect();

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_activity", (q) => q.eq("activityId", args.activityId))
      .order("desc")
      .collect();

    const voteScore = votes.reduce((sum, vote) => sum + vote.voteType, 0);
    const upvotes = votes.filter(v => v.voteType === 1).length;
    const downvotes = votes.filter(v => v.voteType === -1).length;

    return {
      ...activity,
      voteScore,
      upvotes,
      downvotes,
      comments,
    };
  },
});

// Check if user has voted on an activity
export const getUserVote = query({
  args: { activityId: v.id("activities"), userId: v.string() },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_activity", (q) =>
        q.eq("userId", args.userId).eq("activityId", args.activityId)
      )
      .first();

    return vote?.voteType ?? null;
  },
});

// Vote on an activity (upvote or downvote)
export const voteOnActivity = mutation({
  args: {
    activityId: v.id("activities"),
    userId: v.string(),
    voteType: v.number(), // 1 for upvote, -1 for downvote
  },
  handler: async (ctx, args) => {
    // Check if user already voted
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_activity", (q) =>
        q.eq("userId", args.userId).eq("activityId", args.activityId)
      )
      .first();

    if (existingVote) {
      // If same vote, remove it (toggle off)
      if (existingVote.voteType === args.voteType) {
        await ctx.db.delete(existingVote._id);
        return { action: "removed" };
      }
      // If different vote, update it
      await ctx.db.patch(existingVote._id, {
        voteType: args.voteType,
        createdAt: Date.now(),
      });
      return { action: "updated" };
    }

    // Create new vote
    await ctx.db.insert("votes", {
      activityId: args.activityId,
      userId: args.userId,
      voteType: args.voteType,
      createdAt: Date.now(),
    });

    return { action: "created" };
  },
});

// Add a comment to an activity
export const addComment = mutation({
  args: {
    activityId: v.id("activities"),
    userName: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const commentId = await ctx.db.insert("comments", {
      activityId: args.activityId,
      userName: args.userName,
      text: args.text,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

// Add a user-suggested activity
export const suggestActivity = mutation({
  args: {
    day: v.number(),
    timeSlot: v.string(),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    cost: v.string(),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("activities", {
      day: args.day,
      timeSlot: args.timeSlot,
      title: args.title,
      description: args.description,
      location: args.location,
      cost: args.cost,
      source: "user",
      createdAt: Date.now(),
    });

    return activityId;
  },
});

// Clear all activities (for regeneration)
export const clearItinerary = mutation({
  args: {},
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();

    // Delete all votes and comments first
    for (const activity of activities) {
      const votes = await ctx.db
        .query("votes")
        .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
        .collect();

      const comments = await ctx.db
        .query("comments")
        .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
        .collect();

      for (const vote of votes) {
        await ctx.db.delete(vote._id);
      }

      for (const comment of comments) {
        await ctx.db.delete(comment._id);
      }

      await ctx.db.delete(activity._id);
    }
  },
});

// Bulk insert activities (used by AI generation)
export const insertActivities = mutation({
  args: {
    activities: v.array(
      v.object({
        day: v.number(),
        timeSlot: v.string(),
        title: v.string(),
        description: v.string(),
        location: v.string(),
        cost: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids = [];

    for (const activity of args.activities) {
      const id = await ctx.db.insert("activities", {
        ...activity,
        source: "ai",
        createdAt: Date.now(),
      });
      ids.push(id);
    }

    return ids;
  },
});

// Generate itinerary using AI (Anthropic Claude API)
export const generateItinerary = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const prompt = `Generate a 7-day Cape Town itinerary for a boys trip (ages 28-35).

Requirements:
- 3 activities per day minimum (ideally 3-4 activities)
- Mix categories: adventure, food/dining, nightlife, beaches, culture, day trips
- Include specific Cape Town locations
- Time slots: Morning (8am-12pm), Afternoon (12pm-6pm), Evening (6pm-late)
- Estimated cost per person in USD
- 2-3 sentence description per activity

Day trip options to include: Winelands, Cape Point, Hermanus

Must include these popular spots: Table Mountain, V&A Waterfront, Long Street, Camps Bay

Return as JSON array with this exact structure:
[
  {
    "day": 1,
    "timeSlot": "Morning",
    "title": "Table Mountain Cable Car & Hike",
    "description": "Start your trip at Cape Town's iconic landmark. Take the cable car to the summit for breathtaking 360-degree views of the city, coast, and surrounding mountains. Spend time exploring the summit trails and taking photos.",
    "location": "Table Mountain",
    "cost": "$25-35"
  }
]

Important:
- Use only "Morning", "Afternoon", or "Evening" for timeSlot
- Make descriptions exciting and specific to Cape Town
- Include practical cost estimates
- Ensure good variety across the 7 days
- Return ONLY the JSON array, no other text or formatting`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Parse JSON from response
      const activities = JSON.parse(content);

      // Clear existing itinerary
      await ctx.runMutation(api.itinerary.clearItinerary);

      // Insert new activities
      await ctx.runMutation(api.itinerary.insertActivities, { activities });

      return { success: true, count: activities.length };
    } catch (error) {
      console.error("Error generating itinerary:", error);
      throw new Error("Failed to generate itinerary. Please try again.");
    }
  },
});
