/**
 * Events Content Component
 * Client component: Handles event registration modals and interactive state
 * Displays events with registration functionality
 */
'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  ArrowRight,
  X,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '../../lib/supabase/UserContext';

// ─── Type Definitions ────────────────────────────────────────
interface Event {
  id: string;
  title: string;
  date: string;
  month: string;
  time: string;
  location: string;
  venue: string;
  description: string;
  premium: boolean;
}

interface EventsContentProps {
  events: Event[];
}

// ─── Component ───────────────────────────────────────────────
export function EventsContent({ events }: EventsContentProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  // Auth state from UserContext
  const { user } = useUser();

  const handleRegisterClick = (event: Event) => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    if (event.premium && user.plan !== 'premium') {
      setShowUpgradePrompt(true);
      return;
    }
    setSelectedEvent(event);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      if (selectedEvent) {
        setRegisteredEvents([...registeredEvents, selectedEvent.id]);
      }
      setSelectedEvent(null);
      setShowSuccess(true);
    }, 1000);
  };

  return (
    <div className="pb-12 relative">
      {/* Hero Header */}
      <div className="bg-[#000137] text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Upcoming Events
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-sans">
            Connect with the community at conferences, meetups, and workshops
            across East Africa.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const isRegistered = registeredEvents.includes(event.id);
            const isLocked = event.premium && user?.plan !== 'premium';

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
              >
                {/* Color stripe */}
                <div
                  className={`h-2 ${
                    event.premium ? 'bg-amber-400' : 'bg-[#2f3192]'
                  }`}
                />

                <div className="p-6">
                  {/* Date and Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center min-w-[60px]">
                      <span className="block text-xs font-bold text-gray-500 uppercase">
                        {event.month}
                      </span>
                      <span className="block text-2xl font-bold text-[#000137]">
                        {event.date}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {event.premium && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                          <Lock className="w-3 h-3" /> PREMIUM
                        </span>
                      )}
                      <span className="bg-[#2f3192]/10 text-[#2f3192] text-xs font-bold px-2 py-1 rounded-md">
                        UPCOMING
                      </span>
                    </div>
                  </div>

                  {/* Event Title */}
                  <h3 className="font-serif text-xl font-bold text-[#000137] mb-2 group-hover:text-[#2f3192] transition-colors">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {event.location} • {event.venue}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {event.time}
                    </div>
                  </div>

                  {/* Event Description */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Register Button */}
                  {isRegistered ? (
                    <button
                      disabled
                      className="w-full bg-green-50 text-green-700 font-bold text-sm py-2 rounded border border-green-200 flex items-center justify-center gap-2 cursor-default"
                    >
                      <CheckCircle className="w-4 h-4" /> REGISTERED
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegisterClick(event)}
                      className="w-full border border-[#000137] text-[#000137] font-bold text-sm py-2 rounded hover:bg-[#000137] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      {isLocked && !user
                        ? 'SIGN IN TO REGISTER'
                        : isLocked
                          ? 'UPGRADE TO REGISTER'
                          : 'REGISTER NOW'}{' '}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auth Prompt Modal */}
      <AnimatePresence>
        {showAuthPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAuthPrompt(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center"
            >
              <h3 className="font-serif text-2xl font-bold text-[#000137] mb-2">
                Sign In Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please sign in to register for events.
              </p>
              <div className="space-y-3">
                <Link
                  href="/signin"
                  className="block w-full bg-[#000137] text-white font-bold py-2 rounded-md hover:bg-[#2f3192]"
                >
                  SIGN IN
                </Link>
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full text-gray-500 font-medium py-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade Prompt Modal */}
      <AnimatePresence>
        {showUpgradePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowUpgradePrompt(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#000137] mb-2">
                Premium Event
              </h3>
              <p className="text-gray-600 mb-6">
                This event is exclusive to Premium members. Upgrade your plan to
                register.
              </p>
              <div className="space-y-3">
                <Link
                  href="/subscribe"
                  className="block w-full bg-[#000137] text-white font-bold py-2 rounded-md hover:bg-[#2f3192]"
                >
                  VIEW PLANS
                </Link>
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="w-full text-gray-500 font-medium py-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="bg-[#000137] p-6 text-white relative">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="font-serif text-2xl font-bold mb-1">
                  Register for Event
                </h3>
                <p className="text-white/80 text-sm">{selectedEvent.title}</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={user?.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue={user?.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#2f3192] focus:border-[#2f3192]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#000137] text-white font-bold py-3 rounded-md hover:bg-[#2f3192] transition-colors mt-4"
                >
                  COMPLETE REGISTRATION
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSuccess(false)}
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
                You're Registered!
              </h3>
              <p className="text-gray-600 mb-6">
                We've sent a confirmation email with all the event details. See
                you there!
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-[#000137] text-white font-bold py-2 rounded-md hover:bg-[#2f3192] transition-colors"
              >
                CLOSE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
