/**
 * Events Content Component
 * Client component: Handles event registration state and RSVP actions
 */
'use client';

import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Clock,
  ArrowRight,
  X,
  CheckCircle,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';
import { useUser } from '../../lib/supabase/UserContext';

const UNLIMITED_CAPACITY_FALLBACK = 99999; // Used for events without capacity limits in the RSVP RPC

interface Event {
  id: string;
  title: string;
  date: string;
  month: string;
  time: string;
  location: string;
  venue: string;
  capacity: number | null;
  description: string;
  premium: boolean;
}

interface EventsContentProps {
  events: Event[];
}

type AvailabilityMap = Record<
  string,
  {
    isFull: boolean;
    spotsRemaining: number | null;
  }
>;

export function EventsContent({ events }: EventsContentProps) {
  const { user, isLoading } = useUser();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [isFetchingState, setIsFetchingState] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setIsFetchingState(false);
      return;
    }

    const supabase = createClient();
    let isMounted = true;

    const loadEventState = async () => {
      setIsFetchingState(true);

      const [availabilityEntries, registeredEventIds] = await Promise.all([
        Promise.all(
          events.map(async (event) => {
            const { data, error } = await supabase.rpc('get_event_rsvp_count', {
              event_id: event.id,
            });

            if (error) {
              return [
                event.id,
                {
                  isFull: false,
                  spotsRemaining: event.capacity,
                },
              ] as const;
            }

            const confirmedCount = typeof data === 'number' ? data : 0;
            const spotsRemaining =
              event.capacity === null ? null : Math.max(event.capacity - confirmedCount, 0);

            return [
              event.id,
              {
                isFull: event.capacity !== null ? confirmedCount >= event.capacity : false,
                spotsRemaining,
              },
            ] as const;
          })
        ),
        user
          ? supabase
              .from('event_rsvps')
              .select('sanity_event_id')
              .eq('user_id', user.id)
              .eq('status', 'confirmed')
              .then(({ data, error }) => {
                if (error || !data) {
                  return [];
                }
                return data.map((row) => row.sanity_event_id);
              })
          : Promise.resolve([] as string[]),
      ]);

      if (!isMounted) {
        return;
      }

      setAvailability(Object.fromEntries(availabilityEntries));
      setRegisteredEvents(registeredEventIds);
      setIsFetchingState(false);
    };

    loadEventState();

    return () => {
      isMounted = false;
    };
  }, [events, user]);

  const handleRegisterClick = (event: Event) => {
    setErrorMessage(null);

    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (event.premium && user.plan !== 'premium') {
      setShowUpgradePrompt(true);
      return;
    }

    if (availability[event.id]?.isFull) {
      return;
    }

    setSelectedEvent(event);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !selectedEvent) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('rsvp_to_event', {
        p_user_id: user.id,
        p_event_id: selectedEvent.id,
        p_capacity: selectedEvent.capacity ?? UNLIMITED_CAPACITY_FALLBACK,
      });

      if (error) {
        throw error;
      }

      const result = data?.[0];
      if (!result) {
        throw new Error('No RSVP response returned from Supabase.');
      }

      if (result.success) {
        setRegisteredEvents((current) =>
          current.includes(selectedEvent.id) ? current : [...current, selectedEvent.id]
        );
        setAvailability((current) => ({
          ...current,
          [selectedEvent.id]: {
            isFull:
              selectedEvent.capacity !== null
                ? result.spots_remaining <= 0
                : false,
            spotsRemaining:
              selectedEvent.capacity === null ? null : Math.max(result.spots_remaining, 0),
          },
        }));
        setSelectedEvent(null);
        setShowSuccess(true);
        return;
      }

      if (result.result_status === 'already_registered') {
        setRegisteredEvents((current) =>
          current.includes(selectedEvent.id) ? current : [...current, selectedEvent.id]
        );
        setSelectedEvent(null);
        return;
      }

      if (result.result_status === 'event_full') {
        setAvailability((current) => ({
          ...current,
          [selectedEvent.id]: {
            isFull: true,
            spotsRemaining: 0,
          },
        }));
        setErrorMessage('This event is now full. A cancelled spot may open later.');
        setSelectedEvent(null);
        return;
      }

      setErrorMessage('Unable to complete registration right now.');
    } catch {
      setErrorMessage('Unable to complete registration right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRsvp = async (event: Event) => {
    if (!user) {
      return;
    }

    setErrorMessage(null);
    setIsCancelling(event.id);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('cancel_event_rsvp', {
        p_user_id: user.id,
        p_event_id: event.id,
      });

      if (error) {
        throw error;
      }

      const result = data?.[0];
      if (!result) {
        setErrorMessage('No cancellation response returned from Supabase.');
        return;
      }

      if (!result.success) {
        if (result.result_status === 'not_found') {
          setErrorMessage('This RSVP was not found or was already cancelled.');
          return;
        }

        setErrorMessage(`Unable to cancel RSVP: ${result.result_status}`);
        return;
      }

      setRegisteredEvents((current) => current.filter((registeredId) => registeredId !== event.id));
      setAvailability((current) => {
        const currentAvailability = current[event.id];
        if (!currentAvailability) {
          return current;
        }

        return {
          ...current,
          [event.id]: {
            isFull: false,
            spotsRemaining:
              currentAvailability.spotsRemaining === null
                ? null
                : currentAvailability.spotsRemaining + 1,
          },
        };
      });
      setShowCancelSuccess(true);
    } catch {
      setErrorMessage('Unable to cancel this RSVP right now.');
    } finally {
      setIsCancelling(null);
    }
  };

  return (
    <div className="pb-12 relative">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const isRegistered = registeredEvents.includes(event.id);
            const isLocked = event.premium && user?.plan !== 'premium';
            const eventAvailability = availability[event.id];
            const isFull = eventAvailability?.isFull ?? false;
            const spotsRemaining = eventAvailability?.spotsRemaining;

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
              >
                <div
                  className={`h-2 ${
                    event.premium ? 'bg-amber-400' : 'bg-[#2f3192]'
                  }`}
                />

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center min-w-[60px]">
                      <span className="block text-xs font-bold text-gray-500 uppercase">
                        {event.month}
                      </span>
                      <span className="block text-2xl font-bold text-[#000137]">
                        {event.date}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {event.premium && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                          <Lock className="w-3 h-3" /> PREMIUM
                        </span>
                      )}
                      {isFull && !isRegistered && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">
                          FULL
                        </span>
                      )}
                      <span className="bg-[#2f3192]/10 text-[#2f3192] text-xs font-bold px-2 py-1 rounded-md">
                        UPCOMING
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#000137] mb-2 group-hover:text-[#2f3192] transition-colors">
                    {event.title}
                  </h3>

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

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mb-6 text-sm">
                    {event.capacity === null ? (
                      <span className="text-gray-500">Open registration</span>
                    ) : isFetchingState ? (
                      <span className="text-gray-500">Checking availability...</span>
                    ) : (
                      <span
                        className={
                          isFull ? 'text-red-600 font-medium' : 'text-gray-600'
                        }
                      >
                        {spotsRemaining === 0
                          ? 'No spots remaining'
                          : `${spotsRemaining ?? 0} spots remaining`}
                      </span>
                    )}
                  </div>

                  {isRegistered ? (
                    <div className="space-y-2">
                      <button
                        disabled
                        className="w-full bg-green-50 text-green-700 font-bold text-sm py-2 rounded border border-green-200 flex items-center justify-center gap-2 cursor-default"
                      >
                        <CheckCircle className="w-4 h-4" /> REGISTERED
                      </button>
                      <button
                        onClick={() => handleCancelRsvp(event)}
                        disabled={isCancelling === event.id}
                        className="w-full border border-red-200 text-red-600 font-bold text-sm py-2 rounded hover:bg-red-50 transition-colors disabled:opacity-60"
                      >
                        {isCancelling === event.id ? 'CANCELLING...' : 'CANCEL RSVP'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegisterClick(event)}
                      disabled={isFull || isLoading}
                      className="w-full border border-[#000137] text-[#000137] font-bold text-sm py-2 rounded hover:bg-[#000137] hover:text-white transition-colors flex items-center justify-center gap-2 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white disabled:hover:text-gray-400"
                    >
                      {!user
                        ? 'SIGN IN TO REGISTER'
                        : isLocked
                          ? 'UPGRADE TO REGISTER'
                          : isFull
                            ? 'EVENT FULL'
                            : 'REGISTER NOW'}{' '}
                      {!isFull && <ArrowRight className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                  href="/signin?next=/events"
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
                  Confirm RSVP
                </h3>
                <p className="text-white/80 text-sm">{selectedEvent.title}</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-5">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm text-gray-700">
                  <p>
                    You are registering as <span className="font-semibold text-[#000137]">{user?.name}</span>.
                  </p>
                  <p>
                    Confirmation details will be tied to <span className="font-semibold text-[#000137]">{user?.email}</span>.
                  </p>
                  {selectedEvent.capacity !== null && (
                    <p>
                      Spots remaining:{' '}
                      <span className="font-semibold text-[#000137]">
                        {availability[selectedEvent.id]?.spotsRemaining ?? selectedEvent.capacity}
                      </span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#000137] text-white font-bold py-3 rounded-md hover:bg-[#2f3192] transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'REGISTERING...' : 'CONFIRM RSVP'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                RSVP Confirmed
              </h3>
              <p className="text-gray-600 mb-6">
                Your registration is saved. If plans change, you can cancel and free the spot for someone else.
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

      <AnimatePresence>
        {showCancelSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCancelSuccess(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#000137] mb-2">
                RSVP Cancelled
              </h3>
              <p className="text-gray-600 mb-6">
                Your spot has been released. You can register again later if space is still available.
              </p>
              <button
                onClick={() => setShowCancelSuccess(false)}
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
