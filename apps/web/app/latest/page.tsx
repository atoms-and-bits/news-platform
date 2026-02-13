'use client';

import React from 'react';
import Link from 'next/link';
import { ArticleListCard } from '../components/ArticleListCard';
import { TopHeadlines } from '../components/TopHeadlines';
import { allArticles } from '../data/articles';

export default function LatestPage() {
  const articles = allArticles;

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
                category={article.category}
                title={article.title}
                excerpt={article.excerpt}
                author={article.author}
                time={article.time}
                imageUrl={article.imageUrl}
                onClick={() => {}} // TODO: Convert to use Link in ArticleListCard component
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

              {/* Newsletter Box (Mini) */}
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
                  className="w-full px-4 py-2 rounded-md text-[#000137] text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-white/50" />
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
