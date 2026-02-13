'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Building2,
  Globe,
  User,
  Mail,
  FileText } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubmitStartupPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/startups');
    }, 2500);
  };

  return (
    <div className="pb-20">
      {/* Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-gray-100 py-3">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/startups"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#000137] transition-colors">

            <ArrowLeft className="w-4 h-4" />
            Back to Startups
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#000137] mb-4">
            Submit Your Startup
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Help us map the Tanzanian tech ecosystem. All submissions are
            manually verified by our team before being published.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#000137] px-8 py-4 border-b border-gray-100">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Company Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Inc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192]" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    required
                    placeholder="https://"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192]" />

                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192]">
                  <option>Fintech</option>
                  <option>Agri-Tech</option>
                  <option>Healthtech</option>
                  <option>Clean Energy</option>
                  <option>Edtech</option>
                  <option>Logistics / Supply Chain</option>
                  <option>E-Commerce</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Stage
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192]">
                  <option>Bootstrapped</option>
                  <option>Pre-Seed</option>
                  <option>Seed</option>
                  <option>Series A</option>
                  <option>Series B+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                One-Line Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Building the financial infrastructure for Africa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192]" />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                rows={4}
                placeholder="Tell us more about what you're building..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192]" />

            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-[#000137] mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Contact Person
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192]" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192]" />

                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#000137] text-white font-bold py-4 rounded-lg hover:bg-[#2f3192] transition-colors shadow-md text-lg">

                SUBMIT FOR REVIEW
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                By submitting, you confirm that you are authorized to represent
                this company.
              </p>
            </div>
          </form>
        </div>
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
                Submission Received!
              </h3>
              <p className="text-gray-600 mb-6">
                Thanks for submitting your startup. Our team will review the
                details and publish it shortly.
              </p>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}
