/**
 * Schema Types Index
 * Central export for all Sanity schema definitions.
 * These define the structure of content in Sanity Studio.
 */

import article from './article'
import podcast from './podcast'
import event from './event'
import startup from './startup'
import blockContent from './blockContent'

export const schemaTypes = [
  // ─── Content Types ───────────────────────────────────────
  article,
  podcast,
  event,
  startup,

  // ─── Rich Text Config ────────────────────────────────────
  blockContent,
]
