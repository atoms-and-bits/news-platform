'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArticleListCard } from '../components/ArticleListCard';
import { allArticles, getArticlesByCategory } from '../data/articles';
import { useRouter } from 'next/navigation';

export default function AllStoriesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = [
  'All',
  'AI',
  'Fintech',
  'Infrastructure',
  'Clean Energy',
  'Policy & Tech',
  'Venture Capital'];

  const displayedArticles = getArticlesByCategory(activeCategory);
  return (
    <div className="pb-20">
      <div className="bg-[#000137] text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            All Stories
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-sans">
            Explore our complete archive of tech news, analysis, and deep dives
            from across East Africa.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
          {categories.map((cat) =>
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[#000137] text-white shadow-md' : 'bg-white text-[#000137] border border-gray-200 hover:bg-gray-50'}`}>

              {cat}
            </button>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedArticles.map((article, index) =>
          <motion.div
            key={article.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.05
            }}>

              <ArticleListCard
              category={article.category}
              title={article.title}
              excerpt={article.excerpt}
              author={article.author}
              time={article.time}
              imageUrl={article.imageUrl}
              onClick={() => router.push(`/article/${article.id}`)} />

            </motion.div>
          )}
        </div>

        {displayedArticles.length === 0 &&
        <div className="text-center py-20 text-gray-500">
            No articles found in this category.
          </div>
        }
      </div>
    </div>);

}
