'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ArticleListCard } from './ArticleListCard';
import { getLatestArticles } from '../data/articles';

export function LatestPreview() {
  const articles = getLatestArticles(4);
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
              Africa's tech landscape.
            </p>
          </div>
          <Link
            href="/latest"
            className="hidden md:flex items-center gap-2 text-[#000137] font-bold text-sm hover:gap-3 transition-all group">
            VIEW ALL LATEST{' '}
            <ArrowRight className="w-4 h-4 group-hover:text-[#2f3192]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) =>
          <Link key={article.id} href={`/article/${article.id}`}>
            <ArticleListCard
              category={article.category}
              title={article.title}
              excerpt={article.excerpt}
              author={article.author}
              time={article.time}
              imageUrl={article.imageUrl} />
          </Link>
          )}
        </div>

        <div className="mt-8 md:hidden flex justify-center">
          <Link
            href="/latest"
            className="flex items-center gap-2 text-[#000137] font-bold text-sm">
            VIEW ALL LATEST <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>);

}