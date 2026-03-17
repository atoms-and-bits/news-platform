/**
 * Latest News Page
 * Displays all articles sorted by publish date (newest first)
 * Data fetched from Sanity CMS with ISR (Incremental Static Regeneration)
 */

import React from 'react';
import Link from 'next/link';
import { ArticleListCard } from '../components/ArticleListCard';
import { TopHeadlines } from '../components/TopHeadlines';
import { SidebarCTA } from '../components/SidebarCTA';
import { getAllArticles } from '../../lib/sanity/queries';
import { formatRelativeTime } from '../../lib/utils/dateHelpers';
import { urlFor } from '../../lib/sanity/image';

// ─── Server Component (fetches data at build time + revalidates) ───
export default async function LatestPage() {
  // Fetch all articles from Sanity (sorted by publishedAt desc)
  const sanityArticles = await getAllArticles();

  // Transform Sanity data to match ArticleListCard props
  const articles = sanityArticles.map((article) => ({
    id: article._id,
    slug: article.slug.current, // Extract slug for navigation
    category: article.category,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    time: formatRelativeTime(article.publishedAt), // Convert ISO to "8 hours ago"
    imageUrl: article.mainImage
      ? urlFor(article.mainImage).width(800).height(600).url() // Use Sanity image if available
      : 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', // Fallback placeholder
  }));

  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#000137]">
            Latest News
          </h1>
          <p className="mt-2 text-gray-600 font-sans">
            Breaking stories and updates from across the East African tech
            ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {articles.map((article) => (
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
            ))}

            {/* Load More Button */}
            <div className="pt-8 flex justify-center">
              <Link
                href="/stories"
                className="px-8 py-3 bg-white border border-gray-300 text-[#000137] font-bold rounded-md hover:bg-gray-50 hover:border-[#000137] transition-all shadow-sm">
                VIEW ALL STORIES
              </Link>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <TopHeadlines />

              <SidebarCTA />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ISR Configuration ───────────────────────────────────────
/**
 * Revalidate this page every 60 seconds
 * This enables Incremental Static Regeneration (ISR):
 * - Page is statically generated at build time
 * - After 60 seconds, the next request triggers a regeneration
 * - New content from Sanity appears automatically without redeploying
 */
export const revalidate = 60; // Revalidate every 60 seconds
