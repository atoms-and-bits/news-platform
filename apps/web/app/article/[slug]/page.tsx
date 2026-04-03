/**
 * Article Detail Page
 * Displays full article content with paywall support
 * Server component: Fetches data from Sanity
 * Client components: ArticleContent (for animations)
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticles } from '../../../lib/sanity/queries';
import { formatRelativeTime } from '../../../lib/utils/dateHelpers';
import { urlFor } from '../../../lib/sanity/image';
import { ArticleContent } from './ArticleContent';

// ─── Type Definitions ────────────────────────────────────────
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ─── Server Component ────────────────────────────────────────
export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch article from Sanity by slug
  const sanityArticle = await getArticleBySlug(slug);

  // If article not found, show 404
  if (!sanityArticle) {
    notFound();
  }

  // Transform data for display
  const article = {
    id: sanityArticle._id,
    slug: sanityArticle.slug.current,
    category: sanityArticle.category,
    title: sanityArticle.title,
    excerpt: sanityArticle.excerpt,
    author: sanityArticle.author,
    authorRole: sanityArticle.authorRole,
    time: formatRelativeTime(sanityArticle.publishedAt),
    readTime: sanityArticle.readTime,
    imageUrl: sanityArticle.mainImage?.asset
      ? urlFor(sanityArticle.mainImage).width(1200).height(800).url()
      : undefined,
    body: sanityArticle.body, // Portable Text blocks
    premium: sanityArticle.premium || false,
    featured: sanityArticle.featured || false,
  };

  // Fetch related articles (same category)
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.category === article.category && a._id !== article.id)
    .slice(0, 3)
    .map((a) => ({
      id: a._id,
      slug: a.slug.current,
      category: a.category,
      title: a.title,
      time: formatRelativeTime(a.publishedAt),
      imageUrl: a.mainImage?.asset
        ? urlFor(a.mainImage).width(600).height(400).url()
        : undefined,
    }));

  return <ArticleContent article={article} relatedArticles={relatedArticles} />;
}

// ─── ISR Configuration ───────────────────────────────────────
/**
 * Generate static pages for all articles at build time
 * Then use ISR for dynamic updates
 */
export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug.current,
  }));
}

export const revalidate = 60; // Revalidate every 60 seconds
