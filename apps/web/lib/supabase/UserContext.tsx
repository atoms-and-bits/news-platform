'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from './client';
import type { Enums } from './database.types';

// ─── Types ───────────────────────────────────────────────────
/** Authenticated user info available throughout the app via useUser() */
export interface AppUser {
  /** Supabase auth UUID — needed for RPC calls like event RSVPs */
  id: string;
  name: string;
  email: string;
  plan: Enums<'user_plan'>;
}

interface UserContextValue {
  user: AppUser | null;
  /** True while the initial auth check is in progress */
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────
const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

/** Access the current user from any client component */
export function useUser() {
  return useContext(UserContext);
}

// ─── Provider ────────────────────────────────────────────────
/**
 * Wraps the app to provide user auth state via React Context.
 * Handles initial session check and listens for auth state changes
 * (sign in, sign out, token refresh, cross-tab sync).
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null;
    }
    return createClient();
  }, []);

  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    /** Fetch the user's profile from Supabase and update context state */
    const hydrateUser = async (authUser: User | null) => {
      if (!authUser) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('full_name, plan')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!isMounted) return;

      setUser({
        id: authUser.id,
        name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Member',
        email: authUser.email || '',
        plan: profile?.plan === 'premium' ? 'premium' : 'free',
      });
      setIsLoading(false);
    };

    // Initial session check
    supabase.auth.getUser().then(({ data }) => {
      hydrateUser(data.user);
    });

    // Listen for future auth changes (sign in, sign out, token refresh)
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

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({ user, isLoading, signOut }), [user, isLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
