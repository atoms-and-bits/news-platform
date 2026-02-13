'use client';

import React, { useState } from 'react';
import {
  Check,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Smartphone } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type PlanType = 'basic' | 'standard' | 'premium';

export default function SubscribePage() {
  const router = useRouter();
  const [step, setStep] = useState<'plans' | 'checkout'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Checkout Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>(
    'mobile'
  );
  const [mobileProvider, setMobileProvider] = useState<
    'mpesa' | 'mixx' | 'airtel'>(
    'mpesa');

  const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '10,000',
    description: 'Essential news for casual readers.',
    features: [
    'Daily newsletter briefing',
    'Access to latest news',
    'Weekly roundups'],

    color: 'gray'
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '18,000',
    description: 'For professionals who need to stay ahead.',
    features: [
    'Everything in Basic',
    'Unlimited article access',
    'Podcast transcripts',
    'Comment access'],

    color: 'indigo',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '25,000',
    description: 'Full access for founders and investors.',
    features: [
    'Everything in Standard',
    'Deep-dive analysis',
    'Priority event registration',
    'Ad-free experience'],

    color: 'amber'
  }];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId as PlanType);
    setStep('checkout');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 2500);
  };

  const getPlanDetails = (id: string) => plans.find((p) => p.id === id);
  const selectedPlanDetails = selectedPlan ? getPlanDetails(selectedPlan) : null;

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={() => {
          if (step === 'checkout') {
            setStep('plans');
          } else {
            router.push('/');
          }
        }}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium z-10">

        <ArrowLeft className="w-5 h-5" />{' '}
        {step === 'checkout' ? 'Change Plan' : 'Back'}
      </button>

      <div className="bg-[#000137] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            {step === 'plans' ?
            'Choose Your Plan' :
            'Complete Your Subscription'}
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto font-sans leading-relaxed">
            {step === 'plans' ?
            'Get unlimited access to deep-tech reporting, exclusive data insights, and our full archive.' :
            `You are subscribing to the ${selectedPlanDetails?.name} plan.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        {step === 'plans' ?
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) =>
          <div
            key={plan.id}
            className={`bg-white rounded-2xl shadow-lg p-8 border flex flex-col relative transform transition-transform hover:-translate-y-1 ${plan.popular ? 'border-2 border-[#2f3192] md:-translate-y-4 z-10' : 'border-gray-100'}`}>

                {plan.popular &&
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2f3192] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                    MOST POPULAR
                  </div>
            }

                <h3
              className={`font-serif text-2xl font-bold mb-2 ${plan.id === 'premium' ? 'text-amber-600' : 'text-[#000137]'}`}>

                  {plan.name}
                </h3>
                <p className="text-gray-500 mb-6 text-sm">{plan.description}</p>
                <div className="text-3xl font-bold text-[#000137] mb-1">
                  TSh {plan.price}
                </div>
                <div className="text-sm text-gray-500 mb-8">per month</div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) =>
              <li key={feature} className="flex items-start gap-3">
                      <Check
                  className={`w-5 h-5 flex-shrink-0 ${plan.id === 'premium' ? 'text-amber-500' : 'text-[#2f3192]'}`} />

                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
              )}
                </ul>

                <button
              onClick={() => handleSelectPlan(plan.id)}
              className={`w-full py-3 font-bold rounded-lg transition-colors shadow-sm ${plan.popular ? 'bg-[#2f3192] text-white hover:bg-[#242675]' : plan.id === 'premium' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:opacity-90' : 'border-2 border-[#000137] text-[#000137] hover:bg-gray-50'}`}>

                  CHOOSE {plan.name.toUpperCase()}
                </button>
              </div>
          )}
          </div> :

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Order Summary Sidebar */}
            <div className="bg-gray-50 p-8 md:w-1/3 border-r border-gray-100">
              <h3 className="font-serif text-xl font-bold text-[#000137] mb-6">
                Order Summary
              </h3>
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="font-bold text-[#000137]">
                    {selectedPlanDetails?.name} Plan
                  </div>
                  <div className="text-sm text-gray-500">
                    Monthly subscription
                  </div>
                </div>
                <div className="font-bold text-[#000137]">
                  TSh {selectedPlanDetails?.price}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="font-bold text-lg text-[#000137]">Total</div>
                <div className="font-bold text-lg text-[#000137]">
                  TSh {selectedPlanDetails?.price}
                </div>
              </div>

              <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800 leading-relaxed">
                  You will be charged TSh {selectedPlanDetails?.price}{' '}
                  immediately. Your subscription will renew automatically every
                  month. Cancel anytime.
                </p>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="p-8 md:w-2/3">
              <form onSubmit={handleConfirmPayment}>
                <div className="mb-8">
                  <h3 className="font-serif text-xl font-bold text-[#000137] mb-4">
                    Create Account
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]" />

                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]" />

                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-serif text-xl font-bold text-[#000137] mb-4">
                    Payment Method
                  </h3>

                  <div className="flex gap-4 mb-4">
                    <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-all ${paymentMethod === 'mobile' ? 'border-[#2f3192] bg-[#2f3192]/5 text-[#2f3192]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>

                      <Smartphone className="w-5 h-5" /> Mobile Money
                    </button>
                    <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-all ${paymentMethod === 'card' ? 'border-[#2f3192] bg-[#2f3192]/5 text-[#2f3192]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>

                      <CreditCard className="w-5 h-5" /> Card
                    </button>
                  </div>

                  {paymentMethod === 'mobile' ?
                <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <button
                      type="button"
                      onClick={() => setMobileProvider('mpesa')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${mobileProvider === 'mpesa' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>

                          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                            M
                          </div>
                          <span className="text-xs font-bold text-gray-700">
                            M-Pesa
                          </span>
                        </button>
                        <button
                      type="button"
                      onClick={() => setMobileProvider('mixx')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${mobileProvider === 'mixx' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>

                          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                            Y
                          </div>
                          <span className="text-xs font-bold text-gray-700">
                            Mixx
                          </span>
                        </button>
                        <button
                      type="button"
                      onClick={() => setMobileProvider('airtel')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${mobileProvider === 'airtel' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>

                          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">
                            A
                          </div>
                          <span className="text-xs font-bold text-gray-700">
                            Airtel
                          </span>
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                      type="tel"
                      placeholder="+255..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]" />

                      </div>
                    </div> :

                <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]" />

                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry
                          </label>
                          <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]" />

                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]" />

                        </div>
                      </div>
                    </div>
                }
                </div>

                <button
                type="submit"
                className="w-full py-4 bg-[#000137] text-white font-bold rounded-lg hover:bg-[#2f3192] transition-colors shadow-md text-lg">

                  CONFIRM PAYMENT
                </button>
              </form>
            </div>
          </div>
        }

        <p className="text-center text-gray-500 text-sm mt-8">
          Secure payment processing. You can cancel your subscription at any
          time.
        </p>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess &&
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.9
            }}
            className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center">

              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#000137] mb-2">
                Welcome Aboard!
              </h3>
              <p className="text-gray-600 mb-6">
                Your {selectedPlanDetails?.name} subscription is now active.
                Enjoy full access to Atoms & Bits.
              </p>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}
