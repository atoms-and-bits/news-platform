/**
 * Contact Page
 * Client component: Contact info, social links, modal form
 */
'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Linkedin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { ContactModal } from './ContactModal';

const CONTACT_LINKS = [
  { label: 'Send a Story Tip', subject: 'Story Tip', section: 'editorial' },
  { label: 'Report an Error', subject: 'Report an Error', section: 'editorial' },
  { label: 'Guest Contributions', subject: 'Guest Contribution', section: 'editorial' },
  { label: 'Advertise With Us', subject: 'Advertising Inquiry', section: 'business' },
  { label: 'Research Partnerships', subject: 'Partnership Inquiry', section: 'business' },
  { label: 'Event Sponsorship', subject: 'Sponsorship Inquiry', section: 'business' },
] as const;

export default function ContactPage() {
  const [modalSubject, setModalSubject] = useState<string | null>(null);

  const editorialLinks = CONTACT_LINKS.filter((l) => l.section === 'editorial');
  const businessLinks = CONTACT_LINKS.filter((l) => l.section === 'business');

  return (
    <div className="pb-16">
      {/* Hero Header */}
      <div className="bg-[#000137] text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Contact Atoms & Bits
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* General Inquiries */}
        <section className="bg-gray-50 rounded-2xl p-8 md:p-10 mb-8">
          <div className="md:flex md:items-start md:justify-between md:gap-12">
            <div className="mb-6 md:mb-0 md:max-w-sm">
              <h2 className="font-serif text-2xl font-bold text-[#000137] mb-2">
                General Inquiries
              </h2>
              <p className="text-gray-500 font-sans text-sm leading-relaxed">
                Have a question, feedback, or want to get in touch? Reach out and
                we&apos;ll get back to you as soon as we can.
              </p>
            </div>
            <div className="space-y-4 flex-1 md:max-w-sm">
              <a
                href="mailto:atomsandbits@gmail.com"
                className="flex items-center gap-3 text-[#000137] hover:text-[#2f3192] transition-colors group"
              >
                <Mail className="w-5 h-5 text-[#2f3192]" />
                <span className="font-sans text-sm group-hover:underline">
                  atomsandbits@gmail.com
                </span>
              </a>
              <a
                href="tel:+255743892480"
                className="flex items-center gap-3 text-[#000137] hover:text-[#2f3192] transition-colors group"
              >
                <Phone className="w-5 h-5 text-[#2f3192]" />
                <span className="font-sans text-sm group-hover:underline">
                  +255 743 892 480
                </span>
              </a>
              <a
                href="https://www.google.com/maps?q=Mbezi%20beach,+Dar+es+Salaam,+Tanzania"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#000137] hover:text-[#2f3192] transition-colors group"
              >
                <MapPin className="w-5 h-5 text-[#2f3192]" />
                <span className="font-sans text-sm group-hover:underline">
                  Plot No. 2, Brown Street, Mbezi Beach 
                  <br />Dar es Salaam, Tanzania
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Two-column sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* News & Editorial */}
          <section className="bg-gray-50 rounded-2xl p-8">
            <h2 className="font-serif text-xl font-bold text-[#000137] mb-6">
              News & Editorial
            </h2>
            <ul className="space-y-4">
              {editorialLinks.map((link, i) => (
                <li key={link.subject} className={i > 0 ? 'border-t border-gray-200 pt-4' : ''}>
                  <button
                    onClick={() => setModalSubject(link.subject)}
                    className="w-full flex items-center justify-between text-[#000137] hover:text-[#2f3192] transition-colors group"
                  >
                    <span className="font-sans text-sm">{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Partnerships & Business */}
          <section className="bg-gray-50 rounded-2xl p-8">
            <h2 className="font-serif text-xl font-bold text-[#000137] mb-6">
              Partnerships & Business
            </h2>
            <ul className="space-y-4">
              {businessLinks.map((link, i) => (
                <li key={link.subject} className={i > 0 ? 'border-t border-gray-200 pt-4' : ''}>
                  <button
                    onClick={() => setModalSubject(link.subject)}
                    className="w-full flex items-center justify-between text-[#000137] hover:text-[#2f3192] transition-colors group"
                  >
                    <span className="font-sans text-sm">{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Social Links */}
        <section className="text-center border-t border-gray-200 pt-10">
          <h2 className="font-serif text-xl font-bold text-[#000137] mb-4">
            Follow Us
          </h2>
          <p className="text-gray-500 font-sans text-sm mb-6">
            Stay up to date with the latest from Atoms & Bits.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://x.com/anbpost"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#000137] flex items-center justify-center hover:bg-[#2f3192] transition-colors"
            >
              <Image src="/icons/x.svg" alt="X" width={20} height={20} className="invert" />
            </a>
            <a
              href="https://www.linkedin.com/company/anbpost/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#000137] flex items-center justify-center hover:bg-[#2f3192] transition-colors text-white"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/anbpost_/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#000137] flex items-center justify-center hover:bg-[#2f3192] transition-colors"
            >
              <Image src="/icons/instagram.svg" alt="Instagram" width={20} height={20} className="invert" />
            </a>
          </div>
        </section>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={modalSubject !== null}
        onClose={() => setModalSubject(null)}
        subject={modalSubject ?? ''}
      />
    </div>
  );
}
