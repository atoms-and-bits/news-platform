/**
 * Latest Preview Component
 * Displays 4 most recent articles on homepage
 * Client component: Renders article cards with navigation
 * Data passed from server component via props
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ArticleListCard } from './ArticleListCard';

// ─── Type Definitions ────────────────────────────────────────
interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  imageUrl: string;
}

interface LatestPreviewProps {
  articles: Article[];
}

// ─── Component ───────────────────────────────────────────────
export function LatestPreview({ articles }: LatestPreviewProps) {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#000137] mb-3">
              Latest from the Newsroom
            </h2>
            <p className="text-gray-600 font-sans max-w-2xl">
              Stay ahead of the curve with breaking stories from across East
              Africa&apos;s tech landscape.
            </p>
          </div>
          <Link
            href="/latest"
            className="hidden md:flex items-center gap-2 text-[#000137] font-bold text-sm hover:gap-3 transition-all group"
          >
            VIEW ALL LATEST{' '}
            <ArrowRight className="w-4 h-4 group-hover:text-[#2f3192]" />
          </Link>
        </div>

        {/* Article Grid - ArticleListCard handles its own Link wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>

        <div className="mt-8 md:hidden flex justify-center">
          <Link
            href="/latest"
            className="flex items-center gap-2 text-[#000137] font-bold text-sm"
          >
            VIEW ALL LATEST <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}