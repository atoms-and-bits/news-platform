'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useUser } from '../../lib/supabase/UserContext';

const SESSION_KEY = 'ab_signup_prompt_shown';

export function SignUpPrompt() {
  const { user } = useUser();
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(true);
  }, []);

  useEffect(() => {
    // Don't show for authenticated users or if already shown this session
    if (user || sessionStorage.getItem(SESSION_KEY)) return;

    // Timer trigger: 60 seconds
    const timer = setTimeout(show, 60_000);

    // Scroll trigger: 50% of page
    function onScroll() {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.5) {
        show();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [user, show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-[#2f3192]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-[#2f3192] font-bold font-serif text-2xl">A&B</span>
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#000137] mb-2">
          Stay in the loop
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Join Atoms & Bits to bookmark articles, access premium content, and never miss a story from the East African tech ecosystem.
        </p>

        <Link
          href="/signin?mode=signup"
          onClick={() => setVisible(false)}
          className="block w-full bg-[#000137] text-white font-bold py-3 rounded-lg hover:bg-[#2f3192] transition-colors mb-3"
        >
          SIGN UP FOR FREE
        </Link>

        <p className="text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/signin" onClick={() => setVisible(false)} className="text-[#2f3192] font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
