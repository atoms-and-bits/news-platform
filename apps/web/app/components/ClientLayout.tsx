'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { UserProvider } from '../../lib/supabase/UserContext';
import { SignUpPrompt } from './SignUpPrompt';

/**
 * Root client layout wrapper.
 * Provides auth state via UserProvider and conditionally renders
 * Header/Footer (hidden on auth pages for a cleaner look).
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show header/footer on auth pages for cleaner look
  const isAuthPage = pathname === '/signin' || pathname === '/subscribe';

  return (
    <UserProvider>
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative">
        {!isAuthPage && <Header />}
        <div className="flex-1">{children}</div>
        {!isAuthPage && <Footer />}
        {!isAuthPage && <SignUpPrompt />}
      </div>
    </UserProvider>
  );
}
