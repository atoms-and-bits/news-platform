import React from 'react';
import Link from 'next/link';
import { User, Mail, CreditCard, Shield } from 'lucide-react';
import { redirect } from 'next/navigation';

import { createClient } from '../../lib/supabase/server';
import { SignOutButton } from '../components/SignOutButton';
import type { Enums } from '../../lib/supabase/database.types';

/** Safely resolve a plan value from the database, defaulting to 'free' */
function resolvePlan(value: unknown): Enums<'user_plan'> {
  if (value === 'premium') {
    return 'premium';
  }
  return 'free';
}

export default async function ProfilePage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect('/signin?next=/profile');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin?next=/profile');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, plan')
    .eq('id', user.id)
    .maybeSingle();

  const displayName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
    user.email?.split('@')[0] ||
    'Member';

  const userEmail = user.email || '';
  const plan = resolvePlan(profile?.plan);
  const isPremium = plan === 'premium';

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#000137] mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-[#000137] px-8 py-8 text-white flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/20">
              {displayName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="text-white/70">{userEmail}</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Full Name</div>
                    <div className="font-medium text-[#000137]">{displayName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Email Address</div>
                    <div className="font-medium text-[#000137]">{userEmail}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Subscription</h3>
              <div className="flex items-center justify-between p-6 bg-white border-2 border-[#2f3192]/10 rounded-xl">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isPremium ? 'bg-amber-100 text-amber-600' : 'bg-[#2f3192]/10 text-[#2f3192]'
                    }`}
                  >
                    {isPremium ? <Shield className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Current Plan</div>
                    <div className="text-xl font-bold text-[#000137] capitalize flex items-center gap-2">
                      {plan}
                      {isPremium && (
                        <span className="bg-amber-400 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">PREMIUM</span>
                      )}
                    </div>
                  </div>
                </div>

                {!isPremium && (
                  <Link
                    href="/subscribe"
                    className="bg-[#2f3192] text-white font-bold py-2 px-4 rounded-md hover:bg-[#242675] transition-colors text-sm"
                  >
                    Upgrade Plan
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
