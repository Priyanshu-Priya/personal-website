# Personal Website

A modern, full-stack personal portfolio website built with **Next.js 16**, **Supabase**, and **Framer Motion**. Features a complete CMS dashboard for content management, dynamic pages, and beautiful animations.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)

---

## 🧩 Features

### 🏠 Home Page
- **Hero Section** — Animated intro with status badge, call-to-action buttons
- **Featured Projects** — Bento grid showcasing top projects
- **Tech Stack Marquee** — Infinite scrolling tech stack display
- **Latest Content** — Blog posts, thoughts feed snippets
- **Contact Form** — Integrated contact form section

### 📚 Library Section
- **Blog** — Long-form articles with MDX, syntax highlighting, math support
- **Thoughts** — Short, raw insights with mood tags (micro-blogging)
- **Resonance** — Curated influences with commentary and resonance scores

### 📂 Projects
- Showcase grid layout with featured project highlight
- Project detail pages with case study format
- Previous/Next project navigation
- Filter by "Working On" status
- Tech stack tags, GitHub/Live/Demo links

### 👤 About Page
- Background & education section
- Skills & technologies grid
- Current focus with dynamic CTA button
- Social links integration

### 🕐 Now Page
- Current focus areas
- Projects currently working on
- Learning journey updates
- Recent thoughts feed

### 📞 Contact
- Dedicated contact page with form
- Reusable contact form component (Home + Contact page)
- Email integration via Resend
- Location & availability status

### 🛠 Admin Dashboard
- **Page Editor** — Edit all page content via structured JSON
- **Projects** — Full CRUD with markdown editor, featured toggle
- **Blog Posts** — Draft/publish workflow, cover images, tags
- **Thoughts** — Quick add with mood selection
- **Resonance** — Manage curated resources with scores
- **Global Config** — Site settings, navigation, social links
- **Section Ordering** — Drag-and-drop section reordering

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Content** | Velite (MDX), react-markdown |
| **Email** | Resend |
| **UI Components** | Radix UI, Lucide Icons |

---

## 📁 Project Structure

```
├── app/
│   ├── (dashboard)/    # Admin CMS routes
│   ├── (public)/       # Public-facing pages
│   └── auth/           # Authentication routes
├── components/
│   ├── admin/          # Dashboard components
│   ├── home/           # Home page sections
│   ├── library/        # Blog, thoughts, resonance
│   ├── projects/       # Project cards, showcase
│   ├── shared/         # Reusable components (CTA, Social)
│   └── ui/             # Base UI components
├── db/
│   └── init_supabase.sql  # Complete database schema
├── lib/                # Utilities, Supabase client
├── types/              # TypeScript definitions
└── content/            # Static MDX content
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-website.git
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_key
   ```

4. **Initialize database**
   - Go to Supabase SQL Editor
   - Run the contents of `db/init_supabase.sql`

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:reset` | Reset database |

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `site_config` | Global site configuration (JSON) |
| `site_pages` | Page content (Home, About, etc.) |
| `projects` | Portfolio projects |
| `blog_posts` | Blog articles |
| `thoughts` | Micro-blog entries |
| `resonance` | Curated external resources |

All tables have Row Level Security (RLS) enabled.

---

## 🎨 Customization

### Content
Edit page content through the dashboard at `/dashboard` or directly modify the `site_pages` table in Supabase.

### Styling
- Global styles: `app/globals.css`
- Tailwind config: Inline in CSS with `@theme`
- Component styles: Tailwind classes

### Adding Pages
1. Create route in `app/(public)/your-page/`
2. Add page content type in `types/content.ts`
3. Add page slug to database
4. Create editor in dashboard if needed

---

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
