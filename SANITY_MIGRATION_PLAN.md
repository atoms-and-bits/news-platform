# Sanity CMS Migration Plan

## 🎯 Overview

This document outlines the step-by-step plan to replace mock data with Sanity CMS.

---

## 📋 Phase 1: Sanity Setup (30 min)

### 1. Install Sanity
```bash
cd apps/web
npm install @sanity/client @sanity/image-url next-sanity
npm install -D @sanity/types
```

### 2. Initialize Sanity Studio
```bash
# In root directory
npm create sanity@latest -- --project news-platform --dataset production
```

**Configuration:**
- Project name: `atoms-and-bits-cms`
- Dataset: `production`
- Template: `Clean project with no predefined schemas`

### 3. Create Directory Structure
```
apps/
├── web/
│   └── app/
│       └── lib/
│           ├── sanity/
│           │   ├── client.ts      # Sanity client config
│           │   ├── queries.ts     # GROQ queries
│           │   └── schemas/       # TypeScript types
│           │       ├── article.ts
│           │       ├── podcast.ts
│           │       ├── event.ts
│           │       └── startup.ts
│           └── utils/
│               └── imageBuilder.ts # Image URL builder
└── studio/                         # Sanity Studio app
    └── schemas/
        ├── article.ts
        ├── podcast.ts
        ├── event.ts
        └── startup.ts
```

---

## 🗂️ Phase 2: Schema Design (1 hour)

### Schema 1: Article
**File:** `apps/studio/schemas/article.ts`

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'AI', value: 'AI' },
          { title: 'Fintech', value: 'Fintech' },
          { title: 'Infrastructure', value: 'Infrastructure' },
          { title: 'Clean Energy', value: 'Clean Energy' },
          { title: 'Policy & Tech', value: 'Policy & Tech' },
          { title: 'Venture Capital', value: 'Venture Capital' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(200)
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    }),
    defineField({
      name: 'premium',
      title: 'Premium Content',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage'
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    }
  }
})
```

### Schema 2: Author
**File:** `apps/studio/schemas/author.ts`

```typescript
export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name'
      }
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }]
    })
  ]
})
```

### Schema 3: Podcast
**File:** `apps/studio/schemas/podcast.ts`

```typescript
export default defineType({
  name: 'podcast',
  title: 'Podcast',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'episode',
      title: 'Episode Number',
      type: 'number',
      validation: Rule => Rule.required().positive()
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "42 min"'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    }),
    defineField({
      name: 'audioFile',
      title: 'Audio File',
      type: 'file',
      options: {
        accept: 'audio/*'
      }
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image'
    })
  ]
})
```

### Schema 4: Event
**File:** `apps/studio/schemas/event.ts`

```typescript
export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title'
      }
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City'
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'premium',
      title: 'Premium Event',
      type: 'boolean',
      initialValue: false
    })
  ]
})
```

### Schema 5: Startup
**File:** `apps/studio/schemas/startup.ts`

```typescript
export default defineType({
  name: 'startup',
  title: 'Startup',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name'
      }
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'string',
      description: 'Emoji or initials'
    }),
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      options: {
        list: [
          'Fintech',
          'Agri-Tech',
          'Health Tech',
          'E-commerce',
          'Clean Energy',
          'EdTech',
          'Logistics'
        ]
      }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string'
    }),
    defineField({
      name: 'founded',
      title: 'Founded',
      type: 'string',
      description: 'Year founded'
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      options: {
        list: ['Pre-seed', 'Seed', 'Series A', 'Series B+', 'Growth']
      }
    }),
    defineField({
      name: 'teamSize',
      title: 'Team Size',
      type: 'string'
    }),
    defineField({
      name: 'funding',
      title: 'Funding',
      type: 'string',
      description: 'Total funding raised'
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url'
    }),
    defineField({
      name: 'founders',
      title: 'Founders',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'role', type: 'string', title: 'Role' },
            { name: 'bio', type: 'text', title: 'Bio' }
          ]
        }
      ]
    })
  ]
})
```

---

## 🔌 Phase 3: Sanity Client Setup (20 min)

### 1. Environment Variables
**File:** `apps/web/.env.local`

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-api-token"
```

