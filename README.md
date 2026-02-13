# Atoms & Bits - News Platform

> Deep-tech reporting and data-driven insights for Tanzania and East Africa

## 📰 About Atoms & Bits

**Atoms & Bits** is a technology news and research platform focused on Tanzania and the East African tech ecosystem. We provide in-depth coverage of startups, policy, innovation, and the people building the future of technology in the region.

This repository contains the codebase for our **news website platform** - a Next.js-based web application featuring articles, podcasts, events, and a comprehensive startup directory.

---

## 🚀 Quick Start for Engineers

### Prerequisites

- **Node.js** 18+ and **pnpm** installed
- Basic familiarity with Next.js 14+ (App Router)
- Understanding of TypeScript and React

### Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd news-platform

# 2. Install dependencies
pnpm install

# 3. Run development server (from root using pnpm workspace)
pnpm --filter web dev

# Or navigate to the app directory
cd apps/web
pnpm run dev

# 4. Open in browser
# → http://localhost:3000
```

### First-Time Setup Checklist

- [ ] Read [CODEBASE_GUIDE.md](CODEBASE_GUIDE.md) - Complete codebase reference
- [ ] Review [apps/web/app/data/](apps/web/app/data/) - Understand current data structure
- [ ] Explore the component library in [apps/web/app/components/](apps/web/app/components/)
- [ ] Check out a few pages to see data flow patterns

---

## 🏗️ Project Structure

This is a **Turborepo monorepo** with the following structure:

```
news-platform/
├── apps/
│   ├── web/                  # Main Next.js application (PRIMARY)
│   │   ├── app/
│   │   │   ├── components/   # React components
│   │   │   ├── data/         # Mock data (to be replaced with Sanity CMS)
│   │   │   ├── */page.tsx    # Route pages
│   │   │   └── layout.tsx    # Root layout
│   │   └── public/           # Static assets
│   └── docs/                 # Documentation site (optional)
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── eslint-config/        # Shared ESLint configs
│   └── typescript-config/    # Shared TypeScript configs
├── CODEBASE_GUIDE.md         # 📚 Detailed codebase documentation
├── SANITY_MIGRATION_PLAN.md  # 🔄 Sanity CMS integration guide
└── turbo.json                # Turborepo configuration
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `apps/web/app/data/` | **Mock data files** (articles, podcasts, events, startups) - Will be replaced with Sanity CMS |
| `apps/web/app/components/` | Reusable React components (ArticleCard, Header, Footer, etc.) |
| `apps/web/app/*/page.tsx` | Next.js App Router pages (one per route) |
| `apps/web/app/lib/` | Utility functions and helpers (to be created for Sanity) |

---

## 🛠️ Tech Stack

### Core Technologies

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Infrastructure

