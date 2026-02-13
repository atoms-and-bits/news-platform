'use client';

import React, { use, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User as UserIcon, Lock } from 'lucide-react';
import { getArticleById, getArticlesByCategory } from '../../data/articles';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface UserType {
  name: string;
  email: string;
  plan: 'free' | 'basic' | 'standard' | 'premium';
}

export default function ArticlePage({ params }: PageProps) {
  const { slug } = use(params);
  const article = getArticleById(slug);
  
  // TODO: Replace with actual user authentication (Supabase)
  const user: UserType | null = null;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#000137] mb-4">
            Article not found
          </h1>
          <Link href="/latest" className="text-[#2f3192] hover:underline">
            Back to Latest News
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = getArticlesByCategory(article.category)
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  // Paywall Logic: Check article.premium flag
  const isLocked = article.premium === true && !user;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white font-sans pb-20">

      {/* Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-gray-100 py-3">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/latest"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#000137] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex gap-2">
            <span className="text-xs font-bold text-[#2f3192] bg-[#2f3192]/10 px-2 py-1 rounded-md uppercase tracking-wider">
              {article.category}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 mt-8 md:mt-12 relative">
        {/* Header */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#000137] leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 font-medium border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[#000137]">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#000137] font-bold block leading-none">
                  {article.author}
                </span>
                <span className="text-xs font-normal">
                  {article.authorRole}
                </span>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{article.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[300px] md:h-[450px] object-cover" />
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-right italic border-t border-gray-100">
            Image via Unsplash
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg prose-indigo max-w-none mb-16 relative">
          <p className="lead text-xl md:text-2xl text-gray-600 font-serif leading-relaxed mb-8">
            {article.excerpt}
          </p>

          {isLocked ? (
            <>
              {/* Show first paragraph only */}
              <p className="text-gray-800 leading-relaxed mb-6 font-sans text-lg blur-[1px]">
                {article.body[0]}
              </p>
              <p className="text-gray-800 leading-relaxed mb-6 font-sans text-lg blur-sm select-none">
                {article.body[1]}
              </p>

              {/* Paywall Overlay */}
              <div className="absolute inset-0 top-32 bg-gradient-to-b from-transparent via-white/90 to-white z-10 flex flex-col items-center justify-end pb-20">
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-md text-center mx-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#000137] mb-2">
                    Read the full story
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This deep-dive analysis is available exclusively to Premium
                    members.
                  </p>
                  <Link
                    href="/subscribe"
                    className="block w-full bg-[#000137] text-white font-bold py-3 rounded-lg hover:bg-[#2f3192] transition-colors mb-3">
                    UPGRADE TO PREMIUM
                  </Link>
                  <p className="text-xs text-gray-500">
                    Already a member?{' '}
                    <Link
                      href="/signin"
                      className="text-[#2f3192] font-bold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </>
          ) : (
            article.body.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-gray-800 leading-relaxed mb-6 font-sans text-lg">
                {paragraph}
              </p>
            ))
          )}
        </div>

        {/* Tags / Share (Placeholder) */}
        {!isLocked && (
          <div className="border-t border-b border-gray-100 py-6 mb-16 flex justify-between items-center">
            <div className="flex gap-2">
              <span className="text-sm font-bold text-gray-400">TAGS:</span>
              <span className="text-sm text-[#2f3192] font-medium hover:underline cursor-pointer">
                {article.category}
              </span>
              <span className="text-sm text-[#2f3192] font-medium hover:underline cursor-pointer">
                Technology
              </span>
              <span className="text-sm text-[#2f3192] font-medium hover:underline cursor-pointer">
                East Africa
              </span>
            </div>
            <button className="text-sm font-bold text-[#000137] border border-[#000137] px-4 py-2 rounded hover:bg-[#000137] hover:text-white transition-colors">
              SHARE ARTICLE
            </button>
          </div>
        )}
      </article>

      {/* Related Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-2xl mb-12">
        <h3 className="font-serif text-2xl font-bold text-[#000137] mb-8">
          Related Stories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((related) => (
            <Link
              key={related.id}
              href={`/article/${related.id}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src={related.imageUrl}
                    alt={related.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[#2f3192] text-xs font-bold uppercase mb-2">
                    {related.category}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#000137] mb-2 line-clamp-2">
                    {related.title}
                  </h4>
                  <div className="mt-auto text-xs text-gray-400 pt-4">
                    {related.time}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
