import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get the main accommodation
export const get = query({
  args: {},
  handler: async (ctx) => {
    const accommodation = await ctx.db.query("accommodation").first();
    return accommodation;
  },
});

// Get all rooms for an accommodation with assigned profile details
export const getRooms = query({
  args: {},
  handler: async (ctx) => {
    const accommodation = await ctx.db.query("accommodation").first();
    if (!accommodation) return [];

    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_accommodation", (q) => q.eq("accommodationId", accommodation._id))
      .collect();

    // Fetch assigned profile details for each room
    const roomsWithProfiles = await Promise.all(
      rooms.map(async (room) => {
        let assignedProfile = null;
        if (room.assignedProfileId) {
          const profile = await ctx.db.get(room.assignedProfileId);
          if (profile) {
            assignedProfile = {
              _id: profile._id,
              name: profile.name,
              photoStorageId: profile.photoStorageId,
              photoUrl: profile.photoUrl,
            };
          }
        }
        return { ...room, assignedProfile };
      })
    );

    return roomsWithProfiles.sort((a, b) => a.order - b.order);
  },
});

// Get unassigned profiles (profiles not assigned to any room)
export const getUnassignedProfiles = query({
  args: {},
  handler: async (ctx) => {
    const accommodation = await ctx.db.query("accommodation").first();
    if (!accommodation) return [];

    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_accommodation", (q) => q.eq("accommodationId", accommodation._id))
      .collect();

    const assignedProfileIds = new Set(
      rooms.filter((r) => r.assignedProfileId).map((r) => r.assignedProfileId!.toString())
    );

    const allProfiles = await ctx.db.query("profiles").collect();

    return allProfiles
      .filter((p) => !assignedProfileIds.has(p._id.toString()))
      .map((p) => ({
        _id: p._id,
        name: p.name,
        photoStorageId: p.photoStorageId,
        photoUrl: p.photoUrl,
      }));
  },
});

// Assign a profile to a room
export const assignRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    // First, check if this profile is already assigned to another room
    const accommodation = await ctx.db.query("accommodation").first();
    if (!accommodation) throw new Error("No accommodation found");

    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_accommodation", (q) => q.eq("accommodationId", accommodation._id))
      .collect();

    // Remove profile from any existing room
    for (const room of rooms) {
      if (room.assignedProfileId?.toString() === args.profileId.toString()) {
        await ctx.db.patch(room._id, { assignedProfileId: undefined });
      }
    }

    // Assign to the new room
    await ctx.db.patch(args.roomId, { assignedProfileId: args.profileId });

    return { success: true };
  },
});

// Unassign a profile from a room
export const unassignRoom = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, { assignedProfileId: undefined });
    return { success: true };
  },
});

