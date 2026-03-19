import { client } from "./client";
import type {
  SanityArticle,
  SanityPodcast,
  SanityEvent,
  SanityStartup,
} from "./types";

// ─── Articles ────────────────────────────────────────────

/** Fetch all articles, newest first */
export async function getAllArticles(): Promise<SanityArticle[]> {
  return client.fetch(
    `*[_type == "article"] | order(publishedAt desc) {
      _id, _createdAt, _updatedAt,
      title, slug, category, excerpt,
      author, authorRole, publishedAt, readTime,
      mainImage, featured, editorsPick, premium
    }`
  );
}

/** Fetch editor's picks (latest 2 articles marked as editorsPick) */
export async function getEditorsPicks(): Promise<SanityArticle[]> {
  return client.fetch(
    `*[_type == "article" && editorsPick == true] | order(publishedAt desc)[0...2] {
      _id, title, slug, category, excerpt,
      author, publishedAt, mainImage, premium
    }`
  );
}

/** Fetch weekly roundup articles (latest 3 marked as weeklyRoundup) */
export async function getRoundupArticles(): Promise<SanityArticle[]> {
  return client.fetch(
    `*[_type == "article" && weeklyRoundup == true] | order(publishedAt desc)[0...3] {
      _id, title, slug, category, excerpt,
      author, publishedAt, mainImage, premium
    }`
  );
}

/** Fetch featured articles only */
export async function getFeaturedArticles(): Promise<SanityArticle[]> {
  return client.fetch(
    `*[_type == "article" && featured == true] | order(publishedAt desc) {
      _id, title, slug, category, excerpt,
      author, authorRole, publishedAt, readTime,
      mainImage, featured, premium
    }`
  );
}

/** Fetch articles by an array of Sanity document IDs */
export async function getArticlesByIds(ids: string[]): Promise<SanityArticle[]> {
  if (ids.length === 0) return [];
  return client.fetch(
    `*[_type == "article" && _id in $ids] | order(publishedAt desc) {
      _id, title, slug, category, excerpt,
      author, publishedAt, mainImage
    }`,
    { ids }
  );
}

/** Fetch a single article by its slug */
export async function getArticleBySlug(
  slug: string
): Promise<SanityArticle | null> {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id, _createdAt, _updatedAt,
      title, slug, category, excerpt,
      author, authorRole, publishedAt, readTime,
      mainImage, body, featured, premium
    }`,
    { slug }
  );
}

// ─── Podcasts ────────────────────────────────────────────

/** Fetch all podcasts, newest first */
export async function getAllPodcasts(): Promise<SanityPodcast[]> {
  return client.fetch(
    `*[_type == "podcast"] | order(publishedAt desc) {
      _id, _createdAt,
      title, duration, description, publishedAt,
      audioUrl, coverImage
    }`
  );
}

// ─── Events ──────────────────────────────────────────────

/** Fetch all events, sorted by date */
export async function getAllEvents(): Promise<SanityEvent[]> {
  return client.fetch(
    `*[_type == "event"] | order(date asc) {
      _id, _createdAt,
      title, date, month, location,
      description, time, venue, capacity, premium
    }`
  );
}

// ─── Startups ────────────────────────────────────────────

/** Fetch all startups */
export async function getAllStartups(): Promise<SanityStartup[]> {
  return client.fetch(
    `*[_type == "startup"] | order(name asc) {
      _id, _createdAt,
      name, slug, sector, location,
      description, website, founded,
      teamSize, funding, stage, logo
    }`
  );
}

/** Fetch a single startup by slug */
export async function getStartupBySlug(
  slug: string
): Promise<SanityStartup | null> {
  return client.fetch(
    `*[_type == "startup" && slug.current == $slug][0] {
      _id, _createdAt,
      name, slug, sector, location,
      description, longDescription, website,
      founded, teamSize, funding, stage, logo, founders
    }`,
    { slug }
  );
}
