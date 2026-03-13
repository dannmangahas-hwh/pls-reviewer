# pls-reviewer

A Turborepo monorepo built with Next.js, shadcn/ui, and TypeScript.

## Structure

```
pls-reviewer/
├── apps/
│   └── web/          # Next.js 16 app
├── packages/
│   ├── ui/           # Shared component library (shadcn/ui)
│   ├── eslint-config/ # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm test` | Run tests across all packages |

## Adding UI Components

Run this from the root to add a shadcn/ui component:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are placed in `packages/ui/src/components/` and shared across apps.

## Using Components

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Branching

| Branch | Purpose |
|---|---|
| `main` | Production-ready code, protected |
| `dev` | Integration branch, merged into `main` via PR |
| `feat/<name>` | New features — branch off `dev` |
| `fix/<name>` | Bug fixes — branch off `dev` |
| `chore/<name>` | Maintenance tasks — branch off `dev` |
| `hotfix/<name>` | Critical fixes — branch off `main`, merge back to both `main` and `dev` |

**Workflow:**
```
feat/my-feature → dev → main
```
1. Branch off `dev`: `git checkout -b feat/my-feature dev`
2. Open a PR into `dev`
3. After testing, merge `dev` → `main` via PR

## Commit Convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint + husky.

```
feat: add new feature
fix: fix a bug
chore: update dependencies
docs: update documentation
refactor: refactor code
```

## Tech Stack

- [Turborepo](https://turbo.build/) — monorepo build system
- [Next.js 16](https://nextjs.org/) — React framework
- [shadcn/ui](https://ui.shadcn.com/) — component library
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [pnpm](https://pnpm.io/) — package manager
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) — linting and formatting
- [Husky](https://typicode.github.io/husky/) + [commitlint](https://commitlint.js.org/) — git hooks