// Seed the accommodation data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if accommodation already exists
    const existing = await ctx.db.query("accommodation").first();
    if (existing) {
      return { message: "Accommodation already seeded" };
    }

    // Create the main accommodation
    const accommodationId = await ctx.db.insert("accommodation", {
      name: "Luxury Villa in Cape Town",
      tagline: "Stunning 4-bedroom villa with panoramic mountain and sea views",
      description: `Experience the beauty of Cape Town from this exquisite 4-bedroom villa nestled in the heart of the city. This stunning property offers breathtaking panoramic views of Table Mountain and the Atlantic Ocean, providing the perfect backdrop for an unforgettable stay.

The villa features an open-plan living area with floor-to-ceiling windows, a fully equipped modern kitchen, and a spacious outdoor entertainment area with a private pool. Each bedroom is thoughtfully designed with comfort in mind, featuring premium linens and en-suite bathrooms.

Located in a prime position, you're just minutes away from some of Cape Town's best attractions including the V&A Waterfront, Clifton beaches, and world-class restaurants. The villa comes with secure parking, high-speed WiFi, and a dedicated concierge service to ensure your stay is nothing short of exceptional.`,
      location: "Cape Town, Western Cape, South Africa",
      address: "Sea Point, Cape Town, 8005",
      airbnbUrl: "https://www.airbnb.co.uk/rooms/14755785",
      checkIn: "15:00",
      checkOut: "10:00",
      guests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 4,
      amenities: [
        "Pool",
        "Ocean view",
        "Mountain view",
        "Kitchen",
        "WiFi",
        "Free parking",
        "Air conditioning",
        "Heating",
        "Washer",
        "Dryer",
        "TV",
        "BBQ grill",
        "Outdoor dining area",
        "Security system",
        "Smoke alarm",
        "First aid kit",
        "Fire extinguisher",
        "Coffee maker",
        "Dishwasher",
        "Microwave",
      ],
      houseRules: [
        "Check-in: After 3:00 PM",
        "Checkout: 10:00 AM",
        "No smoking inside",
        "No parties or events",
        "Pets allowed with prior approval",
        "Quiet hours: 10:00 PM - 8:00 AM",
      ],
      highlights: [
        {
          icon: "lucide:mountain",
          title: "Stunning Views",
          description: "Panoramic views of Table Mountain and the Atlantic Ocean",
        },
        {
          icon: "lucide:waves",
          title: "Private Pool",
          description: "Refreshing pool with loungers and outdoor entertainment area",
        },
        {
          icon: "lucide:map-pin",
          title: "Prime Location",
          description: "Minutes from V&A Waterfront, beaches, and top restaurants",
        },
        {
          icon: "lucide:shield-check",
          title: "Secure Property",
          description: "24/7 security, gated access, and secure parking",
        },
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
          caption: "Villa Exterior",
          category: "exterior",
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
          caption: "Front Entrance",
          category: "exterior",
        },
        {
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
          caption: "Living Room with Ocean View",
          category: "living",
        },
        {
          url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
          caption: "Open Plan Living Area",
          category: "living",
        },
        {
          url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
          caption: "Modern Kitchen",
          category: "kitchen",
        },
        {
          url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
          caption: "Fully Equipped Kitchen",
          category: "kitchen",
        },
        {
          url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200",
          caption: "Master Bedroom",
          category: "bedroom",
        },
        {
          url: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1200",
          caption: "Guest Bedroom",
          category: "bedroom",
        },
        {
          url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200",
          caption: "Bedroom with Mountain View",
          category: "bedroom",
        },
        {
          url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
          caption: "Luxury Bathroom",
          category: "bathroom",
        },
        {
          url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200",
          caption: "Pool with Mountain View",
          category: "amenity",
        },
        {
          url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
          caption: "Outdoor Entertainment Area",
          category: "amenity",
        },
        {
          url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200",
          caption: "Table Mountain View",
          category: "view",
        },
        {
          url: "https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=1200",
          caption: "Sunset over Cape Town",
          category: "view",
        },
      ],
      hostName: "Superhost",
      rating: 4.92,
      reviewCount: 127,
      pricePerNight: 450,
      createdAt: Date.now(),
    });

    // Create rooms
    const rooms = [
      {
        name: "Master Suite",
        description: "Spacious master suite with king-size bed, en-suite bathroom with rainfall shower, walk-in closet, and private balcony with ocean views.",
        bedType: "King bed",
        capacity: 2,
        features: ["En-suite bathroom", "Ocean view", "Private balcony", "Walk-in closet", "Smart TV"],
        imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
        order: 1,
      },
      {
        name: "Mountain View Room",
        description: "Elegant double room featuring stunning views of Table Mountain, queen-size bed with premium linens, and modern en-suite bathroom.",
        bedType: "Queen bed",
        capacity: 2,
        features: ["En-suite bathroom", "Mountain view", "Desk workspace", "Smart TV"],
        imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
        order: 2,
      },
      {
        name: "Garden Suite",
        description: "Peaceful ground-floor suite with direct garden access, queen-size bed, and en-suite bathroom. Perfect for those who love morning walks.",
        bedType: "Queen bed",
        capacity: 2,
        features: ["En-suite bathroom", "Garden access", "Patio doors", "Smart TV"],
        imageUrl: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800",
        order: 3,
      },
      {
        name: "Twin Room",
        description: "Comfortable twin room with two single beds, perfect for friends sharing. Features a modern bathroom and city views.",
        bedType: "2 Single beds",
        capacity: 2,
        features: ["En-suite bathroom", "City view", "USB charging points", "Smart TV"],
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        order: 4,
      },
    ];

    for (const room of rooms) {
      await ctx.db.insert("rooms", {
        accommodationId,
        ...room,
        assignedProfileId: undefined,
      });
    }

    return { message: "Accommodation seeded successfully", accommodationId };
  },
});

// Get room assignment stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const accommodation = await ctx.db.query("accommodation").first();
    if (!accommodation) return null;

    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_accommodation", (q) => q.eq("accommodationId", accommodation._id))
      .collect();

    const assignedCount = rooms.filter((r) => r.assignedProfileId).length;
    const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);

    return {
      totalRooms: rooms.length,
      assignedRooms: assignedCount,
      availableRooms: rooms.length - assignedCount,
      totalCapacity,
    };
  },
});
