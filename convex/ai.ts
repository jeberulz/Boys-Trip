import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Record a payment commitment for AI usage
export const recordPayment = mutation({
  args: {
    profileId: v.optional(v.id("profiles")),
    userName: v.string(),
    email: v.optional(v.string()),
    amount: v.number(),
    fieldUsed: v.string(),
  },
  handler: async (ctx, args) => {
    const paymentId = await ctx.db.insert("aiPayments", {
      profileId: args.profileId,
      userName: args.userName,
      email: args.email,
      amount: args.amount,
      fieldUsed: args.fieldUsed,
      status: "pending",
      createdAt: Date.now(),
    });
    return paymentId;
  },
});

// Get all AI payments (for admin)
export const getPayments = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      const status = args.status;
      return await ctx.db
        .query("aiPayments")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("aiPayments").order("desc").collect();
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    paymentId: v.id("aiPayments"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.paymentId, { status: args.status });
    return { success: true };
  },
});

// AI action to improve text (expand, rewrite, shorten)
export const improveText = action({
  args: {
    text: v.string(),
    action: v.string(), // "expand", "rewrite", "shorten", "custom"
    customPrompt: v.optional(v.string()),
    fieldName: v.string(), // For context (e.g., "shortTermGoal", "funFact1")
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    // Build the prompt based on action type
    let systemPrompt = `You are a helpful writing assistant helping someone improve their profile text.
Keep the tone friendly, authentic, and personal. The text should sound like it was written by the person themselves, not by an AI.
Only return the improved text, no explanations or quotes around it.`;

    let userPrompt = "";

    const fieldContextMap: Record<string, string> = {
      shortTermGoal: "This is their short-term goal (typically for this year).",
      longTermGoal: "This is their long-term goal (5-10 year vision).",
      funFact1: "This is a fun fact about them.",
      funFact2: "This is a fun fact about them.",
      funFact3: "This is a fun fact about them.",
      favoriteQuote: "This is their favorite quote.",
    };

    const fieldContext = fieldContextMap[args.fieldName] || "";

    switch (args.action) {
      case "expand":
        userPrompt = `${fieldContext}

Take this text and expand it with more detail while keeping the same voice and meaning. Make it richer and more descriptive, but keep it authentic and personal. Don't make it too long - just add helpful details.

Original text: "${args.text}"`;
        break;

      case "rewrite":
        userPrompt = `${fieldContext}

Rewrite this text in a fresh, engaging way while preserving the core message. Make it sound natural and authentic, like the person naturally speaks.

Original text: "${args.text}"`;
        break;

      case "shorten":
        userPrompt = `${fieldContext}

Condense this text to be more concise while keeping the essential meaning. Make every word count, but keep the personal voice.

Original text: "${args.text}"`;
        break;

      case "custom":
        userPrompt = `${fieldContext}

${args.customPrompt}

Original text: "${args.text}"`;
        break;

      default:
        throw new Error(`Unknown action: ${args.action}`);
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: userPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const improvedText = data.content[0].text.trim();

      return { success: true, text: improvedText };
    } catch (error) {
      console.error("Error improving text:", error);
      throw new Error(
        `Failed to improve text: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});

// AI action to generate a personalized quote
export const generateQuote = action({
  args: {
    quoteType: v.string(), // "motivational", "philosophical", "funny", "life", "friendship", "success"
    themes: v.array(v.string()), // ["adventure", "career", "family", "love", "humor"]
    customNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const systemPrompt = `You are a quote curator helping someone find the perfect quote for their profile.
Return a single quote that matches their preferences. Include the attribution (author name) after the quote.
Format: "Quote text here" — Author Name
If you create an original quote, attribute it as "— Unknown" or make it feel like a timeless saying.
Only return the quote with attribution, nothing else.`;

    const userPrompt = `Find or create a perfect quote based on these preferences:

Type of quote: ${args.quoteType}
Themes that resonate: ${args.themes.join(", ")}
${args.customNotes ? `Additional notes: ${args.customNotes}` : ""}

Provide a meaningful quote that feels personal and authentic.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: userPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const quote = data.content[0].text.trim();

      return { success: true, quote };
    } catch (error) {
      console.error("Error generating quote:", error);
      throw new Error(
        `Failed to generate quote: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});
