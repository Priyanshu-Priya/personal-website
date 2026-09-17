# AGENTS.md — Personal Website (Priyanshu Priya)

> This file is for AI coding agents. Read it fully before making any changes to this codebase.

---

## Project Overview

A production-grade **personal portfolio website** for Priyanshu Priya — a full-stack developer. The site is content-managed: every user-facing string (labels, titles, button text, hrefs, etc.) lives in the **Supabase database**, not hardcoded in the frontend. The frontend reads from the DB and falls back to typed defaults only when the DB is unreachable.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · TailwindCSS v4 · Framer Motion · Supabase (Postgres + Auth + Storage) · Velite (MDX) · Resend (email) · Radix UI · shadcn/ui components

---

## ?? CRITICAL RULE: No Hardcoded Strings in the Frontend

**This is the single most important rule in this project.**

Any user-facing string that could ever need to change must come from the CMS (Supabase), NOT be hardcoded in a React component or TypeScript file.

This includes:
- Page titles, headings, subtitles
- Button labels and link text
- href / URL values
- Empty state messages
- Badge labels
- Placeholder text
- Status messages
- Section labels

### What to do instead

1. **Add the field to the JSONB content** in the appropriate `site_pages` row or `site_config` global row.
2. **Update the TypeScript interface** in `types/content.ts`.
3. **Update the default fallback** in `lib/content.ts`.
4. **Write a SQL migration** and add it to `supabase/migrations/`.
5. **Tell the user to run the SQL** in the Supabase dashboard SQL editor.

### Example: Adding a new label

Wrong:
```tsx
<p>No items yet. Check back soon.</p>
```

Right:
```tsx
<p>{content.empty_label}</p>
```
With a corresponding SQL `UPDATE site_pages SET content = jsonb_set(...)` and a TypeScript interface field `empty_label: string`.

---

## Architecture

### Route Groups

| Route group     | Path                                           | Auth required | Purpose                |
|-----------------|------------------------------------------------|---------------|------------------------|
| `(public)`      | `/` `/about` `/work/*` `/library/*` `/now` `/contact` | No  | Public-facing portfolio |
| `(dashboard)`   | `/dashboard/*`                                 | Yes           | Admin CMS              |
| `auth`          | `/auth/*`                                      | No            | Login/callback         |

### Key Directory Map

```
app/
  (public)/           <- Public pages (Server Components fetch + pass data down)
    page.tsx          <- Home page — main orchestrator, dynamic section ordering
    about/
    library/
      page.tsx        <- Library hub
      blog/           <- Blog list + detail
      thoughts/       <- Thoughts list (deep-link target: #item-{id})
      resonance/      <- Resonance list (deep-link target: #item-{id})
    now/
    work/projects/    <- Projects list + detail
    contact/
  (dashboard)/
    dashboard/        <- Admin overview ("Mission Control")
      blog/           <- CRUD blog posts
      projects/       <- CRUD projects
      thoughts/       <- CRUD thoughts
      resonance/      <- CRUD resonance
      pages/          <- CMS editor for site_pages content
      config/         <- CMS editor for site_config
      communication/  <- View Resend sent emails

components/
  home/               <- Home page section components (one file per section)
  library/            <- Library page list/detail components
  dashboard/          <- Admin UI components
  layout/             <- Navbar, Footer
  shared/             <- Reusable cross-page components
  ui/                 <- Base UI primitives (GlowCard, Button, etc.)
  sections/           <- Shared sections (ContactSection)

lib/
  content.ts          <- getPageContent(), getSiteConfig(), all default fallbacks
  supabase/
    server.ts         <- createClient() for Server Components + Server Actions
    client.ts         <- createClient() for Client Components
    middleware.ts     <- Auth session refresh middleware

types/
  content.ts          <- All TS interfaces: GlobalConfig, HomePageContent, etc.
  project.ts          <- Project-related types

actions/
  contact.ts          <- Server Action: contact form -> Resend email
  resend.ts           <- Resend helpers: getSentEmails()

supabase/migrations/  <- All SQL migrations (numbered YYYYMMDD_description.sql)

content/posts/        <- MDX blog posts (processed by Velite)
```