- **Monorepo:** [Turborepo](https://turbo.build/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **CMS:** Sanity (planned - see [SANITY_MIGRATION_PLAN.md](SANITY_MIGRATION_PLAN.md))
- **Deployment:** Vercel (recommended)

### Data Architecture (Current)

**Status:** Using mock data from TypeScript files
**Future:** Migrating to Sanity CMS for content management

Current data sources:
- `apps/web/app/data/articles.ts` - News articles
- `apps/web/app/data/content.ts` - Podcasts and events
- `apps/web/app/data/startups.ts` - Startup directory

---

## 🧑‍💻 Development Workflow

### pnpm Workspace Commands

This project uses **pnpm workspaces**. You can run commands for specific apps using the `--filter` flag:

```bash
# Run dev server for web app (from root)
pnpm --filter web dev

# Build specific app
pnpm --filter web build

# Add dependency to specific app
pnpm add <package-name> --filter web

# Add dev dependency
pnpm add -D <package-name> --filter web
```

### Running the Dev Server

```bash
# Option 1: From root using pnpm workspace (recommended)
pnpm --filter web dev

# Option 2: Navigate to app directory
cd apps/web
pnpm run dev

# Option 3: Using Turborepo (runs all apps)
pnpm turbo dev
```

### Building for Production

```bash
# Build single app from root
pnpm --filter web build

# Or navigate to app directory
cd apps/web
pnpm run build

# Build all apps using Turborepo
pnpm turbo build
```

### Code Quality

```bash
# Linting (from root)
pnpm --filter web lint

# Type checking
pnpm --filter web type-check

# Format code
pnpm --filter web format

# Or from app directory
cd apps/web
pnpm run lint
pnpm run type-check
```

---

## 📄 Available Routes

| Route | Description | Data Source |
|-------|-------------|-------------|
| `/` | Homepage with hero grid | All data sources |
| `/latest` | Latest articles feed | `articles.ts` |
| `/stories` | All stories (filterable by category) | `articles.ts` |
| `/article/[slug]` | Individual article page | `articles.ts` |
| `/roundups` | Weekly roundup articles | `articles.ts` |
| `/podcasts` | Podcast episodes | `content.ts` |
| `/events` | Event listings with registration | `content.ts` |
| `/startups` | Startup directory (searchable) | `startups.ts` |
| `/startup/[slug]` | Startup profile page | `startups.ts` |
| `/signin` | Authentication page | None (placeholder) |
| `/subscribe` | Subscription plans | None (placeholder) |
| `/profile` | User profile | None (placeholder) |

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--navy-dark: #000137;      /* Primary dark, headings, text */
--brand-purple: #2f3192;   /* Brand color, buttons, links */
--light-gray: #f8f9fa;     /* Page background */

/* Accent Colors */
--amber: #fbbf24;          /* Premium badges */
--white: #ffffff;          /* Cards, backgrounds */
```

### Typography

- **Serif:** Spectral (headings, article titles)
- **Sans-serif:** Inter (body text, UI elements)

### Component Patterns

See [CODEBASE_GUIDE.md](CODEBASE_GUIDE.md) for detailed component documentation.

---

## 📚 Documentation

- **[CODEBASE_GUIDE.md](CODEBASE_GUIDE.md)** - Complete reference guide
  - Data architecture
  - Component hierarchy
  - Routes and dependencies
  - Coding patterns

- **[SANITY_MIGRATION_PLAN.md](SANITY_MIGRATION_PLAN.md)** - CMS integration plan
  - Sanity setup instructions
  - Schema design
  - Migration strategy
  - GROQ queries

---

## 🔄 Upcoming: Sanity CMS Integration

We're migrating from mock data to **Sanity CMS** for content management. See [SANITY_MIGRATION_PLAN.md](SANITY_MIGRATION_PLAN.md) for the complete migration plan.

**Migration Status:**
- [ ] Sanity project setup
- [ ] Schema design (Article, Podcast, Event, Startup)
- [ ] Data migration scripts
- [ ] Update components to use Sanity client
- [ ] Implement ISR (Incremental Static Regeneration)

---

## 🧪 Testing (Coming Soon)

```bash
# Unit tests
pnpm --filter web test

# E2E tests
pnpm --filter web test:e2e

# Test coverage
pnpm --filter web test:coverage
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Create `.env.local` in `apps/web/`:

```bash
# Sanity (when integrated)
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-token"

# Analytics (optional)
NEXT_PUBLIC_GA_ID="your-ga-id"
```

---

## 🤝 Contributing

### Branch Naming

```
feature/article-search
fix/header-navigation
refactor/data-layer
docs/api-documentation
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add article search functionality
fix: resolve mobile navigation bug
refactor: migrate to Sanity CMS
docs: update README with deployment guide
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and type checks
4. Commit with descriptive messages
5. Open PR with clear description
6. Request review from team members

---

## 📖 Useful Commands

### Package Management

```bash
# Install all dependencies (from root)
pnpm install

# Add dependency to specific app
pnpm add <package-name> --filter web

# Add dev dependency
pnpm add -D <package-name> --filter web

# Remove dependency
pnpm remove <package-name> --filter web

# Update dependencies
pnpm update --filter web
```

### Development

```bash
# Start dev server (from root)
pnpm --filter web dev

# Start dev server (from app directory)
cd apps/web && pnpm run dev

# Build for production
pnpm --filter web build

# Run production build
pnpm --filter web start
```

### Code Quality

```bash
# Run ESLint
pnpm --filter web lint

# TypeScript type checking
pnpm --filter web type-check

# Format code
pnpm --filter web format
```

### Turborepo Commands

```bash
# Build all apps
pnpm turbo build

# Dev all apps
pnpm turbo dev

# Build specific app
pnpm turbo build --filter=web

# Clear Turborepo cache
pnpm turbo clean
```

---

## 🔗 Resources

### Project Documentation
- [Codebase Guide](CODEBASE_GUIDE.md)
- [Sanity Migration Plan](SANITY_MIGRATION_PLAN.md)

### Technology Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Turborepo](https://turbo.build/docs)
- [Sanity](https://www.sanity.io/docs)

### Team Resources
- Design System: [Coming Soon]
- API Documentation: [Coming Soon]
- Deployment Guide: [Coming Soon]

---

## 👥 Team

For questions or support:
- **Technical Lead:** [Contact Info]
- **Product Owner:** [Contact Info]
- **Design:** [Contact Info]

---

## 📝 License

[Specify License]

---

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Core page layouts
- [x] Component library
- [x] Mock data integration
- [x] Responsive design
- [ ] Sanity CMS integration

### Phase 2: Content Management
- [ ] Sanity Studio setup
- [ ] Author management
- [ ] Content workflows
- [ ] Image optimization

### Phase 3: Features
- [ ] User authentication (Supabase/NextAuth)
- [ ] Subscription system
- [ ] Search functionality
- [ ] Newsletter integration
- [ ] Analytics dashboard

### Phase 4: Enhancement
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] PWA support
- [ ] Multi-language support

---

**Built with ❤️ in Tanzania**
