# Collegegram

A modern, feature-rich React + TypeScript application built with Vite and styled with Tailwind CSS v4. This project serves as a comprehensive social media platform for college communities.

## 🚀 Tech Stack

### Core Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite 7** - Fast build tool and dev server

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **next-themes** - Theme management
- **class-variance-authority** - Component variant management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

### Additional Libraries
- **Yup** - Schema validation
- **clsx & tailwind-merge** - Conditional styling utilities

## 📋 Prerequisites

- **Node.js**: 18 or newer
- **Package manager**: `pnpm` (recommended, lockfile present)
  - Alternative: `npm` or `yarn`

## 🛠️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collegegram
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload on file changes

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint on source files |
| `pnpm lint:fix` | Fix auto-fixable lint issues |
| `pnpm format` | Format code with Prettier |

## 📁 Project Structure

```
src/
├── app/                    # Application-specific components
├── assets/                 # Static assets (images, fonts, etc.)
├── features/               # Feature-based modules
│   └── common/
│       └── components/
│           └── ui/        # shadcn/ui components
├── layouts/                # Page layouts and templates
├── lib/                    # Utility libraries and configurations
├── styles/                 # Global styles and Tailwind config
├── types/                  # TypeScript type definitions
├── utils/                  # Helper functions and utilities
├── main.tsx               # Application entry point
└── vite-env.d.ts          # Vite environment types
```

## 🎨 Styling with Tailwind CSS v4

The project uses Tailwind CSS v4 configured via Vite plugin. Key features:

- **CSS Variables**: Theme-aware styling with CSS custom properties
- **Component Variants**: Using `class-variance-authority` for consistent component styling

### Example Usage
```tsx
import { Button } from "@/features/common/components/ui/button"

export function ExampleComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  )
}
```

## 🧩 UI Components

This project uses shadcn/ui components built on top of Radix UI primitives:

- **Accessible**: All components follow WAI-ARIA guidelines
- **Customizable**: Easy to customize with Tailwind classes
- **Type-safe**: Full TypeScript support
- **Themeable**: Dark/light mode support

### Available Components
- Buttons, Dialogs, Tabs
- Checkboxes, Labels, Separators
- And more via shadcn/ui

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules
- `components.json` - shadcn/ui configuration
- `tailwind.config.js` - Tailwind CSS configuration

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

### Linting
```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

### Formatting
```bash
# Format all source files
pnpm format
```


## 📄 License

Copyright (c) 2025 [Rahnema College]

---

**Built with ❤️ using modern web technologies**
