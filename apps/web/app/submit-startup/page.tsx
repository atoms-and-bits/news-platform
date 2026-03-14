'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Building2,
  Globe,
  User,
  Mail,
  MapPin,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';
import { useUser } from '../../lib/supabase/UserContext';
import type { Database } from '../../lib/supabase/database.types';

type StartupStage = Database['public']['Enums']['startup_stage'];

const STAGE_OPTIONS: { value: StartupStage | ''; label: string }[] = [
  { value: '', label: 'Select stage...' },
  { value: 'pre_seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b', label: 'Series B' },
  { value: 'series_c', label: 'Series C' },
  { value: 'growth', label: 'Growth' },
  { value: 'public', label: 'Public' },
];

const SECTOR_OPTIONS = [
  'Fintech',
  'Agri-Tech',
  'Healthtech',
  'Clean Energy',
  'Edtech',
  'Logistics / Supply Chain',
  'E-Commerce',
  'SaaS',
  'AI / Machine Learning',
  'Other',
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2f3192] focus:border-[#2f3192] outline-none transition-colors';

export default function SubmitStartupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useUser();

  // Form state
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [sector, setSector] = useState('Fintech');
  const [stage, setStage] = useState<StartupStage | ''>('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [founded, setFounded] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be signed in to submit a startup.');
      return;
    }

    const userId = user.id;
    const slug = generateSlug(name);
    if (!slug) {
      setError('Please enter a valid company name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase.from('startups').insert({
        name: name.trim(),
        slug,
        sector,
        location: location.trim(),
        description: description.trim(),
        long_description: longDescription.trim() || null,
        website: website.trim() || null,
        founded: founded.trim() || null,
        team_size: teamSize.trim() || null,
        stage: stage ? stage : null,
        contact_name: contactName.trim() || null,
        contact_email: contactEmail.trim() || null,
        submitted_by: userId,
      });

      if (insertError) {
        // Handle duplicate slug
        if (insertError.code === '23505' && insertError.message.includes('slug')) {
          setError(
            'A startup with a similar name already exists. Try a slightly different name.'
          );
        } else {
          setError(insertError.message);
        }
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/startups');
      }, 2500);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auth gate — show sign-in prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="pb-20">
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-gray-100 py-3">
          <div className="max-w-3xl mx-auto px-4">
            <Link
              href="/startups"
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#000137] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Startups
            </Link>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 mt-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-3">
            Sign in to submit
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to submit your startup for review.
          </p>
          <Link
            href="/signin"
            className="inline-block bg-[#000137] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#2f3192] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-gray-100 py-3">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/startups"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#000137] transition-colors"
          >
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Company Details Section */}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Inc."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector *
                </label>
                <select
                  required
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className={inputClass}
                >
                  {SECTOR_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as StartupStage | '')}
                  className={inputClass}
                >
                  {STAGE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dar es Salaam, Tanzania"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Founded
                </label>
                <input
                  type="text"
                  value={founded}
                  onChange={(e) => setFounded(e.target.value)}
                  placeholder="e.g. 2023"
                  maxLength={4}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Size
              </label>
              <input
                type="text"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g. 5-10"
                className={`${inputClass} max-w-xs`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                One-Line Description *
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Building the financial infrastructure for Africa"
                maxLength={200}
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">
                {description.length}/200 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                rows={4}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Tell us more about what you're building..."
                className={inputClass}
              />
            </div>

            {/* Contact Person Section */}
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
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={inputClass}
                  />
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
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full bg-[#000137] text-white font-bold py-4 rounded-lg hover:bg-[#2f3192] transition-colors shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'SUBMIT FOR REVIEW'
                )}
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
        {showSuccess && (
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
                Submission Received!
              </h3>
              <p className="text-gray-600 mb-6">
                Thanks for submitting your startup. Our team will review the
                details and publish it shortly.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
