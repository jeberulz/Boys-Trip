# Boys Trip Intro App

A Next.js web application for trip participants to share personal introductions and get to know each other before the adventure begins.

## Features

- 🏠 **Landing Page** - Trip details and participant count with real-time updates
- 📝 **Intro Submission Form** - Comprehensive form to submit personal details
- 🖼️ **Gallery View** - Browse all participant profiles as interactive cards
- 👤 **Individual Profiles** - Detailed view of each participant's intro
- ⚡ **Real-time Updates** - Powered by Convex for instant synchronization
- 📱 **Mobile-First Design** - Responsive layout with navy and orange theme
- 🔓 **No Authentication Required** - Open access for all trip participants

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

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /gallery          # Gallery page showing all profiles
  /profile/[id]     # Individual profile view
  /submit           # Form to submit new intro
  page.tsx          # Landing page
  layout.tsx        # Root layout with Convex provider
  globals.css       # Global styles with Tailwind

/convex
  schema.ts         # Database schema definition
  profiles.ts       # Convex queries and mutations
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
- `photoUrl` - Optional photo URL
- `createdAt` - Timestamp

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
