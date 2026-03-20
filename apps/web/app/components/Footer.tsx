import React from 'react';
import Link from 'next/link';
import { Linkedin, Instagram } from 'lucide-react';
import Image from 'next/image';
import { FooterCTA } from './FooterCTA';

export function Footer() {
  return (
    <footer className="bg-[#000137] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 bg-[#2f3192] rounded-md flex items-center justify-center shadow-sm group-hover:bg-white transition-colors">
                <span className="text-white group-hover:text-[#2f3192] font-bold font-serif text-sm transition-colors">
                  A&B
                </span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight font-sans">
                Atoms & Bits
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed font-sans max-w-xs">
              Deep-tech reporting and data-driven insights for Tanzania and East
              Africa. Bridging the gap between innovation and policy.
            </p>
          </div>

          {/* Sections Column */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-white">
              Sections
            </h3>
            <ul className="space-y-3 font-sans text-sm text-white/70">
              <li>
                <Link
                  href="/latest"
                  className="hover:text-white transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link
                  href="/featured"
                  className="hover:text-white transition-colors">
                  Featured Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/roundups"
                  className="hover:text-white transition-colors">
                  Weekly Roundups
                </Link>
              </li>
              <li>
                <Link
                  href="/podcasts"
                  className="hover:text-white transition-colors">
                  Podcasts
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-white">
              Company
            </h3>
            <ul className="space-y-3 font-sans text-sm text-white/70">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors font-bold text-[#a5a6ff]">

                  BAYANA Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-white">
              Connect
            </h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://x.com/anbpost"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#2f3192] transition-colors text-white">
                <Image src="/icons/x.svg" alt="X" width={20} height={20} className="invert" />
              </a>
              <a
                href="https://www.linkedin.com/company/anbpost/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#2f3192] transition-colors text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/anbpost_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#2f3192] transition-colors text-white">
                <Image src="/icons/instagram.svg" alt="Instagram" width={20} height={20} className="invert" />
              </a>
            </div>
            <FooterCTA />
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 font-sans">
          <p>© 2026 Atoms & Bits. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>);

}
