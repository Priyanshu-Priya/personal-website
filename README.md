# 📌 Personal Website – Digital Studio & Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=next.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)

A modern, full-stack **personal website and digital studio platform** built using **Next.js, Supabase, and modern UI/UX tooling**.
It serves as a dynamic portfolio, knowledge hub, writing platform, and content management system.

🌐 **Live Website:** [https://priyanshupriya.vercel.app/](https://priyanshupriya.vercel.app/)
📦 **Repository:** [https://github.com/Priyanshu-Priya/personal-website](https://github.com/Priyanshu-Priya/personal-website)

---

## 🧠 Project Vision

This project is designed as more than a portfolio — it is a **living digital ecosystem** that showcases work, thoughts, curated inspirations, and ongoing learning.

### Primary Objectives

• Present projects with detailed case studies
• Maintain a scalable personal knowledge & writing system
• Provide editorial-quality reading and browsing experience
• Build a reusable personal CMS architecture
• Maintain full content control without third-party CMS platforms

---

## ✨ Features

---

### 🏠 Public Platform

#### Home

* Animated hero section
* Featured projects bento grid
* Technology marquee animation
* Integrated contact section
* Smooth page transitions and motion design

#### Projects

* Case study driven portfolio
* Status tagging (Working On / Completed / Archived)
* Project galleries and tech stack highlights
* Featured project layout support

#### Library (Knowledge Hub)

##### 📝 Blog

* Long-form MDX articles
* Syntax highlighting
* Rich typography and structured content

##### 💭 Thoughts

* Micro-blogging style updates
* Mood tagging system
* Timeline-based feed

##### 📚 Resonance

* Curated books, articles, and tools
* Personal rating & insights system

#### 📍 Now Page

* Current learning focus
* Active projects
* Recent updates & experiments

#### 👤 About Page

* Skills visualization
* Personal background
* Dynamic social and contact links

#### 📩 Contact System

* Form available on:

  * Dedicated Contact Page
  * Home Page Contact Section
* Stores messages in database
* Sends real-time email notification

---

### 🛠 Admin CMS Dashboard

A custom-built internal CMS allowing full content control.

#### Core CMS Capabilities

* Global Page Content Editor (JSON Based)
* Full CRUD Project Management
* Draft / Publish workflow for content
* Blog & Thoughts content control
* Resonance resource manager
* Navigation & Footer configuration
* SEO content control
* Drag & Drop homepage section ordering

---

## 🧰 Tech Stack

### Framework & Language

* Next.js 15 (App Router + Server Components)
* TypeScript

### UI / Styling

* Tailwind CSS
* Shadcn/UI
* Radix UI
* Framer Motion
* Lucide Icons

### Backend & Infrastructure

* Supabase (PostgreSQL Database)
* Supabase Auth
* Supabase Storage

### Content System

* MDX Content Rendering
* Velite Content Layer

### Communication & Automation

* Resend Email API
* Server Actions / API Routes

### Deployment

* Vercel Hosting & CI/CD

---

## 📁 Project Structure

```
app/
 ├── (public)/        → Public website routes
 ├── (dashboard)/     → Protected Admin CMS
 ├── auth/            → Authentication routes

components/
 ├── admin/           → CMS Components
 ├── home/            → Landing sections
 ├── projects/        → Portfolio layouts
 ├── library/         → Blog / Thoughts / Resonance UI
 └── ui/              → Reusable Shadcn components

content/              → MDX Static Content
db/                   → Database initialization scripts
lib/                  → Utilities & Supabase clients
types/                → TypeScript type definitions
```

---

## 🗄 Database Schema

The platform uses **Supabase PostgreSQL** with **Row Level Security (RLS)**.

| Table         | Description                                        |
| ------------- | -------------------------------------------------- |
| `site_config` | Stores navigation, footer, SEO, and global content |
| `projects`    | Portfolio projects and metadata                    |
| `blog_posts`  | Long-form articles                                 |
| `thoughts`    | Micro blogging entries                             |
| `resonance`   | Curated external resources                         |
| `contacts`    | Contact form submissions                           |

---

## 🔐 Security

* Supabase Row Level Security (RLS)
* Admin-only content modification
* Protected dashboard routes
* Secure environment variable handling

---

## ⚙️ Getting Started

### Prerequisites

* Node.js 18+
* Supabase Account
* Resend Account

---

### 1️⃣ Clone Repository

```
git clone https://github.com/Priyanshu-Priya/personal-website.git
cd personal-website
```

---

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

---

### 4️⃣ Setup Database

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run:

```
db/init_supabase.sql
```

4. Create Admin User:

* Sign up via `/auth/signup`
* Disable public signup afterward

---

### 5️⃣ Run Development Server

```
npm run dev
```

Access:

• Website → [http://localhost:3000](http://localhost:3000)
• Dashboard → [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 🎨 Customization

### Styling

* Global CSS → `app/globals.css`
* Theme → Tailwind config / CSS variables

### Content Management

* Static content → `/content`
* Dynamic content → Admin Dashboard / Supabase

---

## 📈 Future Enhancements

* Analytics dashboard
* Newsletter system
* Content scheduling
* Multi-theme support
* Search & indexing
* Performance monitoring
* AI-assisted content tagging

---

## 👨‍💻 Author

Priyanshu Priya
Full Stack Developer | AI/ML Enginee | DrevOps Practitioner

📧 [priyanshupriyacodes@gmail.com](mailto:priyanshupriyacodes@gmail.com)
🌐 [https://priyanshupriya.vercel.app/](https://priyanshupriya.vercel.app/)
💻 [https://github.com/Priyanshu-Priya](https://github.com/Priyanshu-Priya)

---

## 📜 License

Distributed under the MIT License.

---

**Built with 💜 by Priyanshu Priya**
