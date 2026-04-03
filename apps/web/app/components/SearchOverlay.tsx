'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { SearchableArticle } from '../../lib/sanity/types';

const SEARCH_CACHE_KEY = 'article-search-index-v2';
const SEARCH_CACHE_TTL_MS = 15 * 60 * 1000;
const SEARCH_RESULT_LIMIT = 10;

type SearchIndexCache = {
  articles: SearchableArticle[];
  fetchedAt: number;
};

let inMemorySearchCache: SearchIndexCache | null = null;

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function isCacheFresh(cache: SearchIndexCache | null): cache is SearchIndexCache {
  return Boolean(cache && Date.now() - cache.fetchedAt < SEARCH_CACHE_TTL_MS);
}

function readStoredCache(): SearchIndexCache | null {
  if (typeof window === 'undefined') return null;

  const raw = window.sessionStorage.getItem(SEARCH_CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SearchIndexCache;
    if (
      !Array.isArray(parsed.articles) ||
      typeof parsed.fetchedAt !== 'number' ||
      parsed.articles.some((article) => typeof article._id !== 'string')
    ) {
      window.sessionStorage.removeItem(SEARCH_CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    window.sessionStorage.removeItem(SEARCH_CACHE_KEY);
    return null;
  }
}

function writeStoredCache(cache: SearchIndexCache) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(cache));
}

function filterArticles(articles: SearchableArticle[], rawQuery: string) {
  const normalizedQuery = rawQuery.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return articles
    .filter((article) => {
      const title = article.title.toLowerCase();
      const excerpt = article.excerpt?.toLowerCase() ?? '';
      return title.includes(normalizedQuery) || excerpt.includes(normalizedQuery);
    })
    .slice(0, SEARCH_RESULT_LIMIT);
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchableArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchableArticle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the overlay is rendered
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
    // Reset state when closing
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setFetchFailed(false);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const applySearch = useCallback((value: string, articles: SearchableArticle[]) => {
    if (!value.trim()) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setResults(filterArticles(articles, value));
      setHasSearched(true);
      setLoading(false);
    }, 300);
  }, []);

  const fetchSearchIndex = useCallback(async () => {
    const response = await fetch('/api/search/articles', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Search index request failed with status ${response.status}`);
    }

    const articles: SearchableArticle[] = await response.json();
    const cache = {
      articles,
      fetchedAt: Date.now(),
    };

    inMemorySearchCache = cache;
    writeStoredCache(cache);
    setSearchIndex(articles);

    return cache;
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    const loadSearchIndex = async () => {
      const memoryCache = inMemorySearchCache;
      if (isCacheFresh(memoryCache)) {
        setSearchIndex(memoryCache.articles);
        return;
      }

      const storedCache = readStoredCache();
      if (storedCache) {
        inMemorySearchCache = storedCache;
        setSearchIndex(storedCache.articles);

        if (isCacheFresh(storedCache)) {
          return;
        }
      }

      if (!storedCache) {
        setLoading(true);
      }

      try {
        await fetchSearchIndex();
      } catch (error) {
        console.error('Search index fetch failed', error);

        if (!isCancelled) {
          setFetchFailed(true);
          setLoading(false);
        }
      }
    };

    void loadSearchIndex();

    return () => {
      isCancelled = true;
    };
  }, [fetchSearchIndex, isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    if (searchIndex.length === 0) {
      if (!fetchFailed) setLoading(true);
      return;
    }

    applySearch(query, searchIndex);
  }, [applySearch, query, searchIndex]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search panel */}
      <div className="relative bg-white w-full max-w-2xl mx-auto mt-20 rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            id="search-articles"
            name="search-articles"
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 text-base text-[#000137] placeholder-gray-400 outline-none font-sans"
          />
          {loading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 && (
            <ul className="py-2">
              {results.map((article) => (
                <li key={article._id}>
                  <Link
                    href={`/article/${article.slug.current}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#000137] text-white flex items-center justify-center text-[11px] font-bold tracking-wide">
                          A&B
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#000137] truncate">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-[#2f3192]">
                          {article.category}
                        </span>
                        {article.premium && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Empty state */}
          {hasSearched && results.length === 0 && !loading && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500 font-sans">
                No articles found for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {/* Initial state hint */}
          {!hasSearched && !loading && !fetchFailed && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400 font-sans">
                Start typing to search articles
              </p>
            </div>
          )}

          {/* Fetch error state */}
          {fetchFailed && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500 font-sans">
                Search is unavailable right now. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
