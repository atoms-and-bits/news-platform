/**
 * Events Page
 * Server component: Fetches all events from Sanity
 * Passes data to EventsContent client component for interactivity
 */

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { getAllEvents } from '../../lib/sanity/queries';
import { EventsContent } from './EventsContent';
import { EmptyState } from '../components/EmptyState';

// ─── Server Component ────────────────────────────────────────
export default async function EventsPage() {
  const sanityEvents = await getAllEvents();

  const events = sanityEvents.map((event) => ({
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

  if (events.length === 0) {
    return (
      <div className="pb-12">
        <div className="bg-[#000137] text-white py-16 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Events
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto font-sans">
              Meetups, conferences, and workshops connecting East Africa&apos;s tech community.
            </p>
          </div>
        </div>
        <EmptyState
          icon={CalendarDays}
          title="Coming Soon"
          description="We're planning exciting events to bring together East Africa's tech community. Check back soon for upcoming meetups, conferences, and workshops."
          ctaLabel="BROWSE ARTICLES"
          ctaHref="/latest"
        />
      </div>
    );
  }

  return <EventsContent events={events} />;
}

// ─── ISR Configuration ───────────────────────────────────────
export const revalidate = 60;
