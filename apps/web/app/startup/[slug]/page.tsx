/**
 * Startup Profile Page
 * Server component: Fetches startup data by slug from Sanity
 * Displays detailed information about a specific startup
 */

import React from 'react';
import {
  ArrowLeft,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { getStartupBySlug, getAllStartups } from '../../../lib/sanity/queries';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// ─── Type Definitions ────────────────────────────────────────
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ─── Server Component ────────────────────────────────────────
export default async function StartupProfilePage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch startup from Sanity by slug
  const startup = await getStartupBySlug(slug);

  // If startup not found, show 404
  if (!startup) {
    notFound();
  }

  return (
    <div className="pb-20">
      {/* Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/startups"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#000137] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Startups
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl font-bold text-[#000137] border border-gray-100 flex-shrink-0">
              {startup.logo || startup.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#000137]">
                  {startup.name}
                </h1>
                <span className="bg-[#2f3192]/10 text-[#2f3192] text-xs font-bold px-2 py-1 rounded-md uppercase">
                  {startup.sector}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md uppercase border border-green-200">
                  {startup.stage}
                </span>
              </div>
              <p className="text-xl text-gray-600 font-serif leading-relaxed max-w-3xl">
                {startup.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#000137] text-white font-bold rounded-lg hover:bg-[#2f3192] transition-colors shadow-md"
              >
                <Globe className="w-4 h-4" /> Visit Website
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-[#000137] mb-6">
                About {startup.name}
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>{startup.longDescription || startup.description}</p>
              </div>
            </div>

            {/* Founders Section */}
            {startup.founders && startup.founders.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="font-serif text-2xl font-bold text-[#000137] mb-6">
                  Founding Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {startup.founders.map((founder, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-[#2f3192]/10 rounded-full flex items-center justify-center text-[#2f3192] font-bold">
                        {founder.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#000137]">
                          {founder.name}
                        </div>
                        <div className="text-sm text-gray-500">{founder.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-serif text-xl font-bold text-[#000137] mb-6">
                Quick Facts
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase">
                      Founded
                    </div>
                    <div className="font-medium text-[#000137]">{startup.founded}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase">
                      Location
                    </div>
                    <div className="font-medium text-[#000137]">{startup.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase">
                      Team Size
                    </div>
                    <div className="font-medium text-[#000137]">{startup.teamSize}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase">
                      Total Funding
                    </div>
                    <div className="font-medium text-[#000137]">{startup.funding}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase">
                      Stage
                    </div>
                    <div className="font-medium text-[#000137]">{startup.stage}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ISR Configuration ───────────────────────────────────────
/**
 * Generate static pages for all startups at build time
 * Then use ISR for dynamic updates
 */
export async function generateStaticParams() {
  const startups = await getAllStartups();
  return startups.map((startup) => ({
    slug: startup.slug.current,
  }));
}

export const revalidate = 60; // Revalidate every 60 seconds
