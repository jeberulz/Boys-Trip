import { mutation } from "./_generated/server";

export const seedProfiles = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if profiles already exist
    const existingProfiles = await ctx.db.query("profiles").collect();
    if (existingProfiles.length > 0) {
      return { message: "Profiles already exist", count: existingProfiles.length };
    }

    const mockProfiles = [
      {
        name: "Marcus Chen",
        location: "San Francisco, CA",
        family: "Married to Lisa for 4 years. We have a golden retriever named Max who thinks he's the boss of the house.",
        background: "Software engineer at a fintech startup. Stanford CS grad. Started coding in middle school and never stopped.",
        passions: "Basketball, hiking the Bay Area trails, craft beer, and building side projects that probably won't make money.",
        shortTermGoal: "Ship my side project app and get 1,000 users.",
        longTermGoal: "Start my own company and achieve financial independence by 40.",
        funFact1: "I've visited every In-N-Out in California.",
        funFact2: "I can solve a Rubik's cube in under 90 seconds.",
        funFact3: "I once accidentally matched with my cousin on a dating app.",
        favoriteQuote: "The best time to plant a tree was 20 years ago. The second best time is now.",
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        name: "David Miller",
        location: "Austin, TX",
        family: "Engaged to my high school sweetheart, Rachel. Wedding is next fall! We have two cats named Whiskey and Bourbon.",
        background: "Marketing director at a SaaS company. UT Austin grad. Former fraternity president who somehow grew up.",
        passions: "Live music (Austin has the best scene), BBQ, golf, and watching too much college football.",
        shortTermGoal: "Plan the perfect wedding without going broke.",
        longTermGoal: "Become a VP by 35 and buy a lake house.",
        funFact1: "I've been to over 200 live concerts.",
        funFact2: "I make a mean smoked brisket - 14 hour cook time.",
        funFact3: "I was on the jumbotron at a Longhorns game and my proposal went viral.",
        favoriteQuote: "Life is what happens when you're busy making other plans. - John Lennon",
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        name: "Alex Rivera",
        location: "Miami, FL",
        family: "Single and living my best life. Close with my parents who immigrated from Cuba. Big extended family that gets together every Sunday.",
        background: "Founder of a D2C brand. FIU grad. Hustled my way from selling sneakers to running a 7-figure business.",
        passions: "Entrepreneurship, fitness, yacht parties (when I can afford them), and giving back to the community.",
        shortTermGoal: "Hit $10M in annual revenue.",
        longTermGoal: "Build a business empire and retire my parents to a beachfront house.",
        funFact1: "I've DJ'd at some of Miami's biggest clubs.",
        funFact2: "I speak three languages fluently.",
        funFact3: "I once sold a pair of sneakers for $50,000.",
        favoriteQuote: "The only way to do great work is to love what you do. - Steve Jobs",
        createdAt: Date.now() - 86400000 * 1,
      },
      {
        name: "James Wilson",
        location: "New York, NY",
        family: "Married to Sarah, together 6 years. We have a 2-year-old daughter named Olivia who runs our household.",
        background: "Investment banker turned startup advisor. Wharton MBA. Survived 100-hour weeks to realize there's more to life.",
        passions: "Wine collecting, tennis, traveling to new countries, and now being a girl dad.",
        shortTermGoal: "Make it through the terrible twos with my sanity intact.",
        longTermGoal: "FIRE by 45 and spend more time with family.",
        funFact1: "I've been to 47 countries.",
        funFact2: "I have a wine cellar with over 500 bottles.",
        funFact3: "I once closed a deal while changing a diaper on a Zoom call.",
        favoriteQuote: "Fortune favors the bold.",
        createdAt: Date.now() - 86400000 * 3,
      },
      {
        name: "Chris Thompson",
        location: "Denver, CO",
        family: "Recently married to Jake. We adopted a rescue dog named Aspen who loves the mountain life as much as we do.",
        background: "Product manager at a tech company. CU Boulder grad. Former ski instructor who found his way into tech.",
        passions: "Skiing, mountain biking, camping, and building products that people actually want to use.",
        shortTermGoal: "Climb all of Colorado's 14ers.",
        longTermGoal: "Live fully remote and work from a cabin in the mountains.",
        funFact1: "I've skied over 100 days in a single season.",
        funFact2: "I make my own hot sauce.",
        funFact3: "I once got snowed in at a ski resort for 4 days and it was the best week of my life.",
        favoriteQuote: "The mountains are calling and I must go. - John Muir",
        createdAt: Date.now() - 86400000 * 4,
      },
    ];

    for (const profile of mockProfiles) {
      await ctx.db.insert("profiles", profile);
    }

    return { message: "Seed data created", count: mockProfiles.length };
  },
});

export const clearProfiles = mutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    for (const profile of profiles) {
      await ctx.db.delete(profile._id);
    }
    return { message: "All profiles deleted", count: profiles.length };
  },
});
