# Task Manager — Next.js 15 + tRPC

Simple, functional in-memory task management application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **tRPC v11**, and **Zod**.

## Features

### Core Requirements
- **In-Memory tRPC Backend** (`/api/trpc/[trpc]`):
  - **Model (`Task`):** `id` (auto-generated UUID), `title` (required string), `description` (optional string), and `createdAt` (Unix timestamp in ms).
  - `task.list`: paginated query ordered from newest to oldest.
  - `task.getById`: fetches a single task and throws `NOT_FOUND` if the ID does not exist.
  - `task.create`: validates input with Zod (rejects empty titles with `BAD_REQUEST`) and inserts a new task in memory.
  - `task.update`: updates an existing task, throwing `NOT_FOUND` if missing or `BAD_REQUEST` if invalid.
  - `task.delete`: removes a task from memory, throwing `NOT_FOUND` if missing.
- **Next.js 15 + React Frontend**:
  - **Task List (`/`):** preloaded via **Server-Side Rendering (SSR)** using `force-dynamic` and a server-side tRPC caller.
  - **Inline Deletion:** delete tasks directly from the list with per-item loading state and accessible success/error feedback.
  - **Create (`/tasks/new`) & Edit (`/tasks/[id]/edit`):** reusable functional form component (`TaskForm`) powered by React hooks, client-side validation, focus management on errors, and backend error handling (including non-existent task IDs).

### Bonus Features
- **Infinite Scroll:** `useInfiniteQuery` hydrated with the SSR-preloaded first page + `IntersectionObserver` to incrementally load additional pages on scroll (with an accessible fallback button).
- **Documentation & Unit Tests:** concise inline comments explaining key architectural decisions, this `README.md`, and a zero-dependency backend test suite using Node's built-in `node:test`.

## Key Technical Decisions

1. **Direct SSR without internal HTTP round-trips:** `src/app/page.tsx` uses `export const dynamic = "force-dynamic"` together with `createServerCaller` to fetch the first page directly on the server on every request.
2. **HMR-safe in-memory storage:** `src/server/store/taskStore.ts` stores the task array on `globalThis` so Next.js Hot Module Replacement does not wipe data during development. The store starts with 25 purely fictitious sample tasks so SSR and Infinite Scroll can be verified immediately.
3. **End-to-end type safety without codegen:** the `AppRouter` type exported by the server is consumed directly by the React tRPC client (`src/trpc/client.ts`), catching contract mismatches at compile time.
4. **Centralized UI & API copy (`src/i18n/en.ts`):** all labels, validation rules, and error messages live in a single zero-dependency dictionary.

## Getting Started

Prerequisites: **Node.js 20+** and **npm**.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Useful Scripts

```bash
# Run tRPC backend unit tests (built-in node:test, zero extra dependencies)
npm test

# Type-check with TypeScript
npm run typecheck

# Create a production build
npm run build

# Start the production server after building
npm run start
```

## Data Notice

All data in this repository is **purely fictitious**. No personal information, credentials, or API keys are included or committed.
