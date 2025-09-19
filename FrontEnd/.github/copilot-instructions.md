# Copilot Instructions for Collegegram FrontEnd

This guide enables AI coding agents to work productively in the Collegegram FrontEnd codebase. It summarizes architecture, workflows, and conventions unique to this project.

## 🏗️ Architecture Overview
- **React 19 + TypeScript** app, bootstrapped with Vite (`main.tsx` is entry).
- **Feature-based structure**: Each domain (auth, post, profile, etc.) lives in `src/features/<feature>/` with its own `components/`, `hooks/`, and `pages/`.
- **UI primitives**: Shared UI components are in `src/features/common/components/ui/` (shadcn/ui, Radix UI).
- **Global layouts**: Page templates in `src/layouts/`.
- **Assets**: Images and fonts in `src/assets/`.
- **Type definitions**: All types in `src/types/` (one file per domain).
- **Utilities**: Helper functions in `src/utils/` and `src/lib/`.

## ⚡ Developer Workflows
- **Install dependencies**: `pnpm install`
- **Start dev server**: `pnpm dev` (auto-reloads at `localhost:5173`)
- **Build for production**: `pnpm build`
- **Preview build**: `pnpm preview`
- **Lint**: `pnpm lint` (auto-fix: `pnpm lint:fix`)
- **Format**: `pnpm format`

## 🧩 Project-Specific Patterns
- **Component Variants**: Use `class-variance-authority` for styling variants (see `ui/` components).
- **Theme support**: Use `next-themes` for dark/light mode.
- **Validation**: Use `Yup` for form validation (see `auth/components/RegisterForm.tsx`).
- **API calls**: Use `src/lib/axios.ts` for HTTP requests.
- **Type safety**: Always import types from `src/types/`.
- **Conditional styling**: Use `clsx` and `tailwind-merge` for dynamic classes.

## 🔗 Integration Points
- **shadcn/ui**: Configured via `components.json`.
- **Tailwind CSS v4**: Configured via Vite plugin and `styles/`.
- **Radix UI**: Used for accessible primitives in UI components.
- **External assets**: Place in `src/assets/` and reference via import.

## 📝 Conventions
- **File naming**: Use PascalCase for components, camelCase for hooks.
- **Feature isolation**: Keep feature logic (hooks, components, pages) within its domain folder.
- **Type imports**: Always import from `src/types/` for cross-feature type safety.
- **No global state**: Prefer local state/hooks per feature; avoid global stores unless necessary.

## 🗂️ Key Files & Directories
- `src/features/` — Feature modules
- `src/features/common/components/ui/` — Shared UI primitives
- `src/lib/axios.ts` — API client
- `src/types/` — Type definitions
- `vite.config.ts`, `eslint.config.js`, `components.json` — Core configs

## 🛑 What NOT to do
- Do not introduce global state management unless required by multiple features.
- Do not bypass type safety; always use TypeScript types.
- Do not place feature code outside its domain folder.

---
For unclear conventions or missing patterns, ask for clarification or examples from the user.
