/**
 * Podcasts & Events Component
 * Displays podcast episodes and upcoming events on homepage
 * Client component: Renders interactive cards
 * Data passed from server component via props
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { Play, MapPin } from 'lucide-react';

// ─── Type Definitions ────────────────────────────────────────
interface Podcast {
  id: string;
  title: string;
  duration: string;
  description: string;
  audioUrl: string;
  coverImage: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  month: string;
  time: string;
  location: string;
  venue: string;
  capacity?: number | null;
  description: string;
  premium: boolean;
}

interface PodcastsEventsProps {
  podcasts: Podcast[];
  events: Event[];
}

// ─── Component ───────────────────────────────────────────────
export function PodcastsEvents({ podcasts, events }: PodcastsEventsProps) {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Podcasts Column */}
          <div>
            <div className="flex justify-between items-baseline mb-8">
              <h2 className="font-serif text-3xl font-bold text-[#000137]">
                The A&B Podcast
              </h2>
              <Link
                href="/podcasts"
                className="text-sm font-bold text-[#2f3192] hover:underline">
                View All
              </Link>
            </div>
            <p className="text-gray-600 mb-8 font-sans">
              Conversations with the builders, investors, and policymakers
              shaping East Africa's digital future.
            </p>

            <div className="space-y-6">
              {podcasts.map((podcast, index) => (
                <div
                  key={podcast.id}
                  className="flex items-center gap-4 group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">

                  <div className="w-12 h-12 rounded-full bg-[#000137] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2f3192] transition-colors">
                    <Play className="w-5 h-5 text-white ml-1" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#2f3192] bg-[#2f3192]/10 px-2 py-0.5 rounded-full">
                        EP. {47 - index}
                      </span>
                      <span className="text-xs text-gray-400 font-sans">
                        {podcast.duration}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-[#000137] group-hover:text-[#2f3192] transition-colors">
                      {podcast.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events Column */}
          <div>
            <div className="flex justify-between items-baseline mb-8">
              <h2 className="font-serif text-3xl font-bold text-[#000137]">
                Upcoming Events
              </h2>
              <Link
                href="/events"
                className="text-sm font-bold text-[#2f3192] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-6">
              {events.map((event) => (
                <div key={event.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-16 flex-shrink-0 flex flex-col items-center border border-gray-200 rounded-lg overflow-hidden">
                    <span className="w-full bg-[#000137] text-white text-xs font-bold text-center py-1">
                      {event.month}
                    </span>
                    <span className="text-2xl font-bold text-[#000137] py-2">
                      {event.date}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#000137] group-hover:text-[#2f3192] transition-colors mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-sans mb-2">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                    <p className="text-sm text-gray-600 font-sans line-clamp-1">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>);

}
