import React from 'react';
import { Newspaper, Users, TrendingUp } from 'lucide-react';

const highlights = [
  {
    id: 1,
    stat: '250K+',
    label: 'Impressions',
    description:
      'Nearly 250,000 impressions across LinkedIn, X, and Substack since launching in 2022.',
    icon: Users,
  },
  {
    id: 2,
    stat: '50+',
    label: 'Weekly editions',
    description:
      'Consistent weekly coverage of Tanzania and East Africa\u2019s tech ecosystem \u2014 startups, policy, fintech, AI, and more.',
    icon: Newspaper,
  },
  {
    id: 3,
    stat: '2,600+',
    label: 'Subscribers',
    description:
      'A growing community of investors, entrepreneurs, and tech enthusiasts who trust A&B for their weekly briefing.',
    icon: TrendingUp,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-[#000137] text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#2f3192] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-[#2f3192] rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Why Atoms & Bits
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto font-sans">
            Tanzania&apos;s #1 tech newsletter, now a full platform. Built for
            the builders, investors, and policymakers shaping East Africa&apos;s
            digital future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative group hover:bg-white/10 transition-colors text-center"
            >
              <div className="w-14 h-14 bg-[#2f3192]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-7 h-7 text-[#a5a6ff]" />
              </div>
              <div className="text-4xl font-bold text-white mb-1 font-serif">
                {item.stat}
              </div>
              <div className="text-sm font-bold text-[#a5a6ff] uppercase tracking-wider mb-4">
                {item.label}
              </div>
              <p className="text-white/70 font-sans text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}