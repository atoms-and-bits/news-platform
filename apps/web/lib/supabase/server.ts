import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import type { Database } from './database.types';

// Server-side Supabase client for Next.js API routes and Server Components
export async function createClient() {
  const cookieStore = await cookies(); 
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Ensure credentials are present
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  // Create and return a new Supabase client for server-side use
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // Use Next.js cookie store for SSR cookie management
      getAll() { 
        return cookieStore.getAll();
      },
      // setAll is a no-op on the server since we can't mutate cookies in SSR context, but we provide it to avoid errors if called from a Server Component.
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll can be called from Server Components where mutating cookies isn't supported.
        }
      },
    },
  });
}
