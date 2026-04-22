# Vertex

**Team management, reimagined.**

Workspaces, projects, tasks, real-time team chat, and smart notifications — in one fast, clean app.

[Live demo](https://vertex-team.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## Overview

Vertex is a modern team collaboration platform that brings workspaces, projects, tasks, real-time chat, and an invitation-based notification system into a single cohesive experience. Built on the App Router, React 19, and Firestore's real-time listeners, it's designed to feel instant and stay clean — no clutter, no noise.

## Features

- **Workspaces & projects** — Organize work by workspace, create multiple projects per workspace, manage members with role-based permissions (admin / member).
- **Task management** — Create, assign, prioritize, and track tasks with status flows (To do / In progress / Done), due dates, and per-task routing.
- **Real-time team chat** — Per-workspace messaging with day dividers, author grouping, inline edit with full edit history, author-only edits, admin-or-author delete, and `IntersectionObserver`-driven seen receipts.
- **Invitation-based membership** — Members are never silently added. Invites land in the notifications inbox and require accept/decline.
- **Smart notifications** — Real-time bell with unread count, tabbed inbox (All / Unread / Invitations), and "Mark all read."
- **Profile** — Avatar, bio, per-user stats, and an "own tasks" feed.
- **Settings** — Four tabs (Account, Appearance, Notifications, Security) with live theme switching, email preferences, and password reset.
- **Light / dark mode** — Powered by `next-themes` with a polished system-aware toggle.
- **Built-in SEO** — Metadata API, dynamic `opengraph-image`, `sitemap.xml`, `robots.txt`, and a PWA-ready `manifest`.

## Tech stack

| Area | Stack |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4, shadcn/ui, Radix primitives, `tw-animate-css` |
| State & animation | Zustand, Framer Motion |
| Backend | Firebase Auth + Cloud Firestore (real-time) |
| Media | Cloudinary |
| Icons | Lucide |
| Language | JavaScript (ESM) |

## Getting started

### Prerequisites

- Node.js 20+
- A Firebase project (Authentication + Firestore enabled)
- (Optional) A Cloudinary account for avatar uploads

### 1. Clone and install

```bash
git clone https://github.com/mohamedayman/vertex.git
cd vertex
npm install
```

### 2. Environment variables

Create a `.env.local` at the project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

### 3. Run

```bash
npm run dev
```

Open [https://vertex-team.vercel.app](https://vertex-team.vercel.app).

## Project structure

```
app/
  layout.js                  # Root metadata, fonts, theme
  icon.js / apple-icon.js    # Dynamic branded icons (next/og)
  opengraph-image.js         # Dynamic OG card
  robots.js / sitemap.js     # SEO crawlers
  manifest.js                # PWA manifest
  loading.js / error.js      # Global UX fallbacks
  not-found.js               # Custom 404
  workspaces/[workspaceSlug]/
    chat/                    # Team chat route
    [projectId]/[taskId]/    # Task detail
  profile/ settings/ notifications/
components/
  messages/                  # Chat primitives (list, item, composer, history, seen)
  notifications/             # Bell, item, invite actions
  profile/ settings/ dashboard/ ui/
hooks/
  useAuth, useNotifications, useWorkspaceMessages, useDashboardData
lib/
  firebase, notifications, messages
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |

## Deploy

One-click deploy on **Vercel** — set the environment variables from step 2 and you're live. The project is configured with `optimizePackageImports`, AVIF/WebP images, and security headers out of the box.

## Roadmap

- Firestore security rules for `notifications`, `invitations`, and `messages` subcollections
- Typing indicators and `@mentions`
- Per-task comments thread
- Email delivery for notification preferences

## License

MIT © [Mohamed Ayman](https://github.com/mohdragon010)

