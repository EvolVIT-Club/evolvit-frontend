<h1 align="center">
  <br />
  🚀 EvolVIT Frontend
  <br />
</h1>

<h4 align="center">The official website of <strong>EvolVIT</strong> — a student-driven tech community at VIT bridging the gap between students and the tech industry.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer" />
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-pages--features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment</a>
</p>

---

## 📖 Overview

EvolVIT is a **community to bridge the gap between students and the tech industry** The frontend is built with the latest **Next.js App Router**, delivering a blazing-fast, SEO-optimised, server-rendered experience for visitors — and a secure admin dashboard for club management.

**Key highlights:**

- ⚡ Server-side rendering (SSR) & static generation (SSG) via Next.js App Router
- 🎨 Dark/Light theme with persistent user preference
- 🔐 JWT-based admin authentication with protected routes
- 📱 Fully responsive across all screen sizes
- ✨ Smooth micro-animations powered by Framer Motion
- 🔗 Decoupled from the backend via a RESTful API

---

## 🛠 Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org/) | 16.2.4 |
| **UI Library** | [React](https://react.dev/) | 19.2.4 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | 12.x |
| **HTTP Client** | [Axios](https://axios-http.com/) | 1.x |
| **Fonts** | [Google Fonts — Inter](https://fonts.google.com/specimen/Inter) | via `next/font` |
| **Linting** | [ESLint](https://eslint.org/) | 9.x |
| **Package Manager** | npm | — |

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT                             │
│                                                                     │
│   ┌────────────────────────────────────────────────────────────┐    │
│   │              Next.js App Router (SSR + CSR)                │    │
│   │                                                            │    │
│   │   Public Pages          │   Admin Panel                    │    │
│   │   ─────────────────     │   ───────────────────            │    │
│   │   /           (Home)    │   /admin/login                   │    │
│   │   /about               │   /admin/dashboard               │    │
│   │   /events              │   /admin/events                  │    │
│   │   /projects            │   /admin/members                 │    │
│   │   /team                │   /admin/projects                │    │
│   │   /contact             │   /admin/testimonials            │    │
│   │                        │   /admin/settings                │    │
│   └────────────────────────────────────────────────────────────┘    │
│                                   │                                  │
│   ┌───────────────────────────────▼────────────────────────────┐    │
│   │                   Component Layer                          │    │
│   │                                                            │    │
│   │  Shared UI          Sections              Utilities        │    │
│   │  ──────────         ────────────          ──────────       │    │
│   │  Navbar             Hero                  ThemeProvider    │    │
│   │  Footer             Stats                 Preloader        │    │
│   │  EventModal         EventsPreview         axios.js (API)   │    │
│   │                     ProjectsPreview                        │    │
│   │                     Testimonials                           │    │
│   │                     About / Contact / Team                 │    │
│   └────────────────────────────────────────────────────────────┘    │
│                                   │                                  │
└───────────────────────────────────┼──────────────────────────────────┘
                                    │  REST API (Axios + JWT Bearer)
                                    │
┌───────────────────────────────────▼──────────────────────────────────┐
│                    EvolVIT Backend (Node.js / Express)                │
│                                                                       │
│   /api/members   /api/events   /api/projects                         │
│   /api/testimonials   /api/contact   /api/settings                   │
│                                                                       │
│                   MongoDB (via Mongoose)                              │
└───────────────────────────────────────────────────────────────────────┘
```

### Architecture Decisions

| Decision | Rationale |
|---|---|
| **Next.js App Router** | Enables granular SSR/SSG per page, nested layouts, and built-in route protection |
| **CSS Modules + Tailwind** | Scoped, collision-free styles for components combined with Tailwind utility classes |
| **Axios Interceptor** | Centralised JWT injection so no page needs to manually attach auth headers |
| **Context API for Theme** | Lightweight dark/light toggle — no third-party state library overhead |
| **Framer Motion** | Declarative animation API that integrates natively with React lifecycle |
| **`next/font`** | Zero-layout-shift font loading with the Inter variable font |

---

## 📁 Project Structure

```
evolvit-frontend/
├── app/                        # Next.js App Router root
│   ├── layout.tsx              # Root layout (font, metadata, ThemeProvider, Preloader)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global CSS variables & base styles
│   ├── about/                  # /about route
│   ├── contact/                # /contact route
│   ├── events/                 # /events route
│   ├── projects/               # /projects route
│   ├── team/                   # /team route
│   └── admin/                  # Protected admin routes
│       ├── login/              # JWT login page
│       ├── dashboard/          # Admin home with module cards
│       ├── events/             # CRUD – Events
│       ├── members/            # CRUD – Members (team & faculty)
│       ├── projects/           # CRUD – Projects
│       ├── testimonials/       # CRUD – Testimonials
│       └── settings/           # Site settings
│
├── components/                 # Reusable UI components
│   ├── Navbar.tsx              # Responsive navigation bar
│   ├── Navbar.module.css
│   ├── Footer.tsx              # Site-wide footer
│   ├── Footer.module.css
│   ├── Preloader.tsx           # Animated page preloader
│   ├── Preloader.module.css
│   ├── ThemeProvider.tsx       # Dark/Light theme context
│   ├── EventModal.tsx          # Reusable event detail modal
│   ├── EventModal.module.css
│   └── sections/               # Full-width page sections
│       ├── Hero.tsx / .css     # Landing hero section
│       ├── Stats.tsx / .css    # Club statistics counters
│       ├── EventsPreview.tsx   # Homepage events spotlight
│       ├── Events.tsx / .css   # Full events listing page
│       ├── ProjectsPreview.tsx # Homepage projects spotlight
│       ├── Projects.tsx / .css # Full projects listing page
│       ├── Team.tsx / .css     # Team & faculty grid
│       ├── About.tsx / .css    # About section
│       ├── Contact.tsx / .css  # Contact form section
│       ├── Testimonials.tsx    # Member testimonials carousel
│       └── Initiatives.tsx     # Club initiatives section
│
├── utils/
│   └── axios.js                # Axios instance with JWT interceptor
│
├── public/                     # Static assets (images, icons)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript compiler options
├── postcss.config.mjs          # PostCSS + Tailwind pipeline
└── package.json
```

---

## 🖥 Pages & Features

### Public Pages

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Hero, Events preview, Projects preview, Stats, Testimonials |
| `/about` | **About** | Club mission, initiatives, and vision |
| `/events` | **Events** | Filterable events list with modal detail view |
| `/projects` | **Projects** | Showcase of club-built projects |
| `/team` | **Team** | Grid of team members and faculty advisors |
| `/contact` | **Contact** | Contact form with API integration |

### Admin Panel (`/admin/*`)

> Protected by JWT cookie. All requests carry a `Bearer` token via the Axios interceptor.

| Route | Feature |
|---|---|
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Overview cards + Contact submissions inbox |
| `/admin/events` | Create, edit, delete events |
| `/admin/members` | Manage team & faculty; upload member photos |
| `/admin/projects` | Create, edit, delete projects |
| `/admin/testimonials` | Manage testimonials |
| `/admin/settings` | Site-wide settings |

---

## 🔄 Data Flow & Workflow

```
User visits page
      │
      ▼
Next.js Server renders page (SSR)
      │
      ▼
React hydrates on client
      │
      ├─── Public page ──▶ Axios GET /api/* ──▶ Display data
      │
      └─── Admin page  ──▶ Check JWT cookie
                               │
                         Valid ─▶ Load dashboard
                         Invalid ─▶ Redirect to /admin/login
                                          │
                                    Login form ─▶ POST /api/auth
                                                    │
                                              Store JWT in
                                              localStorage +
                                              cookie
```

### API Communication Pattern

All API calls go through `utils/axios.js` — a pre-configured Axios instance:

```js
// Automatically attaches JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

The base URL is read from `NEXT_PUBLIC_API_URL`, falling back to `http://localhost:5001/api` in development.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A running instance of the **EvolVIT Backend** (default: `http://localhost:5001`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/EvolVIT-Club/evolvit-frontend.git
cd evolvit-frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# Then fill in the required values (see below)

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

> **Note:** All client-exposed variables must be prefixed with `NEXT_PUBLIC_`.

---

## 🎨 Design System

- **Font:** Inter (variable font via `next/font/google`) — zero layout shift
- **Theme:** Dark-first with full light mode support via `data-theme` attribute on `<html>`
- **Animations:** Framer Motion — scroll-triggered reveals, page transitions, and micro-interactions
- **Color palette:** Semantic CSS variables in `globals.css` for consistent theming across both modes
- **Styling approach:** CSS Modules per component + Tailwind utility classes for layout

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add xyz"`
4. Push and open a Pull Request

Please run `npm run lint` before submitting your PR.

---

## 📄 License

This project is maintained by **EvolVIT Club, VIT**. All rights reserved.

---

<p align="center">Built with ❤️ by the EvolVIT Tech team</p>
