# Atoms & Bits - Codebase Guide

## 🏗️ Project Structure

```
news-platform/
├── apps/
│   └── web/                    # Main Next.js app
│       ├── app/
│       │   ├── components/     # React components
│       │   ├── data/          # 🔴 MOCK DATA (Replace with Sanity)
│       │   ├── */page.tsx     # Route pages
│       │   ├── layout.tsx     # Root layout
│       │   └── globals.css    # Global styles
│       └── public/            # Static assets
├── packages/                   # Shared packages
└── turbo.json                 # Monorepo config
```

## 📊 Data Architecture (Current - Mock Data)

### 1. Articles (`apps/web/app/data/articles.ts`)
```typescript
interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  time: string;
  readTime: string;
  imageUrl: string;
  body: string[];
  featured?: boolean;
  premium?: boolean;
}
```

**Helper Functions:**
- `getArticleById(id)` - Fetch single article
- `getArticlesByCategory(category)` - Filter by category
- `getLatestArticles(count)` - Get recent articles
- `getFeaturedArticles` - Get featured articles

**Usage:**
- Homepage hero grid
- `/latest` - Latest articles page
- `/stories` - All stories with category filter
- `/article/[slug]` - Article detail page

---

### 2. Content (`apps/web/app/data/content.ts`)

**Podcasts:**
```typescript
interface Podcast {
  id: number;
  title: string;
  duration: string;
  description: string;
  date: string;
}
```

**Events:**
```typescript
interface Event {
  id: number;
  date: string;
  month: string;
  title: string;
  location: string;
  description: string;
  time: string;
  venue: string;
  premium: boolean;
}
```

**Usage:**
- `/podcasts` - Podcast episodes list
- `/events` - Event listings with registration
- Homepage preview sections

---

### 3. Startups (`apps/web/app/data/startups.ts`)
```typescript
interface Startup {
  id: number;
  name: string;
  logo: string;
  sector: string;
  description: string;
  location: string;
  founded: string;
  stage: string;
  teamSize: string;
  funding?: string;
  website: string;
  founders: Founder[];
}
```

**Usage:**
- `/startups` - Startup directory with search
- `/startup/[slug]` - Startup profile page

---

## 🎨 Component Hierarchy

### Layout Components
```
ClientLayout (wraps everything)
├── Header (navigation + auth)
└── Footer (links + newsletter)
```

### Content Components

**Article Display:**
- `ArticleCard` - Hero/featured article cards (large)
- `ArticleListCard` - List view cards (compact)

**Page Sections:**
- `HeroGrid` - Homepage hero (3-column grid)
- `LatestPreview` - Latest articles preview
- `FeaturedRoundup` - Featured + weekly roundup
- `PodcastsEvents` - Podcasts + events preview
- `TopHeadlines` - Sidebar headlines
- `NewsletterBanner` - Email signup CTA
- `Testimonials` - User testimonials

---

## 🚦 Routes & Data Dependencies

| Route | Component | Data Source | Auth Required |
|-------|-----------|-------------|---------------|
| `/` | `page.tsx` | All 3 data files | No |
| `/latest` | `latest/page.tsx` | `articles.ts` | No |
| `/stories` | `stories/page.tsx` | `articles.ts` | No |
| `/article/[slug]` | `article/[slug]/page.tsx` | `articles.ts` | Premium check |
| `/roundups` | `roundups/page.tsx` | `articles.ts` | No |
| `/podcasts` | `podcasts/page.tsx` | `content.ts` | No |
| `/events` | `events/page.tsx` | `content.ts` | Premium events |
| `/startups` | `startups/page.tsx` | `startups.ts` | No |
| `/startup/[slug]` | `startup/[slug]/page.tsx` | `startups.ts` | No |
| `/signin` | `signin/page.tsx` | None | N/A |
| `/subscribe` | `subscribe/page.tsx` | None | N/A |
| `/profile` | `profile/page.tsx` | User context | Yes |

---

## 🔄 Data Flow (Current)

```
Static Data Files (*.ts)
    ↓
    Export arrays of objects
    ↓
    Import in pages/components
    ↓
    Render in React components
```

**Example:**
```typescript
// In data/articles.ts
export const allArticles = [...];

// In page.tsx
import { allArticles } from '../data/articles';

export default function LatestPage() {
  return <div>{allArticles.map(...)}</div>
}
```

---

## 🎯 Next Steps for Sanity Integration

### Phase 1: Setup Sanity
1. Initialize Sanity project
2. Create schemas based on TypeScript interfaces
3. Migrate mock data to Sanity Studio

### Phase 2: Create Data Layer
1. Create `lib/sanity.ts` - Sanity client setup
2. Create `lib/queries.ts` - GROQ queries
3. Replace mock data imports with Sanity fetches

### Phase 3: Update Components
1. Convert static pages to async Server Components
2. Replace mock data with `await sanity.fetch()`
3. Add ISR (Incremental Static Regeneration)

### Phase 4: Dynamic Routes
1. Implement `generateStaticParams()` for `[slug]` routes
2. Add on-demand revalidation

---

## 🔐 Authentication (Placeholder)

**Current State:**
- Mock user in `ClientLayout.tsx`
- No real authentication
- Premium content checks are simulated

**Future Integration:**
- Add Supabase/NextAuth
- Integrate with subscription system
- Gate premium content

---

## 📦 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Monorepo:** Turborepo
- **Package Manager:** pnpm

---

## 🐛 Known TODOs

Search codebase for `// TODO:` comments:
```bash
grep -r "TODO:" apps/web/app --include="*.tsx" --include="*.ts"
```

Common todos:
- Convert onClick handlers to use Link components
- Replace mock user with real auth
- Add actual API endpoints for forms
- Implement real event registration

---

## 📝 Coding Patterns

### Component Structure
```typescript
'use client'; // If uses hooks/interactivity

import React from 'react';
import Link from 'next/link';
// Other imports...

interface Props {
  // Props definition
}

export function ComponentName({ props }: Props) {
  // Component logic
  return (
    // JSX
  );
}
```

### Styling Patterns
- Navy blue: `#000137` (primary dark)
- Purple: `#2f3192` (brand color)
- Light gray: `#f8f9fa` (background)
- Amber: `amber-400` (premium badges)

### Navigation
- Use `<Link>` from `next/link` for internal links
- Use `useRouter()` from `next/navigation` for programmatic navigation
- Use `usePathname()` to detect current route

---

## 🚀 Development Commands

```bash
# Install dependencies
pnpm install

# Run dev server (port 3000)
cd apps/web && npm run dev

# Build for production
cd apps/web && npm run build

# Run production build
cd apps/web && npm start
```

---

## 📚 Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Turborepo](https://turbo.build)
