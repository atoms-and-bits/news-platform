import {defineField, defineType} from 'sanity'

/**
 * Podcast Schema
 * Schema for podcast episodes.
 * Matches: SanityPodcast interface in web/lib/sanity/types.ts
 */
export default defineType({
  name: 'podcast',
  title: 'Podcast',
  type: 'document',
  fields: [
    // ─── Basic Info ──────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Episode title',
      validation: (Rule) => Rule.required().max(150),
    }),

    // ─── Episode Details ─────────────────────────────────────
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Episode length (e.g., "42 min")',
      placeholder: '42 min',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Episode summary',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),

    // ─── Publishing ──────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'When the episode was published',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),

    // ─── Media ───────────────────────────────────────────────
    defineField({
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url',
      description: 'Link to audio file (e.g., Spotify, Apple Podcasts, SoundCloud)',
      placeholder: 'https://open.spotify.com/episode/...',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Episode artwork',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
  ],

  // ─── Preview Configuration ───────────────────────────────
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      media: 'coverImage',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {duration, publishedAt} = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date'
      return {
        ...selection,
        subtitle: duration ? `${duration} • ${date}` : date,
      }
    },
  },

  // ─── Ordering ────────────────────────────────────────────
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published Date, Oldest',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
})
