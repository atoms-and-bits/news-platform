'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../lib/supabase/UserContext';

/** Sign-out button used on the profile page and elsewhere. */
export function SignOutButton() {
  const router = useRouter();
  const { signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
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
