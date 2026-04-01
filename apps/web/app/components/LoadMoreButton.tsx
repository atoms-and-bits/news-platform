'use client';

import React from 'react';

interface LoadMoreButtonProps {
  /** Called when the button is clicked */
  onLoadMore: () => void;
  /** Label text (default: "Load More") */
  label?: string;
}

export function LoadMoreButton({
  onLoadMore,
  label = 'Load More',
}: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onLoadMore}
        className="px-8 py-3 bg-[#000137] text-white font-bold text-sm rounded-lg hover:bg-[#2f3192] transition-colors shadow-sm"
      >
        {label}
      </button>
    </div>
  );
}
