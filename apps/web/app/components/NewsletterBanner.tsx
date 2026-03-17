'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '../../lib/supabase/UserContext';

export function NewsletterBanner() {
  const { user } = useUser();
  const isPremium = user?.plan === 'premium';

  // Premium users: don't show the banner at all
  if (isPremium) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#2f3192] rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#000137]/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            {user ? 'Unlock Premium Content' : 'Never Miss a Story'}
          </h2>
          <p className="text-white/80 text-lg mb-8 font-sans">
            {user
              ? 'Get access to deep dives, exclusive reports, and premium events.'
              : 'Join founders, executives, and policymakers who stay ahead with Atoms & Bits.'}
          </p>

          <Link
            href={user ? '/subscribe' : '/signin?mode=signup'}
            className="inline-block px-8 py-3 bg-[#000137] text-white font-bold rounded-md hover:bg-[#000137]/80 transition-colors shadow-lg"
          >
            {user ? 'UPGRADE TO PREMIUM' : 'SIGN UP FOR FREE'}
          </Link>
          <p className="text-white/40 text-xs mt-4 font-sans">
            {user
              ? 'Support independent tech journalism in East Africa.'
              : 'Bookmark articles, access premium content, and more.'}
          </p>
        </div>
      </div>
    </section>
  );
}
