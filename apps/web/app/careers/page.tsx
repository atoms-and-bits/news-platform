/**
 * Careers Page
 * Server component: Renders the careers page shell
 * Delegates interactivity (search, filters) to CareersContent client component
 */

import React from 'react';
import { CareersContent } from './CareersContent';

export default function CareersPage() {
  return (
    <div className="pb-12">
      {/* Hero Header */}
      <div className="bg-[#000137] text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Careers
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-sans">
            Join us in shaping the future of tech journalism and data-driven
            insights across East Africa.
          </p>
        </div>
      </div>

      <CareersContent />
    </div>
  );
}
