/**
 * Startups Content Component
 * Client component: Handles search filtering and load more functionality
 * Displays startup database with search
 */
'use client';

import React, { useState } from 'react';
import { MapPin, Users, Search } from 'lucide-react';
import Link from 'next/link';

// ─── Type Definitions ────────────────────────────────────────
interface Startup {
  id: string;
  slug: string;
  name: string;
  logo: string;
  sector: string;
  location: string;
  description: string;
  stage: string;
}

interface StartupsContentProps {
  startups: Startup[];
}

// ─── Component ───────────────────────────────────────────────
export function StartupsContent({ startups }: StartupsContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter startups by search term
  const filteredStartups = startups.filter((startup) => {
    const term = searchTerm.toLowerCase();
    return (
      startup.name.toLowerCase().includes(term) ||
      startup.sector.toLowerCase().includes(term) ||
      startup.location.toLowerCase().includes(term)
    );
  });

  const visibleStartups = filteredStartups.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStartups.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="pb-12">
      {/* Hero Header with Search */}
      <div className="bg-[#000137] text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Tanzanian Startup Database
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-sans mb-8">
            Discover the companies shaping the future of technology in East
            Africa.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search startups by name, sector, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2f3192] shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Startups Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500 font-medium">
            Showing {visibleStartups.length} of {filteredStartups.length} startups
          </div>
        </div>

        {visibleStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleStartups.map((startup) => (
              <Link
                key={startup.id}
                href={`/startup/${startup.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl font-bold text-[#000137] border border-gray-100">
                    {startup.logo}
                  </div>
                  <span className="bg-[#2f3192]/10 text-[#2f3192] text-xs font-bold px-2 py-1 rounded-md uppercase">
                    {startup.sector}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#000137] mb-2 group-hover:text-[#2f3192] transition-colors">
                  {startup.name}
                </h3>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {startup.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {startup.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {startup.stage}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg">
              No startups found matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-[#2f3192] font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              LOAD MORE
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center border-t border-gray-200 pt-12">
          <h3 className="font-serif text-2xl font-bold text-[#000137] mb-4">
            Are you a founder building in Tanzania?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our database to get discovered by investors, partners, and
            talent. It takes less than 5 minutes.
          </p>
          <Link
            href="/submit-startup"
            className="inline-block px-8 py-4 bg-[#000137] text-white font-bold rounded-md hover:bg-[#2f3192] transition-colors shadow-md"
          >
            SUBMIT YOUR STARTUP
          </Link>
        </div>
      </div>
    </div>
  );
}
