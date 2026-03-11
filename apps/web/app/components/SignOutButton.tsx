'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { createClient } from '../../lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      router.push('/');
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-md transition-colors"
    >
      <LogOut className="w-5 h-5" /> Sign Out
    </button>
  );
}
