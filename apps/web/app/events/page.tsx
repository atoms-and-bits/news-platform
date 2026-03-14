/**
 * Events Page
 * Server component: Fetches all events from Sanity
 * Passes data to EventsContent client component for interactivity
 */

import React from 'react';
import { getAllEvents } from '../../lib/sanity/queries';
import { EventsContent } from './EventsContent';

// ─── Server Component ────────────────────────────────────────
export default async function EventsPage() {
  // Fetch all events from Sanity
  const sanityEvents = await getAllEvents();

  // Transform Sanity data to match component props
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

  return <EventsContent events={events} />;
}

// ─── ISR Configuration ───────────────────────────────────────
export const revalidate = 60; // Revalidate every 60 seconds
