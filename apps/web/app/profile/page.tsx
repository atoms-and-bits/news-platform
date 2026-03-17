import React from 'react';
import Link from 'next/link';
import { User, Mail, CreditCard, Shield, Bookmark } from 'lucide-react';
import { redirect } from 'next/navigation';

import { createClient } from '../../lib/supabase/server';
import { SignOutButton } from '../components/SignOutButton';
import { getArticlesByIds } from '../../lib/sanity/queries';
import { formatRelativeTime } from '../../lib/utils/dateHelpers';
import { urlFor } from '../../lib/sanity/image';
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

  // Fetch bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('sanity_document_id, document_type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const articleBookmarkIds = (bookmarks ?? [])
    .filter((b) => b.document_type === 'article')
    .map((b) => b.sanity_document_id);

  const bookmarkedArticles = await getArticlesByIds(articleBookmarkIds);

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

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Bookmarked Articles
              </h3>
              {bookmarkedArticles.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                  <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No bookmarked articles yet.</p>
                  <Link href="/latest" className="text-sm text-[#2f3192] font-medium hover:underline mt-1 inline-block">
                    Browse articles
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarkedArticles.map((article) => (
                    <Link
                      key={article._id}
                      href={`/article/${article.slug.current}`}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#2f3192]/30 hover:bg-white transition-colors group"
                    >
                      {article.mainImage && (
                        <img
                          src={urlFor(article.mainImage).width(120).height(80).url()}
                          alt={article.title}
                          className="w-20 h-14 object-cover rounded-md flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[#2f3192] text-[10px] font-bold uppercase">{article.category}</span>
                        <h4 className="text-sm font-bold text-[#000137] group-hover:text-[#2f3192] transition-colors line-clamp-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{article.excerpt}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{formatRelativeTime(article.publishedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
