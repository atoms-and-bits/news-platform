'use client';

import { useState, useCallback, useMemo } from 'react';

const DEFAULT_PAGE_SIZE = 12;

interface UsePaginationResult<T> {
  /** Items visible on the current "page" */
  displayedItems: T[];
  /** Whether there are more items to show */
  hasMore: boolean;
  /** Show the next page of items */
  loadMore: () => void;
  /** Reset back to the first page (e.g. after a filter change) */
  reset: () => void;
}

export function usePagination<T>(
  items: T[],
  pageSize = DEFAULT_PAGE_SIZE
): UsePaginationResult<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const displayedItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(
    () => setVisibleCount((prev) => prev + pageSize),
    [pageSize]
  );

  const reset = useCallback(
    () => setVisibleCount(pageSize),
    [pageSize]
  );

  return { displayedItems, hasMore, loadMore, reset };
}
