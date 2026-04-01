/**
 * Article Content Component
 * Client component: Handles animations, scroll behavior, and Portable Text rendering
 * Displays article body with paywall support for premium content
 */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User as UserIcon, Lock, Bookmark, BookmarkCheck, Share2, Check } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../../lib/sanity/image';

// ─── Type Definitions ────────────────────────────────────────
interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  time: string;
  readTime: string;
  imageUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[]; // Portable Text blocks from Sanity
  premium: boolean;
  featured: boolean;
}

interface RelatedArticle {
  id: string;
  slug: string;
  category: string;
  title: string;
  time: string;
  imageUrl: string;
}

interface ArticleContentProps {
  article: Article;
  relatedArticles: RelatedArticle[];
}

import { useUser } from '../../../lib/supabase/UserContext';

// ─── Portable Text Components ────────────────────────────────
/**
 * Custom components for rendering Portable Text
 * Defines how different block types should be rendered
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-gray-800 leading-relaxed mb-6 font-sans text-lg">
        {children}
      </p>
    ),
    h1: ({ children }: any) => (
      <h1 className="font-serif text-3xl font-bold text-[#000137] mt-10 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-serif text-2xl font-bold text-[#000137] mt-8 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-serif text-xl font-bold text-[#000137] mt-6 mb-2">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#2f3192] pl-4 italic text-gray-700 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-6 space-y-2">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-6 space-y-2">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }: any) => {
      const target = value?.blank ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-[#2f3192] underline hover:text-[#000137]"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ''}
            className="w-full rounded-lg shadow-sm"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    youtube: ({ value }: any) => {
      if (!value?.url) return null;
      // Extract video ID from various YouTube URL formats
      const url = value.url;
      let videoId: string | null = null;
      try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtu.be')) {
          videoId = parsed.pathname.slice(1);
        } else {
          videoId = parsed.searchParams.get('v');
        }
      } catch {
        return null;
      }
      if (!videoId) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full rounded-lg overflow-hidden shadow-sm" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={value.caption || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Main Component ──────────────────────────────────────────
export function ArticleContent({ article, relatedArticles }: ArticleContentProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: article.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  }

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.slug]);

  // Check if article is bookmarked on mount
  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('../../../lib/supabase/client') as typeof import('../../../lib/supabase/client');
    const supabase = createClient();
    supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('sanity_document_id', article.id)
      .maybeSingle()
      .then(({ data }: { data: { id: string } | null }) => {
        setIsBookmarked(!!data);
      });
  }, [user, article.id]);

  async function toggleBookmark() {
    if (!user) {
      router.push('/signin?mode=signup');
      return;
    }
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    const { createClient } = await import('../../../lib/supabase/client');
    const supabase = createClient();
    if (isBookmarked) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('sanity_document_id', article.id);
      setIsBookmarked(false);
    } else {
      await supabase.from('bookmarks').insert({
        user_id: user.id,
        sanity_document_id: article.id,
        document_type: 'article' as const,
      });
      setIsBookmarked(true);
    }
    setBookmarkLoading(false);
  }

  // Paywall: premium articles are locked unless user has a premium plan
  const isLocked = article.premium && (!user || user.plan !== 'premium');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white font-sans pb-20"
    >
      {/* Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-gray-100 py-3">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#000137] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className="text-gray-500 hover:text-[#2f3192] transition-colors disabled:opacity-50"
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-[#2f3192]" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
            <span className="text-xs font-bold text-[#2f3192] bg-[#2f3192]/10 px-2 py-1 rounded-md uppercase tracking-wider">
              {article.category}
            </span>
            {article.premium && (
              <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                {isLocked && <Lock className="w-3 h-3" />} Premium
              </span>
            )}
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
                <span className="text-xs font-normal">{article.authorRole}</span>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[300px] md:h-[450px] object-cover"
          />
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
              {/* Show first 2 blocks with blur */}
              <div className="blur-[1px]">
                <PortableText
                  value={article.body.slice(0, 1)}
                  components={portableTextComponents}
                />
              </div>
              <div className="blur-sm select-none">
                <PortableText
                  value={article.body.slice(1, 2)}
                  components={portableTextComponents}
                />
              </div>

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
                    This deep-dive analysis is available exclusively to Premium members.
                  </p>
                  {user ? (
                    <Link
                      href="/subscribe"
                      className="block w-full bg-[#000137] text-white font-bold py-3 rounded-lg hover:bg-[#2f3192] transition-colors"
                    >
                      UPGRADE TO PREMIUM
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/signin?mode=signup"
                        className="block w-full bg-[#000137] text-white font-bold py-3 rounded-lg hover:bg-[#2f3192] transition-colors mb-3"
                      >
                        SIGN UP FOR FREE
                      </Link>
                      <p className="text-xs text-gray-500">
                        Already a member?{' '}
                        <Link href="/signin" className="text-[#2f3192] font-bold hover:underline">
                          Sign in
                        </Link>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Render full article with Portable Text
            <PortableText value={article.body} components={portableTextComponents} />
          )}
        </div>

        {/* Tags / Share */}
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
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm font-bold text-[#000137] border border-[#000137] px-4 py-2 rounded hover:bg-[#000137] hover:text-white transition-colors"
            >
              {shareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {shareSuccess ? 'LINK COPIED' : 'SHARE ARTICLE'}
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
            <Link key={related.id} href={`/article/${related.slug}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={related.imageUrl}
                    alt={related.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[#2f3192] text-xs font-bold uppercase mb-2">
                    {related.category}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#000137] mb-2 line-clamp-2">
                    {related.title}
                  </h4>
                  <div className="mt-auto text-xs text-gray-400 pt-4">{related.time}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
