'use client';

import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PremiumSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to profile after 5 seconds
    const timer = setTimeout(() => {
      router.push('/profile');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#000137] mb-3">
          Welcome Aboard!
        </h1>
        <p className="text-gray-600 mb-8">
          Your Premium subscription is now active. Enjoy full access to
          Atoms & Bits.
        </p>
        <Link
          href="/profile"
          className="inline-block bg-[#000137] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#2f3192] transition-colors"
        >
          Go to Profile
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Redirecting to your profile in a few seconds...
        </p>
      </div>
    </div>
  );
}
