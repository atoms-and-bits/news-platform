'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { createClient } from '../../lib/supabase/client';
import type { Enums } from '../../lib/supabase/database.types';

/** Authenticated user info passed to Header and other layout components */
export interface HeaderUser {
  name: string;
  email: string;
  plan: Enums<'user_plan'>;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null;
    }
    return createClient();
  }, []);
  const [user, setUser] = useState<HeaderUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    /** Fetch the user's profile from Supabase and update local state */
    const hydrateUser = async (authUser: User | null) => {
      if (!authUser) {
        if (isMounted) {
          setUser(null);
        }
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('full_name, plan')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      setUser({
        name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Member',
        email: authUser.email || '',
        plan: profile?.plan === 'premium' ? 'premium' : 'free',
      });
    };

    supabase.auth.getUser().then(({ data }) => {
      hydrateUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrateUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  };

  // Don't show header/footer on auth pages for cleaner look
  const isAuthPage = pathname === '/signin' || pathname === '/subscribe';

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative">
      {!isAuthPage && <Header user={user} onLogout={handleLogout} />}
      <div className="flex-1">{children}</div>
      {!isAuthPage && <Footer />}
    </div>
  );
}
