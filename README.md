# Boys Trip Intro App

A Next.js web application for trip participants to share personal introductions and get to know each other before the adventure begins.

## Features

- 🔐 **Password Protection** - Private access for trip participants only
- 🏠 **Landing Page** - Trip details and participant count with real-time updates
- 📝 **Intro Submission Form** - Comprehensive form to submit personal details
- 📸 **Photo Upload** - Upload profile photos with Convex file storage
- 🖼️ **Gallery View** - Browse all participant profiles as interactive cards
- 👤 **Individual Profiles** - Detailed view of each participant's intro
- 🗺️ **AI-Powered Itinerary** - Collaborative trip planning with voting and comments
- ⚡ **Real-time Updates** - Powered by Convex for instant synchronization
- 📱 **Mobile-First Design** - Responsive layout with navy and orange theme

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Convex (real-time backend)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Boys-Trip
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```

This will:
- Prompt you to login to Convex (create account if needed)
- Create a new project
- Generate your `.env.local` file with Convex URLs
- Start the Convex development server

4. Configure the password (optional):
Edit `.env.local` and set your desired password:
```bash
NEXT_PUBLIC_APP_PASSWORD=yourSecretPassword
```
Default password is `boysTrip2026`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser and enter the password

## Project Structure

```
/app
  /components       # Reusable components
    ActivityCard.tsx       # Activity voting card
    ActivityModal.tsx      # Activity detail modal
    PasswordGate.tsx       # Password protection
    ProfilePhoto.tsx       # Profile photo display
    SuggestActivityForm.tsx # User activity suggestion
  /gallery          # Gallery page showing all profiles
  /itinerary        # AI-powered trip planning
  /profile/[id]     # Individual profile view
  /submit           # Form to submit new intro
  page.tsx          # Landing page
  layout.tsx        # Root layout with providers
  globals.css       # Global styles

/convex
  schema.ts         # Database schema (profiles, activities, votes, comments)
  profiles.ts       # Profile queries and mutations
  itinerary.ts      # Itinerary AI generation and voting
  photos.ts         # Photo upload functionality
```

## Database Schema

The `profiles` table includes:
- `name` - Full name
- `location` - City, State/Country
- `family` - Family information
- `background` - Education, career, life story
- `passions` - Interests and passions
- `shortTermGoal` - Short-term goal
- `longTermGoal` - Long-term goal
- `funFact1`, `funFact2`, `funFact3` - Three fun facts
- `favoriteQuote` - Favorite quote
- `photoUrl` - Optional external photo URL (fallback)
- `photoStorageId` - Convex storage ID for uploaded photos
- `createdAt` - Timestamp

## Password Protection

The app is protected by a simple password gate to keep it private for trip participants only. The password is configurable via the `NEXT_PUBLIC_APP_PASSWORD` environment variable.

**Default Password:** `boysTrip2026`

**To Change:** Update the value in `.env.local`

The authentication state is stored in browser localStorage, so users only need to enter the password once per device.

## Photo Upload

Profile photos are stored using Convex's built-in file storage:
- Max file size: 5MB
- Accepted formats: All image types (jpg, png, gif, etc.)
- Photos are served via Convex CDN
- Automatic fallback to user's initial if no photo uploaded

## AI-Powered Itinerary

The itinerary feature uses Claude AI to generate and manage trip plans:

### Features
- **AI Generation**: Automatically generates 7-day Cape Town itinerary with activities
- **Voting System**: Upvote/downvote activities to help group decide
- **Comments**: Discuss activities with real-time comments
- **User Suggestions**: Add your own activity ideas
- **Real-time Sync**: All votes and comments update instantly

### Setup
1. Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
2. Add to `.env.local`:
   ```bash
   ANTHROPIC_API_KEY=your-key-here
   ```
3. Click "Regenerate with AI" on the itinerary page

### How It Works
- AI generates activities across Morning, Afternoon, and Evening slots
- Each activity includes description, location, and estimated cost
- Vote on favorites - highest votes are prioritized
- Add comments to discuss or suggest modifications
- Suggest alternative activities for any day/time slot

### Activity Types
- Adventure (hiking, water sports, etc.)
- Food & Dining (restaurants, markets, tastings)
- Nightlife (bars, clubs, live music)
- Beaches (Camps Bay, Clifton, etc.)
- Culture (museums, tours, landmarks)
- Day Trips (Winelands, Cape Point, Hermanus)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Color Scheme

- **Navy**: Primary color for backgrounds and text
  - Main: `#001f3f` (navy-500)
- **Orange**: Accent color for CTAs and highlights
  - Main: `#ff8700` (orange-500)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.local`
4. Deploy!

### Convex Production Setup

1. Run `npx convex deploy` to create production deployment
2. Update environment variables in Vercel with production Convex URL

## Contributing

This is a private project for the boys trip. Add your intro and help make it better!

## Support

For issues or questions, contact the trip organizer.

---

Built with ❤️ for an epic adventure!
