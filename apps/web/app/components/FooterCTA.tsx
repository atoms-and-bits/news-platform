'use client';

import Link from 'next/link';
import { useUser } from '../../lib/supabase/UserContext';

export function FooterCTA() {
  const { user } = useUser();
  const isPremium = user?.plan === 'premium';

  if (isPremium) return null;

  if (user) {
    return (
      <div className="bg-white/5 rounded-lg p-4">
        <p className="text-xs text-white/60 mb-2 font-sans">
          Unlock premium content
        </p>
        <Link
          href="/subscribe"
          className="block text-center text-sm font-bold text-white bg-[#2f3192] px-4 py-2 rounded-md hover:bg-[#4345c7] transition-colors"
        >
          UPGRADE
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <p className="text-xs text-white/60 mb-2 font-sans">
        Join Atoms & Bits for free
      </p>
      <Link
        href="/signin?mode=signup"
        className="block text-center text-sm font-bold text-white bg-[#2f3192] px-4 py-2 rounded-md hover:bg-[#4345c7] transition-colors"
      >
        SIGN UP
      </Link>
    </div>
  );
}
