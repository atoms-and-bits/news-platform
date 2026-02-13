'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

interface User {
  name: string;
  email: string;
  plan: 'free' | 'basic' | 'standard' | 'premium';
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  const handleLogout = () => {
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
