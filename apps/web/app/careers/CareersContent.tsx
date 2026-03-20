/**
 * Careers Content
 * Client component: Handles search, filtering, and job listing display
 */
'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, ArrowUpRight, Briefcase } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

// ─── Types ───────────────────────────────────────────────────
interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  description: string;
  applyUrl: string;
}

// ─── Static Data (for testing UI) ────────────────────────────
// Set to empty array to show the empty state
const JOBS: JobListing[] = [];

// Uncomment below to test with static data:
// const JOBS: JobListing[] = [
//   {
//     id: '1',
//     title: 'Senior Tech Reporter',
//     department: 'Content',
//     location: 'Dar es Salaam, TZ',
//     type: 'Full-time',
//     description: 'Cover the East African tech ecosystem — startups, policy, and innovation. You will research, interview, and publish in-depth stories.',
//     applyUrl: '#',
//   },
//   {
//     id: '2',
//     title: 'Frontend Engineer',
//     department: 'Engineering',
//     location: 'Remote',
//     type: 'Full-time',
//     description: 'Build and maintain the Atoms & Bits web platform. Work with Next.js, React, and Sanity CMS to deliver a world-class reading experience.',
//     applyUrl: '#',
//   },
//   {
//     id: '3',
//     title: 'Data Research Analyst',
//     department: 'Research',
//     location: 'Dar es Salaam, TZ',
//     type: 'Full-time',
//     description: 'Join the Bayana team to conduct field research, clean and analyze datasets, and generate insights for partners across healthcare, agriculture, and mining.',
//     applyUrl: '#',
//   },
//   {
//     id: '4',
//     title: 'Podcast Producer',
//     department: 'Content',
//     location: 'Dar es Salaam, TZ',
//     type: 'Contract',
//     description: 'Produce and edit the A&B Podcast. Coordinate guests, manage recording sessions, and ensure high-quality audio output.',
//     applyUrl: '#',
//   },
//   {
//     id: '5',
//     title: 'Community & Events Coordinator',
//     department: 'Operations',
//     location: 'Nairobi, KE',
//     type: 'Part-time',
//     description: 'Plan and execute meetups, workshops, and conferences that bring together East Africa\'s tech community.',
//     applyUrl: '#',
//   },
//   {
//     id: '6',
//     title: 'Machine Learning Intern',
//     department: 'Research',
//     location: 'Remote',
//     type: 'Internship',
//     description: 'Work alongside our data team to build ML models that surface insights from raw field data collected across multiple sectors.',
//     applyUrl: '#',
//   },
// ];

const DEPARTMENTS = ['All', 'Engineering', 'Content', 'Research', 'Operations'];

// ─── Component ───────────────────────────────────────────────
export function CareersContent() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');

  const filtered = useMemo(() => {
    return JOBS.filter((job) => {
      const matchesSearch =
        search === '' ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());
      const matchesDept =
        department === 'All' || job.department === department;
      return matchesSearch && matchesDept;
    });
  }, [search, department]);

  // Empty state when no jobs exist at all
  if (JOBS.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Coming Soon"
        description="We're growing and will be posting open roles soon. Check back later or follow us on social media to be the first to know."
        ctaLabel="BROWSE ARTICLES"
        ctaHref="/latest"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2f3192]/30 focus:border-[#2f3192]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartment(dept)}
              className={`px-4 py-2 rounded-lg text-sm font-bold font-sans transition-colors ${
                department === dept
                  ? 'bg-[#000137] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 font-sans mb-6">
        {filtered.length} {filtered.length === 1 ? 'role' : 'roles'} found
      </p>

      {/* Job Listings */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-sans">
            No roles match your search. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <a
              key={job.id}
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2f3192]/20 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-[#000137] mb-2 group-hover:text-[#2f3192] transition-colors">
                    {job.title}
                    <ArrowUpRight className="inline-block w-5 h-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-500 font-sans">
                    <span className="inline-block px-2.5 py-0.5 bg-[#2f3192]/10 text-[#2f3192] text-xs font-bold uppercase tracking-wider rounded-full">
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600 font-sans text-sm leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
