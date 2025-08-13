## Collegegram

A lightweight React + TypeScript app scaffolded with Vite and styled with Tailwind CSS v4.

### Tech stack
- **Framework**: React 19 + TypeScript
- **Build tool**: Vite 7
- **Styling**: Tailwind CSS 4 via `@tailwindcss/vite`
- **Code quality**: ESLint + Prettier

### Prerequisites
- **Node.js**: 18 or newer
- **Package manager**: `pnpm` recommended (lockfile present). You can use `npm`/`yarn` if you prefer.

### Quick start
```bash
pnpm install
pnpm dev
```
- Open the URL printed by Vite (default `http://localhost:5173`).

### Available scripts
- **dev**: `pnpm dev` — start the dev server with HMR
- **build**: `pnpm build` — type-check and build for production to `dist/`
- **preview**: `pnpm preview` — preview the production build locally
- **lint**: `pnpm lint` — run ESLint on `src`
- **lint:fix**: `pnpm lint:fix` — fix lint issues
- **format**: `pnpm format` — format source files with Prettier

### Project structure
```text
src/
  App.tsx            # Root app component
  main.tsx           # Entry; mounts React app
  styles/
    root.css         # Tailwind entry styles
  components/        # Reusable UI components
  pages/             # Route-level views (scaffold)
  layouts/           # Shared page layouts (scaffold)
  hooks/             # Custom React hooks (scaffold)
  utils/             # Utilities and helpers (scaffold)
  types/             # Shared TypeScript types (scaffold)
public/
  vite.svg           # Static asset example
```

### Styling (Tailwind CSS v4)
- Configured via Vite plugin in `vite.config.ts`.
- Base styles are imported in `src/styles/root.css`.
- Use Tailwind utility classes directly in JSX:
```tsx
export function Example() {
  return <button className="px-4 py-2 rounded bg-blue-600 text-white">Click</button>
}
```

### Build and preview
```bash
pnpm build
pnpm preview
```
- Deploy the generated `dist/` folder to any static host (e.g., Vercel, Netlify, GitHub Pages).

### Linting and formatting
```bash
pnpm lint
pnpm lint:fix
pnpm format
```

### Notes
- File and directory names mentioned above: `vite.config.ts`, `index.html`, `src/App.tsx`, `src/main.tsx`, `src/styles/root.css`.
- No environment variables are required for the current setup.

### License
Copyright (c) 2025 [Rahnema college]