---

## Database Schema

### `site_pages` — Per-page CMS content
```sql
id          UUID  PRIMARY KEY
page_slug   TEXT  UNIQUE   -- 'home' | 'about' | 'library' | 'now' | 'projects' | 'contact'
content     JSONB          -- typed per-page content blob
updated_at  TIMESTAMPTZ
created_at  TIMESTAMPTZ
```
Fetch: `getPageContent<'home'>('home')` ? `HomePageContent | null`

### `site_config` — Global site configuration
```sql
id            UUID  PRIMARY KEY
config_key    TEXT  UNIQUE   -- only 'global' exists currently
config_value  JSONB          -- GlobalConfig blob
```
Contains: `site_name`, `site_tagline`, `contact_email`, `owner_name`, `owner_role`, `seo_keywords`, `resume_url`, `social_links[]`, `nav_items[]`, `footer`
Fetch: `getSiteConfig()` ? `GlobalConfig | null`

### `projects`
```sql
id, title, slug (UNIQUE), summary, content, thumbnail_url,
tech_stack TEXT[], project_type, status, role, display_date DATE,
github_url, live_url, demo_url, docs_url, linkedin_post_url,
is_featured BOOLEAN, is_published BOOLEAN, created_at, updated_at
```

### `blog_posts`
```sql
id, title, slug (UNIQUE), summary, content, cover_image,
tags TEXT[], is_published BOOLEAN, created_at, updated_at
```

### `thoughts`
```sql
id, content TEXT, mood TEXT, is_published BOOLEAN, created_at, updated_at
```
Deep-link: `/library/thoughts#item-{id}` ? `id="item-{id}"` on list page card

### `resonance`
```sql
id, title, type TEXT, url TEXT, commentary TEXT,
resonance_score INTEGER (1-5), created_at, updated_at
```
Type values: `'article' | 'book' | 'video' | 'podcast' | 'tweet'`
Deep-link: `/library/resonance#item-{id}` ? `id="item-{id}"` on list page card

---

## CMS Content System

### How content flows

```
Supabase (site_pages / site_config)
    ?  getPageContent() / getSiteConfig()   [lib/content.ts]
    ?  fallback: defaultXxxContent          [lib/content.ts]
    ?  passed as props to Server Components
    ?  consumed by Client Components via props
```

### Page slug ? TypeScript type mapping

| page_slug   | TypeScript interface   |
|-------------|------------------------|
| `home`      | `HomePageContent`      |
| `about`     | `AboutPageContent`     |
| `library`   | `LibraryPageContent`   |
| `now`       | `NowPageContent`       |
| `projects`  | `ProjectsPageContent`  |
| `contact`   | `ContactPageContent`   |

### Home page dynamic section ordering

Every section in `HomePageContent` has `enabled: boolean` and `order: number`.
The home page (`app/(public)/page.tsx`) sorts and filters sections at runtime —
section order and visibility are fully DB-controlled.

Current section keys: `hero`, `projects_section`, `blog_section`, `thoughts_section`,
`resonance_section`, `tech_stack_section`, `cta_section`, `contact_section`

---

## SQL Conventions

### Migration file naming
```
supabase/migrations/YYYYMMDD_short_description.sql
```

### Adding a new field to a page's JSONB content
```sql
UPDATE site_pages
SET content = jsonb_set(
    content,
    '{section_key,field_name}',
    '"default value here"'::jsonb
)
WHERE page_slug = '<page_slug>'
AND NOT (content->'section_key' ? 'field_name');
```

### Adding a new field to global config
```sql
UPDATE site_config
SET config_value = jsonb_set(
    config_value,
    '{field_name}',
    '"default value"'::jsonb
)
WHERE config_key = 'global'
AND NOT (config_value ? 'field_name');
```

