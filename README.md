# 🧠 Hindsight (CodeMind)

> **Code. Fail. Learn. Repeat — But Smarter.**

Hindsight is an **AI-powered coding mentor** that helps developers level up by learning from their own mistakes. Unlike generic coding platforms, Hindsight builds a persistent memory of every error you make, detects recurring patterns in your thinking, and dynamically generates a personalized learning path — so every practice session is targeted and efficient.

---

## 📖 Table of Contents

1. [What is Hindsight?](#-what-is-hindsight)
2. [How It Works](#-how-it-works)
3. [Features](#-features)
4. [Application Pages](#-application-pages)
5. [Architecture](#-architecture)
6. [Project Structure](#-project-structure)
7. [Technology Stack](#-technology-stack)
8. [Getting Started](#-getting-started)
9. [Scripts](#-scripts)
10. [Contributing](#-contributing)

---

## 💡 What is Hindsight?

Most coding platforms tell you *if* you got an answer right or wrong. Hindsight goes further — it tells you **why** you keep getting it wrong.

The platform has three core ideas:

1. **Memory**: Every submission, every mistake, and every breakthrough is stored and remembered.
2. **Pattern Recognition**: The AI analyzes your history to identify recurring error types (e.g., off-by-one errors, null pointer mistakes, inefficient algorithms).
3. **Adaptive Learning**: Based on your identified weak spots, the platform generates a prioritized problem queue and learning path tailored specifically to you.

The result is a feedback loop where the more you practice, the smarter your learning plan becomes.

---

## ⚙️ How It Works

```
User solves a problem
        │
        ▼
   Code submitted
        │
        ▼
Verdict generated (Accepted / Wrong Answer / TLE / etc.)
        │
        ▼
Mistake stored in Hindsight Memory (if incorrect)
        │
        ▼
AI analyzes all stored mistakes → detects patterns
        │
        ▼
Dashboard & Learning Path updated with new insights
        │
        ▼
AI recommends next problems to tackle weak areas
```

All of this happens in real time. The AI Coach is also available inline while you solve problems, offering hints and tips without giving away the answer.

---

## ✨ Features

### 🧠 Hindsight Memory
A persistent store of every mistake you've made, tagged by problem type, error category, and frequency. This is the foundation that powers all AI recommendations.

### 🔍 Pattern Detection
Automatically categorizes mistakes into patterns (e.g., *"Off-by-one errors in array traversal"*, *"Forgetting edge cases for empty input"*). Each pattern is scored by severity and trend direction (improving / worsening).

### 🗺️ Personalized Learning Paths
An AI-generated, visual graph of problem nodes ordered and connected based on your weaknesses. Completed nodes unlock the next set of recommended problems. The path updates as you progress.

### 📊 Interactive Dashboard
- **Streak & XP tracking** — Gamified progress system
- **Accuracy metrics** — % of correct first attempts
- **AI Insights panel** — Actionable tips based on your mistake history
- **Recommended problems** — AI-prioritized problems targeting your weakest areas
- **Submission history** — Timeline of all past attempts

### ✍️ Code Editor (Monaco)
A full-featured in-browser code editor (the same engine as VS Code) with:
- Syntax highlighting for multiple languages
- Test case runner
- Submit button with real-time verdict feedback
- Inline AI Coach chat panel

### 📈 Progress Analytics
Charts and graphs showing your improvement over time:
- Problems solved per day/week
- Accuracy trend
- Language proficiency breakdown
- Mistake frequency over time

### 🌗 Dark / Light Mode
Full dark and light theme support with instant switching, using CSS variables and Next Themes.

---

## 📄 Application Pages

| Route | Description |
|-------|-------------|
| `/` | **Landing page** — Hero section, feature highlights, stats, and call-to-action |
| `/auth` | **Authentication** — Login / sign-up page |
| `/dashboard` | **Main dashboard** — Streak, XP, AI insights, recommended problems, recent submissions |
| `/problems` | **Problem catalog** — Browse all problems with filters for difficulty, tags, and AI priority |
| `/problems/[id]` | **Problem detail** — Description, Monaco code editor, test runner, AI Coach chat |
| `/progress` | **Progress tracker** — Charts and analytics for your coding journey |
| `/learning-path` | **Learning path** — Visual graph of your AI-generated personalized path |

---

## 🏗️ Architecture

The application is a **Next.js App Router** project. Here is a high-level map of how the key modules interact:

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │  Auth       │    │  Theme      │    │  React      │ │
│  │  Context    │    │  Context    │    │  Query      │ │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘ │
│         │                 │                  │         │
│         └─────────────────┴──────────────────┘         │
│                           │                            │
│              ┌────────────▼────────────┐               │
│              │    Page Components      │               │
│              │  (dashboard, problems,  │               │
│              │   progress, learning)   │               │
│              └────────────┬────────────┘               │
│                           │                            │
│         ┌─────────────────┴─────────────────┐          │
│         │                                   │          │
│  ┌──────▼──────┐                   ┌────────▼──────┐   │
│  │  api-client │                   │  hindsight.ts │   │
│  │  (problems, │                   │  (memory,     │   │
│  │   submit,   │                   │   patterns,   │   │
│  │   run code) │                   │   insights)   │   │
│  └─────────────┘                   └───────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Core Modules

#### `src/lib/hindsight.ts` — The Memory Engine
This is the heart of the platform. It exposes functions to:
- `storeMistake()` — Persist a coding mistake with metadata
- `getMistakePatterns()` — Retrieve detected patterns from mistake history
- `getPersonalizedInsights()` — Fetch AI-generated improvement tips
- `getRecommendedProblems()` — Get a prioritized problem list targeting weak areas
- `getCoachContext()` — Provide AI coach with problem-specific context
- `storeSession()` — Save a summary of a coding session

> **Note**: Currently uses mock data with simulated delays. Intended to be replaced with a real Hindsight SDK backend.

#### `src/lib/api-client.ts` — The API Layer
All data fetching goes through this module:
- `getProblems()` / `getProblem(id)` — Problem catalog
- `submitCode()` — Submit a solution and get a verdict
- `runCode()` — Run code against sample test cases
- `sendCoachMessage()` — Send a message to the AI coach
- `getMistakePatterns()` / `getPersonalizedInsights()` — Proxied to hindsight.ts

#### `src/lib/types.ts` — Shared TypeScript Types
Defines all shared interfaces used across the app:
- `Problem` — id, title, difficulty, tags, description, examples, starter code
- `UserProfile` — streak, XP, level, language proficiency, solve count
- `MistakePattern` — name, frequency, trend, severity, related problems
- `Submission` — verdict, runtime, memory, language, code
- `LearningPathNode` — position, status, connections
- `Insight` — AI-generated recommendation with severity and action

#### `src/context/AuthContext.tsx` — Authentication
Simple auth context using localStorage. Provides `useAuth()` hook for:
- Current user data
- Login / logout methods

#### `src/context/ThemeContext.tsx` — Theming
Dark/light mode toggle powered by Next Themes. Accessible via `useTheme()` hook throughout the app.

---

## 📂 Project Structure

```
hindsight_hackathon/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles & CSS variables
│   │   ├── auth/
│   │   │   └── page.tsx              # Auth / login page
│   │   └── (dashboard)/              # Protected route group
│   │       ├── layout.tsx            # Dashboard layout (sidebar + navbar)
│   │       ├── dashboard/page.tsx    # Main dashboard
│   │       ├── problems/page.tsx     # Problem catalog
│   │       ├── problems/[id]/page.tsx # Problem detail + code editor
│   │       ├── progress/page.tsx     # Analytics & progress
│   │       └── learning-path/page.tsx # AI learning path graph
│   │
│   ├── components/
│   │   ├── ui/                       # 40+ Shadcn/Radix UI primitives
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Top navigation bar
│   │   │   ├── Sidebar.tsx           # Left navigation sidebar
│   │   │   └── DashboardLayout.tsx   # Route protection + layout wrapper
│   │   └── providers/
│   │       └── ClientProviders.tsx   # React Query, Auth, Theme providers
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts                # Auth state
│   │   ├── useTheme.ts               # Theme state
│   │   ├── useAICoach.ts             # AI coach data fetching
│   │   ├── useMistakePatterns.ts     # Mistake pattern queries
│   │   └── useProblems.ts            # Problem list queries
│   │
│   ├── context/                      # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── lib/                          # Core utilities
│   │   ├── types.ts                  # All TypeScript interfaces
│   │   ├── hindsight.ts              # Hindsight memory/AI client
│   │   ├── api-client.ts             # Data fetching functions
│   │   ├── mock-data.ts              # Development mock data
│   │   └── utils.ts                  # Helper utilities
│   │
│   └── test/                         # Playwright E2E tests
│       ├── example.test.ts
│       └── setup.ts
│
├── public/                           # Static assets
├── middleware.ts                     # Next.js route middleware
├── package.json
├── tsconfig.json                     # TypeScript config (@ alias → src/)
├── tailwind.config.ts                # Custom design tokens & theme
├── next.config.ts                    # Next.js configuration
├── playwright.config.ts              # E2E test configuration
└── eslint.config.mjs                 # Linting rules
```

---

## 🛠️ Technology Stack

| Category | Technology | Role |
|----------|------------|------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Full-stack React framework, routing, SSR |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type safety across the entire codebase |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS with custom design tokens |
| **Animations** | [Framer Motion 11](https://www.framer.com/motion/) | Page transitions, hover effects, animated components |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [Shadcn UI](https://ui.shadcn.com/) | Accessible, unstyled component primitives + styled wrappers |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent icon set throughout the UI |
| **State / Data** | [TanStack Query 5](https://tanstack.com/query/latest) | Server state management, caching, background refetching |
| **Forms** | [React Hook Form 7](https://react-hook-form.com/) | Performant form handling and validation |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) | VS Code-grade in-browser code editor |
| **Charts** | [Recharts 2](https://recharts.org/) | Progress analytics and data visualizations |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| **Theme** | [Next Themes](https://github.com/pacocoursey/next-themes) | Dark/light mode management |
| **Testing** | [Playwright 1.58](https://playwright.dev/) | End-to-end browser tests |
| **Linting** | [ESLint 9](https://eslint.org/) | Code quality enforcement |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+**
- **npm** (or yarn / pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GauravKesh/hindsight_hackathon.git
   cd hindsight_hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

> On first load you will see the landing page. Click **Get Started** or navigate to `/auth` to log in. A mock user is provided for development purposes.

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start Next.js dev server with hot reload |
| Build | `npm run build` | Production build (outputs to `.next/`) |
| Start | `npm start` | Serve the production build |
| Lint | `npm run lint` | Run ESLint across all source files |
| Test (E2E) | `npx playwright test` | Run Playwright end-to-end tests |

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contribution workflow including branch naming conventions, commit message prefixes, and PR guidelines.

**Quick summary:**
- Branch naming: use your GitHub username as the branch name
- Commit prefixes: `feat:`, `fix:`, `doc:`
- Always sync with `main` before pushing
- Never push directly to `main`

---

## 🧹 Post-Migration Note

This project was migrated from **Vite** to **Next.js**. Some legacy configuration files (`vite.config.ts`, `tsconfig.app.json`) may still be present for environment-level compatibility. They can be safely ignored or removed in a future cleanup.
