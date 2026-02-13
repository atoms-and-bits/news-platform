'use client';

import React from 'react';
import { HeroGrid } from './components/HeroGrid';
import { LatestPreview } from './components/LatestPreview';
import { FeaturedRoundup } from './components/FeaturedRoundup';
import { PodcastsEvents } from './components/PodcastsEvents';
import { NewsletterBanner } from './components/NewsletterBanner';
import { Testimonials } from './components/Testimonials';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <HeroGrid />

      {/* Bayana Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
        <a
          href="#"
          className="group block w-full bg-[#2f3192] rounded-xl p-4 text-center shadow-md hover:bg-[#242675] transition-colors">
          <span className="text-white font-medium flex items-center justify-center gap-2">
            Explore <span className="font-bold tracking-wide">BAYANA</span> —
            Our AI-powered data research platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </a>
      </div>

      <LatestPreview />
      <FeaturedRoundup />
      <PodcastsEvents />
      <Testimonials />
      <NewsletterBanner />

      {/* Bottom spacing before footer */}
      <div className="h-16 bg-white"></div>
    </>
  );
}
