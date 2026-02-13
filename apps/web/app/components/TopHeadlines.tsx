'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { allArticles } from '../data/articles';

export function TopHeadlines() {
  // Get 5 headlines from articles data, skipping the first few that might be in hero
  const headlines = allArticles.slice(3, 8);
  return (
    <aside className="bg-[#000137] text-white rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h2 className="font-serif text-2xl font-bold text-white">
          Top headlines
        </h2>
      </div>

      <ul className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {headlines.map((article) =>
        <li key={article.id} className="group cursor-pointer">
          <Link href={`/article/${article.id}`}>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2f3192] flex-shrink-0 group-hover:bg-white transition-colors" />
              <div>
                <span className="text-[#a5a6ff] font-bold text-sm block mb-1 font-sans tracking-wide">
                  {article.category}:
                </span>
                <p className="font-serif text-white/90 leading-snug group-hover:text-white transition-colors">
                  {article.title}
                </p>
              </div>
            </div>
          </Link>
        </li>
        )}
      </ul>

      <div className="mt-6 pt-4 border-t border-white/10">
        <Link
          href="/stories"
          className="text-sm font-bold text-white flex items-center gap-2 hover:gap-3 transition-all">
          VIEW ALL STORIES <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>);

}