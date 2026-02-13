'use client';

import React from 'react';
import { User, Mail, CreditCard, LogOut, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock user - In a real app, this would come from auth context
const mockUser = {
  name: 'Demo User',
  email: 'demo@example.com',
  plan: 'free' as 'free' | 'basic' | 'standard' | 'premium'
};

export default function ProfilePage() {
  const router = useRouter();
  const user = mockUser; // In a real app: use auth context

  const handleLogout = () => {
    // In a real app: clear auth tokens/cookies
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#000137] mb-4">
            Please sign in
          </h1>
          <Link
            href="/signin"
            className="bg-[#000137] text-white font-bold py-2 px-6 rounded-md hover:bg-[#2f3192] transition-colors">

            Sign In
          </Link>
        </div>
      </div>);

  }
  const isPremium = user.plan === 'premium';
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#000137] mb-8">
          My Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-[#000137] px-8 py-8 text-white flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/20">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-white/70">{user.email}</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Account Details */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Account Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Full Name</div>
                    <div className="font-medium text-[#000137]">
                      {user.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Email Address</div>
                    <div className="font-medium text-[#000137]">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Plan */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Subscription
              </h3>
              <div className="flex items-center justify-between p-6 bg-white border-2 border-[#2f3192]/10 rounded-xl">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isPremium ? 'bg-amber-100 text-amber-600' : 'bg-[#2f3192]/10 text-[#2f3192]'}`}>

                    {isPremium ?
                    <Shield className="w-6 h-6" /> :

                    <CreditCard className="w-6 h-6" />
                    }
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Current Plan</div>
                    <div className="text-xl font-bold text-[#000137] capitalize flex items-center gap-2">
                      {user.plan}
                      {isPremium &&
                      <span className="bg-amber-400 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                          PRO
                        </span>
                      }
                    </div>
                  </div>
                </div>

                {!isPremium &&
                <Link
                  href="/subscribe"
                  className="bg-[#2f3192] text-white font-bold py-2 px-4 rounded-md hover:bg-[#242675] transition-colors text-sm">

                    Upgrade Plan
                  </Link>
                }
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-md transition-colors">

                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
