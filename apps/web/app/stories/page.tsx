/**
 * All Stories Page
 * Server component: Fetches all articles from Sanity
 * Passes data to StoriesContent client component for filtering
 */

import React from 'react';
import { getAllArticles } from '../../lib/sanity/queries';
import { formatRelativeTime } from '../../lib/utils/dateHelpers';
import { urlFor } from '../../lib/sanity/image';
import { StoriesContent } from './StoriesContent';

// ─── Server Component ────────────────────────────────────────
export default async function AllStoriesPage() {
  // Fetch all articles from Sanity
  const sanityArticles = await getAllArticles();

  // Transform Sanity data to match component props
  const articles = sanityArticles.map((article) => ({
    id: article._id,
    slug: article.slug.current,
    category: article.category,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    time: formatRelativeTime(article.publishedAt),
    imageUrl: article.mainImage
      ? urlFor(article.mainImage).width(800).height(600).url()
      : 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  }));

  return <StoriesContent articles={articles} />;
}

// ─── ISR Configuration ───────────────────────────────────────
export const revalidate = 60; // Revalidate every 60 seconds
