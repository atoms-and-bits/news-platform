/**
 * Weekly Roundups Page
 * Server component: Fetches roundup articles from Sanity
 * Displays weekly digest articles
 */

import React from 'react';
import { PaginatedArticleList } from '../components/PaginatedArticleList';
import { getRoundupArticles } from '../../lib/sanity/queries';
import { formatRelativeTime } from '../../lib/utils/dateHelpers';
import { urlFor } from '../../lib/sanity/image';

// ─── Server Component ────────────────────────────────────────
export default async function RoundupsPage() {
  // Fetch all articles from Sanity
  const sanityRoundupArticles = await getRoundupArticles();

  // Filter for roundup articles (articles with "roundup" in category or title)
  const roundupArticles = sanityRoundupArticles
    .map((article) => ({
      id: article._id,
      slug: article.slug.current,
      category: article.category,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      time: formatRelativeTime(article.publishedAt),
      imageUrl: article.mainImage?.asset
        ? urlFor(article.mainImage).width(800).height(600).url()
        : undefined,
    }));

  return (
    <div className="pb-12">
      {/* Hero Header */}
      <div className="bg-[#000137] text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Weekly Roundups
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-sans">
            Curated digests of the most important tech stories from East Africa,
            delivered every Friday.
          </p>
        </div>
      </div>

      {/* Roundup Articles List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PaginatedArticleList
          articles={roundupArticles}
          emptyMessage="No weekly roundups available yet. Check back soon!"
        />
      </div>
    </div>
  );
}

// ─── ISR Configuration ───────────────────────────────────────
export const revalidate = 60; // Revalidate every 60 seconds
