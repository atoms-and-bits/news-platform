import React from 'react';
export function NewsletterBanner() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#2f3192] rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#000137]/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Never Miss a Story
          </h2>
          <p className="text-white/80 text-lg mb-8 font-sans">
            Join 12,000+ founders, executives, and policymakers who start their
            day with Atoms & Bits.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-md text-[#000137] focus:outline-none focus:ring-2 focus:ring-white/50" />

            <button className="px-6 py-3 bg-[#000137] text-white font-bold rounded-md hover:bg-[#000137]/80 transition-colors shadow-lg">
              SUBSCRIBE
            </button>
          </div>
          <p className="text-white/40 text-xs mt-4 font-sans">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>);

}