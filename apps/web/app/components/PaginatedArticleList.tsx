'use client';

import React from 'react';
import Link from 'next/link';
import { ArticleListCard } from './ArticleListCard';
import { usePagination } from '../../lib/hooks/usePagination';

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

interface PaginatedArticleListProps {
  articles: Article[];
  pageSize?: number;
  emptyMessage?: string;
  /** If provided, renders a "View All" link next to the Load More button */
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function PaginatedArticleList({
  articles,
  pageSize = 12,
  emptyMessage = 'No articles found.',
  viewAllHref,
  viewAllLabel = 'VIEW ALL STORIES',
}: PaginatedArticleListProps) {
  const { displayedItems, hasMore, loadMore } = usePagination(articles, pageSize);

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  const showActions = hasMore || viewAllHref;

  return (
    <>
      <div className="space-y-6">
        {displayedItems.map((article) => (
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

      {showActions && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full sm:w-auto px-8 py-3 bg-[#000137] text-white font-bold text-sm rounded-lg hover:bg-[#2f3192] transition-colors shadow-sm"
            >
              Load More Stories
            </button>
          )}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="w-full sm:w-auto px-8 py-3 bg-white border border-gray-300 text-[#000137] font-bold text-sm rounded-lg hover:bg-gray-50 hover:border-[#000137] transition-all shadow-sm text-center"
            >
              {viewAllLabel}
            </Link>
          )}
        </div>
      )}
    </>
  );
}
