// TypeScript types matching the Sanity schema documents.
// These mirror the shapes defined in our Studio's schemaTypes/.

// Define the type manually to resolve the error
export type SanityImageSource = {
  _type?: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
};

// ─── Article ─────────────────────────────────────────────
export interface SanityArticle {
  _id: string;
  _type: "article";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  category: string;
  excerpt: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  mainImage?: SanityImageSource;
  body: any[]; // Portable Text blocks
  featured?: boolean;
  premium?: boolean;
}

// ─── Podcast ─────────────────────────────────────────────
export interface SanityPodcast {
  _id: string;
  _type: "podcast";
  _createdAt: string;
  title: string;
  duration: string;
  description: string;
  publishedAt: string;
  audioUrl?: string;
  coverImage?: SanityImageSource;
}

// ─── Event ───────────────────────────────────────────────
export interface SanityEvent {
  _id: string;
  _type: "event";
  _createdAt: string;
  title: string;
  date: string; // e.g. "15"
  month: string; // e.g. "FEB"
  time?: string;
  location: string;
  venue?: string;
  capacity?: number;
  description?: string;
  premium?: boolean;
}

// ─── Startup ─────────────────────────────────────────────
export interface SanityStartup {
  _id: string;
  _type: "startup";
  _createdAt: string;
  name: string;
  slug: { current: string };
  sector: string;
  location: string;
  description: string;
  longDescription: string;
  website: string;
  founded: string;
  teamSize: string;
  funding: string;
  stage: string;
  logo: string;
  founders: { name: string; role: string }[];
}
