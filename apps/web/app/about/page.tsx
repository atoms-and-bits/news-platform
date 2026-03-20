/**
 * About Us Page
 * Static page: Mission, research & innovation vision, Bayana brief
 */

import React from 'react';
import Link from 'next/link';
import { Lightbulb, FlaskConical, Database, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pb-16">
      {/* Hero Header */}
      <div className="bg-[#000137] text-white py-20 mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            About Atoms & Bits
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
            Deep-tech reporting and data-driven insights bridging the gap
            between innovation and impact across East Africa and the continent.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#000137]">
              Our Mission
            </h2>
          </div>
          <div className="space-y-4 text-gray-600 font-sans leading-relaxed text-base md:text-lg">
            <p>
              Atoms & Bits exists to cover the full spectrum of technology across
              East Africa — from fintech breakthroughs and AI applications to
              agri-tech innovations and e-government policy. But we go beyond
              reporting.
            </p>
            <p>
              We believe in fostering a culture where young people across the
              continent grow up aspiring to make technological advancements and
              innovations that solve our most pressing challenges — solutions
              built by Africans, with the context of what our life is.
            </p>
          </div>
        </section>

        {/* Research & Innovation */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#000137]">
              Research & Innovation
            </h2>
          </div>
          <div className="space-y-4 text-gray-600 font-sans leading-relaxed text-base md:text-lg">
            <p>
              We are building partnerships with research centers, laboratories,
              and universities to showcase groundbreaking work happening across
              East Africa. By highlighting this research, we want to inspire the
              next generation of innovators and demonstrate that world-class
              science and engineering is happening right here.
            </p>
            <p>
              Our goal is to create a bridge between academia and the public —
              making research accessible, celebrating breakthroughs, and
              motivating more people to pursue careers in science, technology,
              and innovation across the continent.
            </p>
          </div>
        </section>

        {/* Bayana */}
        <section className="bg-[#000137] rounded-2xl p-8 md:p-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-[#a5a6ff]" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold">
              Bayana
            </h2>
          </div>
          <div className="space-y-4 text-white/70 font-sans leading-relaxed text-base md:text-lg mb-8">
            <p>
              Bayana is our data and research arm, built to tackle the data
              problem across East Africa and the continent at large. We conduct
              field research in sectors such as healthcare, mining, and
              agriculture — collecting raw data where none exists.
            </p>
            <p>
              Our dedicated team of experts and willing learners work to make
              sense of this data, generate actionable insights, and turn
              investment strategies, opportunity searching, and development
              planning from a guessing game into a data-driven discipline.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2f3192] text-white font-bold text-sm rounded-md hover:bg-[#a5a6ff] hover:text-[#000137] transition-colors"
          >
            Learn More About Bayana <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
