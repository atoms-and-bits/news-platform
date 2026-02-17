/**
 * Featured Roundup Component
 * Displays editor picks and weekly roundup stories on homepage
 * Client component: Renders article cards with navigation
 * Data passed from server component via props
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { ArticleCard } from './ArticleCard';

// ─── Type Definitions ────────────────────────────────────────
interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  author: string;
  time: string;
  imageUrl: string;
}

interface FeaturedRoundupProps {
  editorPicks: Article[];
  roundupStories: Article[];
}

// ─── Component ───────────────────────────────────────────────
export function FeaturedRoundup({ editorPicks, roundupStories }: FeaturedRoundupProps) {
  return (
    <section className="py-16 bg-[#f8f9fa] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Editor's Picks Column */}
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl font-bold text-[#000137] mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-[#2f3192] rounded-full"></span>
              Editor's Picks
            </h2>
            <div className="space-y-8">
              {editorPicks.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <ArticleCard
                    category={article.category}
                    title={article.title}
                    author={article.author}
                    time={article.time}
                    imageUrl={article.imageUrl}
                    size="medium"
                    className="h-[300px] shadow-md hover:shadow-xl transition-shadow" />
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Roundup Column */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl p-8 border border-gray-100 h-full">
              <h2 className="font-serif text-2xl font-bold text-[#000137] mb-2">
                Weekly Roundup
              </h2>
              <p className="text-gray-500 text-sm mb-8 font-sans">
                Our curated digest of the week's most important stories.
              </p>

              <div className="space-y-8">
                {roundupStories.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="block group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl font-serif font-bold text-gray-100 leading-none -mt-2 group-hover:text-[#2f3192]/20 transition-colors">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-[#2f3192] text-xs font-bold uppercase tracking-wider mb-1 block">
                          {article.category}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-[#000137] leading-tight group-hover:text-[#2f3192] transition-colors mb-2">
                          {article.title}
                        </h3>
                        <span className="text-gray-400 text-xs font-sans">
                          {article.time}
                        </span>
                      </div>
                    </div>
                    {index < roundupStories.length - 1 &&
                      <div className="h-px bg-gray-100 mt-6 w-full" />
                    }
                  </Link>
                ))}
              </div>

              <Link
                href="/roundups"
                className="block w-full mt-8 py-3 border border-[#000137] text-[#000137] font-bold text-sm rounded-md hover:bg-[#000137] hover:text-white transition-all text-center">
                VIEW FULL ROUNDUP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}