### 2. Sanity Client
**File:** `apps/web/app/lib/sanity/client.ts`

```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Use false for SSR, true for client-side
  token: process.env.SANITY_API_TOKEN
})
```

### 3. Image Builder
**File:** `apps/web/app/lib/utils/imageBuilder.ts`

```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from '../sanity/client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

---

## 📝 Phase 4: GROQ Queries (30 min)

**File:** `apps/web/app/lib/sanity/queries.ts`

```typescript
import { groq } from 'next-sanity'

// Get all articles
export const allArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    "imageUrl": mainImage.asset->url,
    "author": author->name,
    publishedAt,
    premium,
    featured
  }
`

// Get single article by slug
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    "imageUrl": mainImage.asset->url,
    "author": author->{name, bio, "image": image.asset->url},
    publishedAt,
    body,
    premium
  }
`

// Get articles by category
export const articlesByCategoryQuery = groq`
  *[_type == "article" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    "imageUrl": mainImage.asset->url,
    "author": author->name,
    publishedAt,
    premium
  }
`

// Get all podcasts
export const allPodcastsQuery = groq`
  *[_type == "podcast"] | order(episode desc) {
    _id,
    title,
    episode,
    duration,
    description,
    publishedAt,
    "audioUrl": audioFile.asset->url
  }
`

// Get all events
export const allEventsQuery = groq`
  *[_type == "event" && date > now()] | order(date asc) {
    _id,
    title,
    slug,
    date,
    location,
    venue,
    description,
    premium
  }
`

// Get all startups
export const allStartupsQuery = groq`
  *[_type == "startup"] | order(name asc) {
    _id,
    name,
    slug,
    logo,
    sector,
    description,
    location,
    founded,
    stage,
    teamSize,
    funding,
    website
  }
`

// Get startup by slug
export const startupBySlugQuery = groq`
  *[_type == "startup" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    logo,
    sector,
    description,
    location,
    founded,
    stage,
    teamSize,
    funding,
    website,
    founders
  }
`
```

---

## 🔄 Phase 5: Data Migration (1-2 hours)

### Step 1: Export Mock Data to Sanity Format
Create a migration script:

**File:** `scripts/migrate-to-sanity.ts`

```typescript
import { client } from '../apps/web/app/lib/sanity/client'
import { allArticles } from '../apps/web/app/data/articles'
import { podcasts, events } from '../apps/web/app/data/content'
import { startups } from '../apps/web/app/data/startups'

async function migrate() {
  // Migrate articles
  for (const article of allArticles) {
    await client.create({
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: article.id.toString() },
      category: article.category,
      excerpt: article.excerpt,
      // ... map other fields
    })
  }

  // Migrate podcasts, events, startups...
}

migrate()
```

### Step 2: Run Migration
```bash
npx ts-node scripts/migrate-to-sanity.ts
```

---

## 🚀 Phase 6: Update Components (2-3 hours)

### Example: Convert Latest Page to use Sanity

**Before:** `apps/web/app/latest/page.tsx`
```typescript
import { allArticles } from '../data/articles';

export default function LatestPage() {
  const articles = allArticles;
  // ...
}
```

**After:** `apps/web/app/latest/page.tsx`
```typescript
import { client } from '../lib/sanity/client';
import { allArticlesQuery } from '../lib/sanity/queries';

export default async function LatestPage() {
  const articles = await client.fetch(allArticlesQuery);
  // ...
}
```

### Add Revalidation
```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

---

## ✅ Phase 7: Testing Checklist

- [ ] All pages load without errors
- [ ] Dynamic routes (`[slug]`) work
- [ ] Images load correctly
- [ ] ISR/revalidation working
- [ ] Premium content checks work
- [ ] Search functionality works
- [ ] Category filtering works

---

## 🎯 Migration Order (Recommended)

1. **Start with Articles** (most complex, used everywhere)
2. **Then Podcasts** (simpler, isolated)
3. **Then Events** (simpler, isolated)
4. **Finally Startups** (complex nested data)

---

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/sanity-nextjs-app-router)
- [Sanity Studio](https://www.sanity.io/docs/sanity-studio)
