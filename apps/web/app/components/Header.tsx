'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useUser } from '../../lib/supabase/UserContext';

/**
 * Site header with navigation, user menu, and premium badge.
 * Consumes auth state from UserContext via useUser().
 */
export function Header() {
  const { user, signOut } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navLinks = [
  {
    name: 'Latest',
    id: 'latest',
    href: '/latest'
  },
  {
    name: 'Featured',
    id: 'featured',
    href: '/featured'
  },
  {
    name: 'Weekly Roundups',
    id: 'roundups',
    href: '/roundups'
  },
  {
    name: 'Podcasts',
    id: 'podcasts',
    href: '/podcasts'
  },
  {
    name: 'Events',
    id: 'events',
    href: '/events'
  },
  {
    name: 'Startups',
    id: 'startups',
    href: '/startups'
  }];

  const isPremium = user?.plan === 'premium';
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <Image
              src="/logo.png"
              alt="Atoms & Bits"
              width={60}
              height={60}
              className="rounded-md shadow-sm"
              priority
            />
            <span className="text-[#000137] font-bold text-xl tracking-tight hidden sm:block font-sans">
              Atoms & Bits
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
            <Link
              key={link.name}
              href={link.href}
              className={`font-medium text-sm transition-colors relative group ${pathname === link.href ? 'text-[#2f3192]' : 'text-[#000137] hover:text-[#2f3192]'}`}>

                {link.name}
                <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#2f3192] transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />

              </Link>
            )}
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Header CTA - Visible on mobile only */}
            <div className="md:hidden flex items-center mr-2">
              {user && isPremium &&
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  PREMIUM
                </span>
              }
              {user && !isPremium &&
              <Link
                href="/subscribe"
                className="bg-[#2f3192] text-white text-[10px] font-bold px-2 py-1.5 rounded-md hover:bg-[#242675] transition-colors shadow-sm">
                  Try Premium
                </Link>
              }
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {user ?
              <div className="flex items-center gap-3">
                  {!isPremium &&
                <Link
                  href="/subscribe"
                  className="bg-[#2f3192] text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-[#242675] transition-colors shadow-sm">
                      Try Premium
                    </Link>
                }

                  <div className="relative">
                    <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors">

                      <div className="w-8 h-8 bg-[#2f3192]/10 rounded-full flex items-center justify-center text-[#2f3192] font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-[#000137]">
                        {user.name}
                      </span>
                      {isPremium &&
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          PREMIUM
                        </span>
                    }
                    </button>

                    {showUserMenu &&
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-bold text-[#000137] truncate">
                            {user.email}
                          </p>
                          <p className="text-xs text-[#2f3192] font-medium mt-1 uppercase">
                            {user.plan} Plan
                          </p>
                        </div>
                        <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-4 py-2 text-sm text-[#000137] hover:bg-gray-50 flex items-center gap-2">

                          <Settings className="w-4 h-4" /> My Profile
                        </Link>
                        <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">

                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                  }
                  </div>
                </div> :

              <>
                  <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-bold text-[#000137] border border-[#000137] rounded-md hover:bg-gray-50 transition-colors">
                    SIGN IN
                  </Link>
                  <Link
                  href="/signin?mode=signup"
                  className="px-4 py-2 text-sm font-bold text-white bg-[#000137] rounded-md hover:bg-[#2f3192] transition-colors shadow-sm">
                    SIGN UP
                  </Link>
                </>
              }
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#000137]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>

              {isMenuOpen ?
              <X className="w-6 h-6" /> :

              <Menu className="w-6 h-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen &&
      <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) =>
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className={`block w-full text-left px-3 py-3 text-base font-medium rounded-md ${pathname === link.href ? 'bg-[#2f3192]/5 text-[#2f3192]' : 'text-[#000137] hover:bg-gray-50'}`}>

                {link.name}
              </Link>
          )}
            <div className="mt-4 flex flex-col gap-3 px-3">
              {user ?
            <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#2f3192]/10 rounded-full flex items-center justify-center text-[#2f3192] font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#000137]">
                          {user.name}
                        </p>
                        {isPremium &&
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            PREMIUM
                          </span>
                    }
                      </div>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  {!isPremium &&
              <Link
                href="/subscribe"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full mb-3 px-4 py-2 text-sm font-bold text-white bg-[#2f3192] rounded-md text-center">
                      Try Premium
                    </Link>
              }

                  <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-4 py-3 text-sm font-bold text-[#000137] border border-gray-200 rounded-md text-center hover:bg-gray-50 mb-3">
                    My Profile
                  </Link>

                  <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm font-bold text-red-600 border border-red-200 rounded-md text-center hover:bg-red-50">

                    SIGN OUT
                  </button>
                </div> :

            <>
                  <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-4 py-3 text-sm font-bold text-[#000137] border border-[#000137] rounded-md text-center">
                    SIGN IN
                  </Link>
                  <Link
                href="/signin?mode=signup"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-4 py-3 text-sm font-bold text-white bg-[#000137] rounded-md text-center">
                    SIGN UP
                  </Link>
                </>
            }
            </div>
          </div>
        </div>
      }
    </header>);

}