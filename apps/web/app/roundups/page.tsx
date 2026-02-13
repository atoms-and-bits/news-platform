'use client';

import React from 'react';
import { ArticleListCard } from '../components/ArticleListCard';
import { allArticles } from '../data/articles';
import { useRouter } from 'next/navigation';

export default function RoundupsPage() {
  const router = useRouter();
  
  // Filter for roundup articles or just show a selection for now
  // In a real app, this would filter by category="Weekly Roundup"
  const roundupArticles = allArticles.filter(
    (a) =>
    a.category.toLowerCase().includes('roundup') ||
    a.title.toLowerCase().includes('roundup') ||
    a.category === 'Featured' // Adding featured to fill the page
  );
  return (
    <div className="pb-12">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {roundupArticles.length > 0 ?
          roundupArticles.map((article) =>
          <ArticleListCard
            key={article.id}
            category={article.category}
            title={article.title}
            excerpt={article.excerpt}
            author={article.author}
            time={article.time}
            imageUrl={article.imageUrl}
            onClick={() => router.push(`/article/${article.id}`)} />

          ) :
          // Fallback if no specific roundup articles found in mock data
          allArticles.slice(0, 5).map((article) =>
          <ArticleListCard
            key={article.id}
            category="Weekly Roundup"
            title={`Roundup: ${article.title}`}
            excerpt={article.excerpt}
            author={article.author}
            time={article.time}
            imageUrl={article.imageUrl}
            onClick={() => router.push(`/article/${article.id}`)} />

          )}
        </div>
      </div>
    </div>);

}
