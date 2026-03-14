/**
 * Homepage
 * Server component: Fetches all data from Sanity and passes to client components
 */

import React from 'react';
import { HeroGrid } from './components/HeroGrid';
import { LatestPreview } from './components/LatestPreview';
import { FeaturedRoundup } from './components/FeaturedRoundup';
import { PodcastsEvents } from './components/PodcastsEvents';
import { NewsletterBanner } from './components/NewsletterBanner';
import { Testimonials } from './components/Testimonials';
import { ArrowRight } from 'lucide-react';
import { getAllArticles, getAllPodcasts, getAllEvents } from '../lib/sanity/queries';
import { formatRelativeTime } from '../lib/utils/dateHelpers';
import { urlFor } from '../lib/sanity/image';

// ─── Server Component ────────────────────────────────────────
export default async function Home() {
  // Fetch all data from Sanity in parallel
  const [sanityArticles, sanityPodcasts, sanityEvents] = await Promise.all([
    getAllArticles(),
    getAllPodcasts(),
    getAllEvents(),
  ]);

  // Transform articles for different sections
  const transformArticle = (article: typeof sanityArticles[0]) => ({
    id: article._id,
    slug: article.slug.current,
    category: article.category,
    title: article.title,
    excerpt: article.excerpt || '',
    author: article.author,
    time: formatRelativeTime(article.publishedAt),
    imageUrl: article.mainImage
      ? urlFor(article.mainImage).width(800).height(600).url()
      : 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    premium: article.premium || false,
  });

  // HeroGrid: First 3 articles
  const heroArticles = sanityArticles.slice(0, 3).map(transformArticle);

  // LatestPreview: Next 4 articles (4-7)
  const latestArticles = sanityArticles.slice(3, 7).map(transformArticle);

  // FeaturedRoundup: Editor picks (8-9) + Roundup stories (10-12)
  const editorPicks = sanityArticles.slice(7, 9).map(transformArticle);
  const roundupStories = sanityArticles.slice(9, 12).map(transformArticle);

  // Transform podcasts (first 3)
  const podcasts = sanityPodcasts.slice(0, 3).map((podcast) => ({
    id: podcast._id,
    title: podcast.title,
    duration: podcast.duration,
    description: podcast.description,
    audioUrl: podcast.audioUrl || '',
    coverImage: podcast.coverImage
      ? urlFor(podcast.coverImage).width(400).height(400).url()
      : '',
  }));

  // Transform events (first 3)
  const events = sanityEvents.slice(0, 3).map((event) => ({
    id: event._id,
    title: event.title,
    date: event.date,
    month: event.month,
    time: event.time || '',
    location: event.location,
    venue: event.venue || '',
    capacity: event.capacity ?? null,
    description: event.description || '',
    premium: event.premium || false,
  }));

  return (
    <>
      {/* Pass first 3 articles to HeroGrid */}
      <HeroGrid articles={heroArticles} />

      {/* Bayana Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
        <a
          href="#"
          className="group block w-full bg-[#2f3192] rounded-xl p-4 text-center shadow-md hover:bg-[#242675] transition-colors">
          <span className="text-white font-medium flex items-center justify-center gap-2">
            Explore <span className="font-bold tracking-wide">BAYANA</span> —
            Our AI-powered data research platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </a>
      </div>

      {/* Pass Sanity data to all sections */}
      <LatestPreview articles={latestArticles} />
      <FeaturedRoundup editorPicks={editorPicks} roundupStories={roundupStories} />
      <PodcastsEvents podcasts={podcasts} events={events} />
      <Testimonials />
      <NewsletterBanner />

      {/* Bottom spacing before footer */}
      <div className="h-16 bg-white"></div>
    </>
  );
}

// ─── ISR Configuration ───────────────────────────────────────
export const revalidate = 60; // Revalidate every 60 seconds
