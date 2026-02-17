/**
 * Podcasts Page
 * Server component: Fetches all podcasts from Sanity
 * Displays podcast episodes with play button and details
 */

import React from 'react';
import { Play, Calendar, Clock } from 'lucide-react';
import { getAllPodcasts } from '../../lib/sanity/queries';
import { formatRelativeTime } from '../../lib/utils/dateHelpers';

// ─── Server Component ────────────────────────────────────────
export default async function PodcastsPage() {
  // Fetch all podcasts from Sanity
  const sanityPodcasts = await getAllPodcasts();

  return (
    <div className="pb-12">
      {/* Hero Header */}
      <div className="bg-[#000137] text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            The A&B Podcast
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-sans">
            Deep conversations with the innovators, investors, and policymakers
            shaping the future of African tech.
          </p>
        </div>
      </div>

      {/* Podcast List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {sanityPodcasts.map((podcast, index) => (
            <div
              key={podcast._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Podcast Cover - Episode Number Display */}
              <div className="w-full md:w-48 h-48 bg-[#2f3192] rounded-lg flex items-center justify-center flex-shrink-0 relative group cursor-pointer">
                <span className="text-white/20 font-serif text-8xl font-bold absolute">
                  {47 - index}
                </span>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-[#2f3192] ml-1" />
                </div>
              </div>

              {/* Podcast Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-2.5 py-0.5 bg-[#2f3192]/10 text-[#2f3192] text-xs font-bold uppercase tracking-wider rounded-full">
                    EPISODE {47 - index}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{' '}
                    {formatRelativeTime(podcast.publishedAt)}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-[#000137] mb-3">
                  {podcast.title}
                </h2>

                <p className="text-gray-600 font-sans mb-4 leading-relaxed">
                  {podcast.description}
                </p>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 bg-[#000137] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#2f3192] transition-colors">
                    <Play className="w-4 h-4" /> Listen Now
                  </button>
                  <span className="text-gray-500 text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {podcast.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ISR Configuration ───────────────────────────────────────
export const revalidate = 60; // Revalidate every 60 seconds
