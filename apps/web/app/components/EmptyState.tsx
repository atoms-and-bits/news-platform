import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 bg-[#2f3192]/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[#2f3192]" />
      </div>
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#000137] mb-3">
        {title}
      </h2>
      <p className="text-gray-500 font-sans max-w-md mb-6">
        {description}
      </p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="px-6 py-2.5 bg-[#000137] text-white font-bold text-sm rounded-md hover:bg-[#2f3192] transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
