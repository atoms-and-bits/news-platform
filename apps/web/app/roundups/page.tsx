/**
 * Weekly Roundups Page
 * Server component: Fetches roundup articles from Sanity
 * Displays weekly digest articles
 */

import React from 'react';
import { ArticleListCard } from '../components/ArticleListCard';
import { getAllArticles } from '../../lib/sanity/queries';
import { formatRelativeTime } from '../../lib/utils/dateHelpers';
import { urlFor } from '../../lib/sanity/image';

// ─── Server Component ────────────────────────────────────────
export default async function RoundupsPage() {
  // Fetch all articles from Sanity
  const sanityArticles = await getAllArticles();

  // Filter for roundup articles (articles with "roundup" in category or title)
  const roundupArticles = sanityArticles
    .filter(
      (article) =>
        article.category.toLowerCase().includes('roundup') ||
        article.title.toLowerCase().includes('roundup')
    )
    .map((article) => ({
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
        <div className="space-y-6">
          {roundupArticles.length > 0 ? (
            roundupArticles.map((article) => (
              <ArticleListCard
                key={article.id}
                slug={article.slug}
                category={article.category}
                title={article.title}
                excerpt={article.excerpt}
                author={article.author}
                time={article.time}
                imageUrl={article.imageUrl}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 text-lg">
                No weekly roundups available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ISR Configuration ───────────────────────────────────────
export const revalidate = 60; // Revalidate every 60 seconds
