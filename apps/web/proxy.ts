import type { NextRequest } from 'next/server';

import { updateSession } from './lib/supabase/middleware';

// Middleware to handle authentication and session updates for protected routes
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Specify the paths that should be processed by this middleware
export const config = {
  matcher: ['/signin', '/profile/:path*', '/submit-startup/:path*'],
};
