'use client';

import Link from 'next/link';
import { useUser } from '../../lib/supabase/UserContext';

export function SidebarCTA() {
  const { user } = useUser();
  const isPremium = user?.plan === 'premium';

  // Premium users: don't show anything
  if (isPremium) return null;

  // Signed-in free users: upgrade prompt
  if (user) {
    return (
      <div className="mt-8 bg-[#000137] rounded-xl p-6 text-center text-white">
        <h3 className="font-serif font-bold text-xl mb-2">
          Go Premium
        </h3>
        <p className="text-sm text-white/70 mb-4 font-sans">
          Unlock deep dives, exclusive reports, and premium events.
        </p>
        <Link
          href="/subscribe"
          className="block w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-[#000137] font-bold text-sm rounded-md hover:from-amber-500 hover:to-amber-600 transition-colors text-center"
        >
          UPGRADE NOW
        </Link>
      </div>
    );
  }

  // Not signed in: sign up prompt
  return (
    <div className="mt-8 bg-[#2f3192] rounded-xl p-6 text-center text-white">
      <h3 className="font-serif font-bold text-xl mb-2">
        Join Atoms & Bits
      </h3>
      <p className="text-sm text-white/80 mb-4 font-sans">
        Bookmark articles, access premium content, and stay ahead of
        the East African tech ecosystem.
      </p>
      <Link
        href="/signin?mode=signup"
        className="block w-full py-2 bg-[#000137] text-white font-bold text-sm rounded-md hover:bg-[#000137]/80 transition-colors text-center"
      >
        SIGN UP FOR FREE
      </Link>
    </div>
  );
}
