'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PremiumSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'activated' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = localStorage.getItem('snippe_payment_ref');

    if (!ref) {
      // No reference — assume webhook already handled it
      setStatus('activated');
      return;
    }

    // Try to verify and activate via our API (fallback for failed webhooks)
    async function verify() {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: ref }),
        });
        const data = await res.json();

        if (data.status === 'activated') {
          localStorage.removeItem('snippe_payment_ref');
          setStatus('activated');
        } else if (data.status === 'completed') {
          // Payment completed but activation might have already happened via webhook
          localStorage.removeItem('snippe_payment_ref');
          setStatus('activated');
        } else if (data.status === 'pending') {
          // Payment still processing — wait and retry
          setTimeout(verify, 3000);
        } else {
          setError(data.message || 'Could not verify payment.');
          setStatus('error');
        }
      } catch {
        setError('Could not verify payment. Please contact support.');
        setStatus('error');
      }
    }

    verify();
  }, []);

  // Auto-redirect after activation
  useEffect(() => {
    if (status === 'activated') {
      const timer = setTimeout(() => router.push('/profile'), 4000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-[#2f3192] animate-spin" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#000137] mb-3">
              Activating Your Subscription...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {status === 'activated' && (
          <>
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
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#000137] mb-3">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              If you were charged, your subscription will be activated shortly.
              Contact us at{' '}
              <a href="mailto:info@atomsandbits.co.tz" className="text-[#2f3192] underline">
                info@atomsandbits.co.tz
              </a>{' '}
              if the issue persists.
            </p>
            <Link
              href="/profile"
              className="inline-block bg-[#000137] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#2f3192] transition-colors"
            >
              Go to Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
