# pls-reviewer — Agent Guidelines

## Stack

- **Framework**: Next.js 16 (App Router, `apps/web/`)
- **UI Components**: shadcn/ui via `@workspace/ui` (`packages/ui/`)
- **Styling**: Tailwind CSS v4
- **Package manager**: pnpm (workspace)
- **Build**: Turborepo

## Adding UI Components

Always use shadcn/ui for new UI. Never hand-write primitive components (buttons, inputs, dialogs, etc.).

```bash
# Add a new shadcn component to the shared package
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components are placed in `packages/ui/src/components/` and exported from `@workspace/ui`:

```tsx
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
```

## Component Rules

- **Shared/reusable** → `packages/ui/src/components/`
- **App-specific/page-level** → `apps/web/components/`
- Do not duplicate components — check `packages/ui/src/components/` before creating new ones
- All components must use `cn()` from `@workspace/ui/lib/utils` for class merging
- Follow the existing shadcn/ui component pattern (variants via `cva`, forwardRef, etc.)

## Styling

- Use Tailwind utility classes directly — no custom CSS unless absolutely necessary
- Use `tw-animate-css` for animations (already installed)
- Dark mode is handled by `next-themes` via `ThemeProvider` in `apps/web/components/theme-provider.tsx`

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add dialog component
fix: correct button hover state
chore: add shadcn card component
```

Enforced by commitlint + husky on every commit.

## Key Paths

| Path | Purpose |
|---|---|
| `packages/ui/src/components/` | Shared shadcn/ui components |
| `packages/ui/src/lib/utils.ts` | `cn()` utility |
| `packages/ui/src/styles/globals.css` | Global styles + CSS variables |
| `apps/web/app/` | Next.js App Router pages and layouts |
| `apps/web/components/` | App-specific components |
