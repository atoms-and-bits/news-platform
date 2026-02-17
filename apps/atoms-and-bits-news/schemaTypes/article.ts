import {defineField, defineType} from 'sanity'

/**
 * Article Schema
 * Main content type for news articles, stories, and analysis pieces.
 * Matches: SanityArticle interface in web/lib/sanity/types.ts
 */
export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    // ─── Basic Info ──────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The article headline',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Primary article category',
      options: {
        list: [
          {title: 'AI', value: 'AI'},
          {title: 'Fintech', value: 'Fintech'},
          {title: 'Infrastructure', value: 'Infrastructure'},
          {title: 'Clean Energy', value: 'Clean Energy'},
          {title: 'Policy & Tech', value: 'Policy & Tech'},
          {title: 'Venture Capital', value: 'Venture Capital'},
          {title: 'Featured', value: 'Featured'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── Content ─────────────────────────────────────────────
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Short summary shown in article cards (max 200 chars)',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description: 'Featured image for the article',
      options: {
        hotspot: true, // Enables cropping
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      description: 'Main article content (rich text)',
    }),

    // ─── Author Info ─────────────────────────────────────────
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Author name (e.g., "John Doe")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
      description: 'Author title (e.g., "Senior Reporter")',
      placeholder: 'Senior Reporter',
    }),

    // ─── Publishing ──────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'When the article was/will be published',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      description: 'Estimated reading time (e.g., "5 min read")',
      placeholder: '5 min read',
    }),

    // ─── Flags ───────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this article in featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'premium',
      title: 'Premium Content',
      type: 'boolean',
      description: 'Requires subscription to view',
      initialValue: false,
    }),
  ],

  // ─── Preview Configuration ───────────────────────────────
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
      category: 'category',
    },
    prepare(selection) {
      const {author, category} = selection
      return {
        ...selection,
        subtitle: `${category} • by ${author}`,
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
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
