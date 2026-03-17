/**
 * Featured Articles Page
 * Displays only articles marked as featured, sorted by publish date
 * Data fetched from Sanity CMS with ISR
 */

import React from 'react';
import { ArticleListCard } from '../components/ArticleListCard';
import { TopHeadlines } from '../components/TopHeadlines';
import { getFeaturedArticles } from '../../lib/sanity/queries';
import { formatRelativeTime } from '../../lib/utils/dateHelpers';
import { urlFor } from '../../lib/sanity/image';

export default async function FeaturedPage() {
  const sanityArticles = await getFeaturedArticles();

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

  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#000137]">
            Featured Stories
          </h1>
          <p className="mt-2 text-gray-600 font-sans">
            Hand-picked stories and deep dives from the East African tech ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No featured stories yet. Check back soon.</p>
              </div>
            ) : (
              articles.map((article) => (
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
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <TopHeadlines />

              <div className="mt-8 bg-[#2f3192] rounded-xl p-6 text-center text-white">
                <h3 className="font-serif font-bold text-xl mb-2">
                  Daily Briefing
                </h3>
                <p className="text-sm text-white/80 mb-4 font-sans">
                  Get the most important tech news from Tanzania delivered to
                  your inbox every morning.
                </p>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-md text-[#000137] text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="w-full py-2 bg-[#000137] text-white font-bold text-sm rounded-md hover:bg-[#000137]/80 transition-colors">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 60;
