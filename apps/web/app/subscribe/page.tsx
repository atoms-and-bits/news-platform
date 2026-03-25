'use client';

import React, { useState } from 'react';
import {
  Check,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Smartphone,
  Phone,
  Loader2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '../../lib/supabase/UserContext';
import { COUNTRY_CODES } from '../../lib/data/countryCodes';

const PREMIUM_FEATURES = [
  'Unlimited article access',
  'Deep-dive analysis & reports',
  'Priority event registration',
  'Podcast transcripts',
  'Daily newsletter briefing',
  'Ad-free experience',
];

const PREMIUM_PRICE = process.env.NEXT_PUBLIC_PREMIUM_PRICE_DISPLAY || '10,000';

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192] outline-none transition-colors';

export default function SubscribePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useUser();

  const [step, setStep] = useState<'info' | 'checkout'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('mobile');

  // Phone number (used for both mobile and card payments)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryIso, setCountryIso] = useState('TZ');

  // Card billing fields
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingPostcode, setBillingPostcode] = useState('');
  const [billingCountry, setBillingCountry] = useState('TZ');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileSuccess, setMobileSuccess] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be signed in to subscribe.');
      return;
    }

    setIsSubmitting(true);

    try {
      let body: Record<string, unknown>;

      if (paymentMethod === 'mobile') {
        // Normalize Tanzanian phone number
        let phone = phoneNumber.replace(/[\s-]/g, '');
        if (phone.startsWith('0')) {
          phone = '255' + phone.slice(1);
        } else if (phone.startsWith('+')) {
          phone = phone.slice(1);
        }

        if (!/^255\d{9}$/.test(phone)) {
          setError(
            'Enter a valid Tanzanian phone number (e.g. 0781000000 or 255781000000).'
          );
          setIsSubmitting(false);
          return;
        }

        body = { payment_type: 'mobile', phone_number: phone };
      } else {
        // Normalize phone number for card payment (international)
        let cardPhone = phoneNumber.replace(/[\s\-()]/g, '');
        if (cardPhone.startsWith('0')) {
          cardPhone = cardPhone.slice(1);
        } else if (cardPhone.startsWith('+')) {
          cardPhone = cardPhone.replace(/^\+\d+/, '');
        }
        const dialCode = COUNTRY_CODES.find((c) => c.code === countryIso)?.dial ?? '255';
        cardPhone = dialCode + cardPhone;

        if (cardPhone.length < 7 || !/^\d+$/.test(cardPhone)) {
          setError('Enter a valid phone number.');
          setIsSubmitting(false);
          return;
        }

        if (!billingAddress || !billingCity || !billingState || !billingPostcode || !billingCountry) {
          setError('All billing address fields are required for card payments.');
          setIsSubmitting(false);
          return;
        }

        body = {
          payment_type: 'card',
          phone_number: cardPhone,
          billing: {
            address: billingAddress,
            city: billingCity,
            state: billingState,
            postcode: billingPostcode,
            country: billingCountry,
          },
        };
      }

      const res = await fetch('/api/payments/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Payment failed. Please try again.');
        return;
      }

      setPaymentReference(data.reference);

      if (paymentMethod === 'card' && data.payment_url) {
        // Store reference for verification on success page
        localStorage.setItem('snippe_payment_ref', data.reference);
        // Redirect to Snippe's hosted checkout for card entry
        window.location.href = data.payment_url;
      } else {
        // Mobile money — USSD push sent
        setMobileSuccess(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!paymentReference) return;
    setIsVerifying(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: paymentReference }),
      });
      const data = await res.json();
      if (data.status === 'activated') {
        setVerified(true);
        setTimeout(() => router.push('/profile'), 2000);
      } else {
        setError(
          data.message || 'Payment not yet completed. Please complete the USSD prompt on your phone.'
        );
      }
    } catch {
      setError('Could not verify payment. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Auth gate
  if (!authLoading && !user) {
    return (
      <div className="relative">
        <div className="bg-[#000137] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Upgrade to Premium
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto">
              Sign in to get started with your Premium subscription.
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 -mt-8 pb-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">
              Create an account or sign in to upgrade to Premium.
            </p>
            <Link
              href="/signin?next=/subscribe"
              className="inline-block bg-[#000137] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#2f3192] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mobile success — USSD push sent
  if (mobileSuccess) {
    return (
      <div className="relative">
        <div className="bg-[#000137] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              {verified ? 'Welcome Aboard!' : 'Check Your Phone'}
            </h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 -mt-8 pb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
            {verified ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  Your Premium subscription is now active. Enjoy full access to
                  Atoms & Bits.
                </p>
                <p className="text-sm text-gray-400">Redirecting to your profile...</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  A USSD prompt has been sent to your phone. Enter your mobile money
                  PIN to complete the payment of{' '}
                  <span className="font-bold text-[#000137]">TSh {PREMIUM_PRICE}</span>.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  After completing payment on your phone, tap the button below to
                  activate your subscription.
                </p>

                {/* Error from verification */}
                {error && (
                  <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-left">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleVerifyPayment}
                    disabled={isVerifying}
                    className="w-full bg-[#000137] text-white font-bold py-3 rounded-lg hover:bg-[#2f3192] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "I've Completed Payment"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setMobileSuccess(false);
                      setError(null);
                      setPaymentReference(null);
                    }}
                    className="w-full text-gray-500 font-medium py-3 hover:text-[#000137] transition-colors"
                  >
                    Try again with different number
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={() => {
          if (step === 'checkout') {
            setStep('info');
          } else {
            router.push('/');
          }
        }}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium z-10"
      >
        <ArrowLeft className="w-5 h-5" />{' '}
        {step === 'checkout' ? 'Back' : 'Home'}
      </button>

      {/* Hero Section */}
      <div className="bg-[#000137] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            {step === 'info'
              ? 'Upgrade to Premium'
              : 'Complete Your Subscription'}
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto font-sans leading-relaxed">
            {step === 'info'
              ? 'Get unlimited access to deep-tech reporting, exclusive data insights, and our full archive.'
              : 'You are subscribing to the Premium plan.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        {step === 'info' ? (
          /* ── Plan Info Card ─────────────────────────────────── */
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 border-2 border-[#2f3192]">
            <div className="text-center mb-8">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                PREMIUM
              </span>
              <div className="text-4xl font-bold text-[#000137] mt-6 mb-1">
                TSh {PREMIUM_PRICE}
              </div>
              <div className="text-sm text-gray-500">per month</div>
            </div>

            <ul className="space-y-4 mb-8">
              {PREMIUM_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 text-amber-500" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setStep('checkout')}
              className="w-full py-3 font-bold rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:opacity-90 transition-opacity shadow-sm"
            >
              GET PREMIUM
            </button>
          </div>
        ) : (
          /* ── Checkout Form ──────────────────────────────────── */
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Order Summary Sidebar */}
            <div className="bg-gray-50 p-8 md:w-1/3 border-r border-gray-100">
              <h3 className="font-serif text-xl font-bold text-[#000137] mb-6">
                Order Summary
              </h3>
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="font-bold text-[#000137]">Premium Plan</div>
                  <div className="text-sm text-gray-500">Monthly subscription</div>
                </div>
                <div className="font-bold text-[#000137]">TSh {PREMIUM_PRICE}</div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="font-bold text-lg text-[#000137]">Total</div>
                <div className="font-bold text-lg text-[#000137]">
                  TSh {PREMIUM_PRICE}
                </div>
              </div>

              <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800 leading-relaxed">
                  You will be charged TSh {PREMIUM_PRICE}. Your subscription
                  lasts 30 days. Renew anytime from your profile.
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-8 md:w-2/3">
              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleConfirmPayment}>
                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="font-serif text-xl font-bold text-[#000137] mb-4">
                    Payment Method
                  </h3>

                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mobile')}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-all ${
                        paymentMethod === 'mobile'
                          ? 'border-[#2f3192] bg-[#2f3192]/5 text-[#2f3192]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" /> Mobile Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#2f3192] bg-[#2f3192]/5 text-[#2f3192]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" /> Card
                    </button>
                  </div>

                  {paymentMethod === 'mobile' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 0781 000 000"
                          className={inputClass}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        Works with M-Pesa, Airtel Money, Tigo Pesa (Mixx by Yas), and
                        Halotel. A USSD push will be sent to your phone.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={countryIso}
                            onChange={(e) => setCountryIso(e.target.value)}
                            className="w-36 px-2 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192] outline-none transition-colors text-sm"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} +{c.dial}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="781 000 000"
                            className={`flex-1 ${inputClass}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Billing Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          placeholder="Street address"
                          className={inputClass}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={billingCity}
                            onChange={(e) => setBillingCity(e.target.value)}
                            placeholder="e.g. Dar es Salaam"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State / Region *
                          </label>
                          <input
                            type="text"
                            required
                            value={billingState}
                            onChange={(e) => setBillingState(e.target.value)}
                            placeholder="e.g. Dar es Salaam"
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postcode / ZIP *
                          </label>
                          <input
                            type="text"
                            required
                            value={billingPostcode}
                            onChange={(e) => setBillingPostcode(e.target.value)}
                            placeholder="e.g. 11101"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            required
                            value={billingCountry}
                            onChange={(e) => setBillingCountry(e.target.value)}
                            className={inputClass}
                          >
                            <option value="TZ">Tanzania</option>
                            <option value="KE">Kenya</option>
                            <option value="UG">Uganda</option>
                            <option value="RW">Rwanda</option>
                            <option value="NG">Nigeria</option>
                            <option value="GH">Ghana</option>
                            <option value="ZA">South Africa</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="IN">India</option>
                            <option value="AE">UAE</option>
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">
                        You will be redirected to a secure checkout page to enter
                        your card details.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full py-4 bg-[#000137] text-white font-bold rounded-lg hover:bg-[#2f3192] transition-colors shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'CONFIRM PAYMENT'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <p className="text-center text-gray-500 text-sm mt-8">
          Secure payment processing powered by Snippe. Cancel anytime from your profile.
        </p>
      </div>

      {/* Success Overlay — for card payments returning via redirect */}
      <AnimatePresence>
        {false && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#000137] mb-2">
                Welcome Aboard!
              </h3>
              <p className="text-gray-600 mb-6">
                Your Premium subscription is now active. Enjoy full access to
                Atoms & Bits.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
