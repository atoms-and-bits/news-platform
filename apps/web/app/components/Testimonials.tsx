import React from 'react';
import { Quote } from 'lucide-react';
const testimonials = [
{
  id: 1,
  quote:
  'Atoms & Bits has become my daily briefing. The depth of coverage on the Tanzanian tech ecosystem is unmatched.',
  author: 'Jumanne Mtambalike',
  role: 'CEO, Sahara Ventures',
  image:
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&q=80&fit=crop'
},
{
  id: 2,
  quote:
  'Finally, a platform that treats African tech news with the seriousness it deserves. Essential reading for investors.',
  author: 'Miranda Naiman',
  role: 'Founder, Empower',
  image:
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&q=80&fit=crop'
},
{
  id: 3,
  quote:
  'The deep dives into policy and infrastructure have helped us navigate the regulatory landscape with confidence.',
  author: 'Benjamin Fernandez',
  role: 'Founder, NALA',
  image:
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&q=80&fit=crop'
}];

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
            Trusted by Industry Leaders
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto font-sans">
            Join thousands of founders, investors, and policymakers who rely on
            Atoms & Bits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) =>
          <div
            key={item.id}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative group hover:bg-white/10 transition-colors">

              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#2f3192] opacity-50" />

              <p className="text-lg text-white/90 font-serif leading-relaxed mb-8 italic">
                "{item.quote}"
              </p>

              <div className="flex items-center gap-4">
                <img
                src={item.image}
                alt={item.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#2f3192]" />

                <div>
                  <h4 className="font-bold text-white text-sm">
                    {item.author}
                  </h4>
                  <span className="text-xs text-white/60 uppercase tracking-wider">
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}