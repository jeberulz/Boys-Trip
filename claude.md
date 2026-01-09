# Boys Trip Intro App - Claude Code Guidelines

## Project Overview

A Next.js web application for trip participants to share personal introductions and plan activities for a Cape Town boys trip. Features real-time updates, AI-powered itinerary generation, and collaborative voting.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Backend**: Convex (real-time database & functions)
- **Styling**: Tailwind CSS
- **Language**: TypeScript (strict mode)
- **AI**: Anthropic Claude API (for itinerary generation)

## Project Structure

```
/app                    # Next.js App Router pages and components
  /components           # Reusable React components
  /gallery              # Gallery page (all profiles)
  /itinerary            # AI-powered trip planning
  /profile/[id]         # Individual profile view
  /submit               # Intro submission form
  page.tsx              # Landing page
  layout.tsx            # Root layout with providers
  globals.css           # Global Tailwind styles

/convex                 # Convex backend
  schema.ts             # Database schema definitions
  profiles.ts           # Profile queries and mutations
  itinerary.ts          # AI generation and voting logic
  photos.ts             # File upload handlers
  _generated/           # Auto-generated Convex types (do not edit)
```

## Code Style & Conventions

### TypeScript
- Use strict TypeScript with proper type annotations
- Prefer interfaces over types for object shapes
- Use Convex-generated types from `convex/_generated/`
- Import paths use `@/` alias (maps to project root)

### React Components
- Use functional components with hooks
- Client components must have `"use client"` directive at top
- Keep components focused and single-responsibility
- Props should be typed with interfaces

### Convex Backend
- Queries are read-only, mutations modify data
- Actions can call external APIs (like Anthropic)
- Use proper validators from `convex/values` (v.string(), v.number(), etc.)
- Index tables for frequently queried fields
- Never edit files in `convex/_generated/`

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Color scheme:
  - Navy (primary): `#001f3f` - backgrounds, text
  - Orange (accent): `#ff8700` - CTAs, highlights
- Use custom colors defined in tailwind.config.ts

## Environment Variables

Required in `.env.local`:
```
CONVEX_DEPLOYMENT=         # Convex deployment URL
NEXT_PUBLIC_CONVEX_URL=    # Public Convex URL
NEXT_PUBLIC_APP_PASSWORD=  # Password for access gate
ANTHROPIC_API_KEY=         # For AI itinerary generation
```

**Important**: Never commit `.env.local` or expose API keys.

## Database Schema

Four main tables in Convex:
- `profiles` - User introductions with photos
- `activities` - Trip activities (AI or user generated)
- `votes` - Upvotes/downvotes on activities
- `comments` - Comments on activities

## Development Commands

```bash
npm run dev          # Start Next.js dev server
npx convex dev       # Start Convex dev server (run alongside npm run dev)
npm run build        # Build for production
npm run lint         # Run ESLint
npx convex deploy    # Deploy Convex to production
```

## Key Patterns

### Real-time Data
Use Convex hooks for real-time updates:
```typescript
const profiles = useQuery(api.profiles.list);
const addProfile = useMutation(api.profiles.create);
```

### File Uploads
Photos use Convex file storage:
```typescript
const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
const getPhotoUrl = useQuery(api.photos.getPhotoUrl, { storageId });
```

### Password Protection
The app uses a client-side password gate stored in localStorage. Check `PasswordGate.tsx` for implementation.

## Common Tasks

### Adding a New Page
1. Create folder in `/app` with `page.tsx`
2. Use `"use client"` if interactive
3. Wrap with `ConvexClientProvider` in layout if needed

### Adding a Convex Function
1. Add to appropriate file in `/convex`
2. Run `npx convex dev` to sync
3. Import from `convex/_generated/api`

### Modifying the Schema
1. Update `convex/schema.ts`
2. Run `npx convex dev` to apply migration
3. Update related queries/mutations

## Testing Considerations

- Test on mobile viewports (mobile-first design)
- Verify real-time updates work across tabs
- Check password gate on fresh browser/incognito
- Test with and without photos uploaded

## Security Notes

- Password protection is client-side only (not production-secure)
- Anthropic API key must be kept server-side (in Convex actions)
- Validate all user inputs in Convex mutations
- File uploads are restricted to images, max 5MB
