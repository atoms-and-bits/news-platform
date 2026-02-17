import {defineField, defineType} from 'sanity'

/**
 * Startup Schema
 * Schema for the startup directory/database.
 * Tracks companies in the East African tech ecosystem.
 * Matches: SanityStartup interface in web/lib/sanity/types.ts
 */
export default defineType({
  name: 'startup',
  title: 'Startup',
  type: 'document',
  fields: [
    // ─── Basic Info ──────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      description: 'Startup name',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of company name',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'string',
      description: 'Emoji or initials (e.g., "🚀" or "TS")',
      placeholder: '🚀',
      validation: (Rule) => Rule.max(10),
    }),

    // ─── Category ────────────────────────────────────────────
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      description: 'Primary industry sector',
      options: {
        list: [
          {title: 'Fintech', value: 'Fintech'},
          {title: 'Agri-Tech', value: 'Agri-Tech'},
          {title: 'Health Tech', value: 'Health Tech'},
          {title: 'E-commerce', value: 'E-commerce'},
          {title: 'Clean Energy', value: 'Clean Energy'},
          {title: 'EdTech', value: 'EdTech'},
          {title: 'Logistics', value: 'Logistics'},
          {title: 'AI/ML', value: 'AI/ML'},
          {title: 'SaaS', value: 'SaaS'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── Location ────────────────────────────────────────────
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Headquarters city',
      placeholder: 'Dar es Salaam, Tanzania',
      validation: (Rule) => Rule.required(),
    }),

    // ─── Description ─────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short description for cards (1-2 sentences)',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      description: 'Detailed description for startup profile page',
      rows: 6,
      validation: (Rule) => Rule.max(1000),
    }),

    // ─── Company Details ─────────────────────────────────────
    defineField({
      name: 'founded',
      title: 'Founded',
      type: 'string',
      description: 'Year founded (e.g., "2020")',
      placeholder: '2020',
      validation: (Rule) =>
        Rule.regex(/^\d{4}$/, {
          name: 'year',
          invert: false,
        }),
    }),
    defineField({
      name: 'teamSize',
      title: 'Team Size',
      type: 'string',
      description: 'Number of employees (e.g., "10-50")',
      placeholder: '10-50',
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      description: 'Current funding stage',
      options: {
        list: [
          {title: 'Pre-seed', value: 'Pre-seed'},
          {title: 'Seed', value: 'Seed'},
          {title: 'Series A', value: 'Series A'},
          {title: 'Series B+', value: 'Series B+'},
          {title: 'Growth', value: 'Growth'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'funding',
      title: 'Funding',
      type: 'string',
      description: 'Total funding raised (e.g., "$1.5M")',
      placeholder: '$1.5M',
    }),

    // ─── Links ───────────────────────────────────────────────
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Company website URL',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),

    // ─── Founders ────────────────────────────────────────────
    defineField({
      name: 'founders',
      title: 'Founders',
      type: 'array',
      description: 'Company founders and their roles',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'role',
              type: 'string',
              title: 'Role',
              placeholder: 'CEO & Co-founder',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role',
            },
          },
        },
      ],
    }),
  ],

  // ─── Preview Configuration ───────────────────────────────
  preview: {
    select: {
      title: 'name',
      sector: 'sector',
      location: 'location',
      logo: 'logo',
    },
    prepare(selection) {
      const {sector, location, logo} = selection
      return {
        ...selection,
        title: logo ? `${logo} ${selection.title}` : selection.title,
        subtitle: `${sector} • ${location}`,
      }
    },
  },

  // ─── Ordering ────────────────────────────────────────────
  orderings: [
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Name, Z-A',
      name: 'nameDesc',
      by: [{field: 'name', direction: 'desc'}],
    },
    {
      title: 'Recently Added',
      name: 'createdDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
