# 📌 Personal Website

A modern, full-stack **personal digital studio** built with Next.js and Supabase — designed to document work, ideas, and influences with clarity and depth. This isn’t just a portfolio: it’s a **living archive** of thoughts, writing, and projects that evolves over time.

🌐 Live Demo: [Click Here](https://priyanshupriya.vercel.app/)

---

## 🧠 Project Overview

This **Personal Website** is a professional, scalable platform that combines:
✔ Personal introduction  
✔ Projects showcase  
✔ Multi-type content (Blog, Thoughts, Resonance)  
✔ Contact form with database storage and email forwarding  
✔ Home section + separate Contact page  
✔ Clean, editorial UI/UX

It is focused on **clarity, intentional design, and long-term growth** rather than trendy effects. It serves multiple audiences:
- Recruiters
- Peers
- General visitors

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| Frontend | TypeScript, Tailwind CSS, Framer Motion |
| UI Components | shadcn/ui, Lucide Icons |
| Backend Services | Supabase (Auth, Database, Storage) |
| Email | Resend (or equivalent SMTP provider) |
| Deployment | Vercel |

---

## 🧩 Features

### 🏠 Home Page
- Intro Hero
- Featured Projects
- Latest Content Snippets
- Contact Form Section

### 📚 Library Section
- **Blog** — Long-form content (MDX)
- **Thoughts** — Short, raw insights
- **Resonance** — Curated influences with notes

### 📂 Projects
- Sorted by date
- Featured projects highlighted
- Deep project detail pages

### 📞 Contact
- Dedicated Contact page
- Reusable contact form (Home + Contact page)

### 🛠 Admin Dashboard *(future extension)*
- Add / Edit content
- Manage messages
- Draft & publish workflow

---


## 🛠 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Priyanshu-Priya/personal-website.git
cd personal-website
````

### 2. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### 3. Setup Environment Variables

Create a `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key

```

> These keys are used to connect the website to Supabase and send email notifications.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📩 Contact Form Behavior

When a user submits:

1. The message is saved in the **Supabase database**.
2. An email is sent to `priyanshupriyacodes@gmail.com`.

This dual workflow ensures:

* reliable storage
* prompt notification

---

## 🧠 Design Philosophy

* **Editorial UI**: Calm typography, generous spacing
* **Content-first experience**
* **Minimal distractions**
* **Professional but personable**

Every UI element should support reading, scanning, or reflection — not interrupt it.

---

## 📅 Roadmap

✔ Core pages (Home, Projects, Library)
✔ Contact form + DB + email
✔ Resonance system
✔ Thought + Blog sections
✔ Dashboard for content management


---

## 📫 Connect

**Email:** [priyanshupriyacodes@gmail.com](mailto:priyanshupriyacodes@gmail.com)

---

## 🧾 License

This project is open-source and available under the MIT License.


