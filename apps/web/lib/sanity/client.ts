import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "y15xx98w",
  dataset: "production",
  apiVersion: "2026-02-16", // Use today's date or a recent date
  useCdn: true, // `true` for fast, cached reads (public data); `false` for fresh data (authenticated/draft)
});
