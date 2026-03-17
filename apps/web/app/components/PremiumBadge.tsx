'use client';

import { Lock } from 'lucide-react';
import { useUser } from '../../lib/supabase/UserContext';

export function PremiumBadge() {
  const { user } = useUser();
  const isPremium = user?.plan === 'premium';

  return (
    <div className="absolute top-4 right-4 z-20 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
      {!isPremium && <Lock className="w-3 h-3" />} PREMIUM
    </div>
  );
}
