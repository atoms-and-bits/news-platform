/**
 * Migration Script: Mock Data → Sanity CMS
 *
 * This script migrates existing mock data from TypeScript files
 * into Sanity CMS. Run this once to populate your Sanity dataset.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-sanity.ts
 *
 * What it does:
 *   1. Reads mock data from apps/web/app/data/*.ts
 *   2. Transforms data to match Sanity schema format
 *   3. Uploads to Sanity using the client API
 */

import { createClient } from '@sanity/client'

// ─── Sanity Client Setup ─────────────────────────────────────
const client = createClient({
  projectId: 'y15xx98w',
  dataset: 'production',
  apiVersion: '2026-02-16',
  useCdn: false, // false for write operations
  token: process.env.SANITY_API_TOKEN, // Must have write permissions
})

// ─── Mock Data Imports ───────────────────────────────────────
// Note: Adjust paths if running from different directory
const { allArticles } = require('../apps/web/app/data/articles')
const { podcasts, events } = require('../apps/web/app/data/content')
const { startups } = require('../apps/web/app/data/startups')

// ─── Helper Functions ────────────────────────────────────────

/**
 * Convert article body (string array) to Portable Text blocks
 * Each paragraph becomes a block of type 'block'
 */
function bodyToPortableText(bodyArray: string[]) {
  return bodyArray.map((paragraph) => ({
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: paragraph,
        marks: [],
      },
    ],
  }))
}

/**
 * Convert relative time string to ISO datetime
 * Examples: "8 hours ago" → ISO date
 */
function relativeTimeToISO(timeString: string): string {
  const now = new Date()

  if (timeString.includes('hours ago')) {
    const hours = parseInt(timeString)
    now.setHours(now.getHours() - hours)
  } else if (timeString.includes('days ago')) {
    const days = parseInt(timeString)
    now.setDate(now.getDate() - days)
  } else if (timeString.includes('week ago')) {
    now.setDate(now.getDate() - 7)
  } else if (timeString.includes('weeks ago')) {
    const weeks = parseInt(timeString)
    now.setDate(now.getDate() - (weeks * 7))
  }

  return now.toISOString()
}

/**
 * Convert date string to ISO datetime
 * Examples: "Feb 10, 2026" → ISO date
 */
function dateStringToISO(dateString: string): string {
  return new Date(dateString).toISOString()
}

/**
 * Generate slug from title
 * Examples: "Hello World" → "hello-world"
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Migration Functions ─────────────────────────────────────

/**
 * Migrate Articles
 * Transforms: id → slug, time → publishedAt, body → Portable Text
 */
async function migrateArticles() {
  console.log('\n📄 Migrating Articles...')

  for (const article of allArticles) {
    try {
      const sanityArticle = {
        _type: 'article',
        title: article.title,
        slug: {
          _type: 'slug',
          current: article.id, // Use existing ID as slug
        },
        category: article.category,
        excerpt: article.excerpt,
        author: article.author,
        authorRole: article.authorRole,
        publishedAt: relativeTimeToISO(article.time),
        readTime: article.readTime,
        body: bodyToPortableText(article.body),
        featured: article.featured || false,
        premium: article.premium || false,
        // Note: mainImage is a URL string in mock data
        // For now, we'll skip images - you can manually upload them in Studio
        // Or extend this script to download and upload images
      }

      await client.create(sanityArticle)
      console.log(`✅ Created article: ${article.title}`)
    } catch (error) {
      console.error(`❌ Failed to create article "${article.title}":`, error)
    }
  }

  console.log(`\n✅ Migrated ${allArticles.length} articles`)
}

/**
 * Migrate Podcasts
 * Transforms: date → publishedAt, removes id
 */
async function migratePodcasts() {
  console.log('\n🎙️  Migrating Podcasts...')

  for (const podcast of podcasts) {
    try {
      const sanityPodcast = {
        _type: 'podcast',
        title: podcast.title,
        duration: podcast.duration,
        description: podcast.description,
        publishedAt: dateStringToISO(podcast.date),
        // Note: audioUrl and coverImage not in mock data
        // You'll need to add these manually in Studio
      }

      await client.create(sanityPodcast)
      console.log(`✅ Created podcast: ${podcast.title}`)
    } catch (error) {
      console.error(`❌ Failed to create podcast "${podcast.title}":`, error)
    }
  }

  console.log(`\n✅ Migrated ${podcasts.length} podcasts`)
}

/**
 * Migrate Events
 * Data already matches schema format closely
 */
async function migrateEvents() {
  console.log('\n📅 Migrating Events...')

  for (const event of events) {
    try {
      const sanityEvent = {
        _type: 'event',
        title: event.title,
        date: event.date, // Already string like "15"
        month: event.month, // Already string like "FEB"
        location: event.location,
        description: event.description,
        time: event.time,
        venue: event.venue,
        premium: event.premium || false,
      }

      await client.create(sanityEvent)
      console.log(`✅ Created event: ${event.title}`)
    } catch (error) {
      console.error(`❌ Failed to create event "${event.title}":`, error)
    }
  }

  console.log(`\n✅ Migrated ${events.length} events`)
}

/**
 * Migrate Startups
 * Transforms: id → slug, keeps all other fields
 */
async function migrateStartups() {
  console.log('\n🚀 Migrating Startups...')

  for (const startup of startups) {
    try {
      const sanityStartup = {
        _type: 'startup',
        name: startup.name,
        slug: {
          _type: 'slug',
          current: slugify(startup.name),
        },
        sector: startup.sector,
        location: startup.location,
        description: startup.description,
        longDescription: startup.longDescription,
        website: startup.website,
        founded: startup.founded,
        teamSize: startup.teamSize,
        funding: startup.funding,
        stage: startup.stage,
        logo: startup.logo,
        founders: startup.founders,
      }

      await client.create(sanityStartup)
      console.log(`✅ Created startup: ${startup.name}`)
    } catch (error) {
      console.error(`❌ Failed to create startup "${startup.name}":`, error)
    }
  }

  console.log(`\n✅ Migrated ${startups.length} startups`)
}

// ─── Main Migration Runner ───────────────────────────────────

async function main() {
  console.log('🚀 Starting migration to Sanity...\n')
  console.log('Project ID:', client.config().projectId)
  console.log('Dataset:', client.config().dataset)

  // Check if token is set
  if (!process.env.SANITY_API_TOKEN) {
    console.error('\n❌ Error: SANITY_API_TOKEN environment variable not set!')
    console.log('\nHow to fix:')
    console.log('1. Go to https://sanity.io/manage')
    console.log('2. Select your project')
    console.log('3. Go to API → Tokens')
    console.log('4. Create a token with "Editor" permissions')
    console.log('5. Run: export SANITY_API_TOKEN="your-token-here"')
    console.log('6. Then run this script again\n')
    process.exit(1)
  }

  try {
    // Run migrations in sequence
    await migrateArticles()
    await migratePodcasts()
    await migrateEvents()
    await migrateStartups()

    console.log('\n🎉 Migration complete!')
    console.log('\nNext steps:')
    console.log('1. Open Sanity Studio: cd apps/atoms-and-bits-news && pnpm dev')
    console.log('2. Verify all content appears correctly')
    console.log('3. Manually upload images for articles/podcasts')
    console.log('4. Update Next.js pages to use Sanity data\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
main()
