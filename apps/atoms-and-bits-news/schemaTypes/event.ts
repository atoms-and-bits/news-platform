import {defineField, defineType} from 'sanity'

/**
 * Event Schema
 * Schema for community events, conferences, meetups, and workshops.
 * Matches: SanityEvent interface in web/lib/sanity/types.ts
 */
export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    // ─── Basic Info ──────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Event name',
      validation: (Rule) => Rule.required().max(120),
    }),

    // ─── Date & Time ─────────────────────────────────────────
    defineField({
      name: 'date',
      title: 'Date (Day)',
      type: 'string',
      description: 'Day of the month (e.g., "15")',
      placeholder: '15',
      validation: (Rule) =>
        Rule.required().regex(/^\d{1,2}$/, {
          name: 'day',
          invert: false,
        }),
    }),
    defineField({
      name: 'month',
      title: 'Month',
      type: 'string',
      description: 'Month abbreviation (e.g., "FEB", "MAR")',
      placeholder: 'FEB',
      validation: (Rule) =>
        Rule.required()
          .uppercase()
          .length(3)
          .regex(/^[A-Z]{3}$/, {
            name: 'month abbreviation',
            invert: false,
          }),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'Event time (e.g., "10:00 AM - 4:00 PM")',
      placeholder: '10:00 AM - 4:00 PM',
    }),

    // ─── Location ────────────────────────────────────────────
    defineField({
      name: 'location',
      title: 'Location (City)',
      type: 'string',
      description: 'City where the event takes place',
      placeholder: 'Dar es Salaam',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      description: 'Specific venue name',
      placeholder: 'UDSM Innovation Hub',
    }),

    // ─── Details ─────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Event details and what to expect',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),

    // ─── Flags ───────────────────────────────────────────────
    defineField({
      name: 'premium',
      title: 'Premium Event',
      type: 'boolean',
      description: 'Requires subscription to register',
      initialValue: false,
    }),
  ],

  // ─── Preview Configuration ───────────────────────────────
  preview: {
    select: {
      title: 'title',
      location: 'location',
      date: 'date',
      month: 'month',
    },
    prepare(selection) {
      const {location, date, month} = selection
      return {
        ...selection,
        subtitle: `${month} ${date} • ${location}`,
      }
    },
  },

  // ─── Ordering ────────────────────────────────────────────
  orderings: [
    {
      title: 'Date, Upcoming First',
      name: 'dateAsc',
      by: [{field: 'month', direction: 'asc'}, {field: 'date', direction: 'asc'}],
    },
    {
      title: 'Date, Latest First',
      name: 'dateDesc',
      by: [{field: 'month', direction: 'desc'}, {field: 'date', direction: 'desc'}],
    },
  ],
})