### When SQL is required
Any time a new user-facing string is added:
1. Write the SQL migration
2. Add the file to `supabase/migrations/`
3. Tell the user: **"Run this SQL in your Supabase SQL Editor"**

---

## Component Conventions

### Server vs Client components
- **Server Components** (no `'use client'`): fetch from Supabase, pass data as props
- **Client Components** (`'use client'`): receive props, handle interactions + animations

### Animations
Use Framer Motion `whileInView` with `viewport={{ once: true }}` for entrance animations.
Never use `useEffect` + IntersectionObserver for animations.

### Styling & color palette
TailwindCSS v4. Color system per content type:
- **Projects / Hero:** `indigo`
- **Blog:** `pink`
- **Thoughts:** `purple` / `violet`
- **Resonance:** `amber`
- **Contact / Success:** `emerald`
- **Neutral base:** `slate-*`

### GlowCard
Primary card primitive: `<GlowCard glowColor="amber">`. Always use the accent color
matching the content type.

### Deep-link anchor pattern
Home section cards ? `<Link href="/library/<section>#item-{id}">` (full card clickable)
List page ? `id="item-{entry.id}"` on each card's outermost `motion.div`
On mount: `useEffect` reads `window.location.hash`, waits 600ms for animations to settle,
smooth-scrolls to element, applies temporary colored ring for 2 seconds.

---

## Auth & Admin Dashboard

- Auth: Supabase Auth (email/password), protected by Next.js middleware
- Dashboard lives at `/dashboard` — "Mission Control" with stats + recent activity
- Content CRUD at `/dashboard/projects/`, `/dashboard/blog/`, `/dashboard/thoughts/`, `/dashboard/resonance/`
- CMS page editor at `/dashboard/pages/` (edits `site_pages` JSONB)
- Global config editor at `/dashboard/config/` (edits `site_config` JSONB)
- Email log at `/dashboard/communication/`

---

## MDX / Velite (Blog)

- MDX posts: `content/posts/**/*.mdx`
- Processed by Velite at build time ? `.velite/`
- Config: `velite.config.ts`
- `npm run dev` = `velite && next dev` (Velite must run first)
- Supabase `blog_posts` table is the primary blog data source; MDX is a secondary path

---

## Email

- Contact form ? `actions/contact.ts` (Server Action) ? Resend API
- View sent emails in dashboard at `/dashboard/communication`
- Helper: `getSentEmails()` in `actions/resend.ts`

---

## Environment Variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
```

---

## Common Tasks Reference

### Add a new user-facing string to an existing section
1. Add field to interface in `types/content.ts`
2. Add default in `lib/content.ts`
3. Use `content.field_name` in component (never hardcode)
4. Write SQL migration ? `supabase/migrations/YYYYMMDD_description.sql`
5. Tell user to run the SQL

### Add a new home page section
1. Add key to `SectionKey` union in `app/(public)/page.tsx`
2. Add interface fields (with `enabled` + `order`) to `HomePageContent` in `types/content.ts`
3. Add defaults in `lib/content.ts`
4. Create component in `components/home/`
5. Register in `sections` array in `app/(public)/page.tsx`
6. Write SQL to insert section into `site_pages` for `page_slug = 'home'`
7. Tell user to run the SQL

### Add a new database table
1. Write migration SQL with `CREATE TABLE`, `ENABLE ROW LEVEL SECURITY`, and `CREATE POLICY`
2. Add to `supabase/migrations/`
3. Tell user to run the SQL

### Deep-link to a specific card from home
Pattern: `/library/<section>#item-<uuid>` — no new DB column needed, uses existing `id`

---

## Do Not Touch

- `.velite/` — auto-generated by Velite
- `.next/` — Next.js build output
- `node_modules/`
- `public/static/` — auto-generated Velite asset output

---

## Git Conventions

Commit prefix: `feat:` | `fix:` | `refactor:` | `chore:`
Production branch: `main`
Remote: `https://github.com/Priyanshu-Priya/personal-website.git`
