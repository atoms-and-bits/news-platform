/**
 * Startups Page
 * Server component: Fetches all startups from Sanity
 * Passes data to StartupsContent client component for search and filtering
 */

import React from 'react';
import { getAllStartups } from '../../lib/sanity/queries';
import { StartupsContent } from './StartupsContent';

// ─── Server Component ────────────────────────────────────────
export default async function StartupsPage() {
  // Fetch all startups from Sanity
  const sanityStartups = await getAllStartups();

  // Transform Sanity data to match component props
  const startups = sanityStartups.map((startup) => ({
    id: startup._id,
    slug: startup.slug.current,
    name: startup.name,
    logo: startup.logo || startup.name.charAt(0),
    sector: startup.sector,
    location: startup.location,
    description: startup.description,
    stage: startup.stage,
  }));

  return <StartupsContent startups={startups} />;
}

// ─── ISR Configuration ───────────────────────────────────────
export const revalidate = 60; // Revalidate every 60 seconds
