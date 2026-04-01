# GEMINI.md - pls-reviewer context

This project is a modern Next.js 16 and React 19 monorepo managed with Turborepo and pnpm. It follows a centralized component architecture using shadcn/ui and Tailwind CSS v4.

## Project Overview
- **Architecture**: Turborepo monorepo with `apps/` and `packages/`.
- **Primary Tech Stack**:
    - **Framework**: Next.js 16 (App Router), React 19.
    - **Styling**: Tailwind CSS v4.
    - **UI Library**: shadcn/ui (centralized in `packages/ui`).
    - **Language**: TypeScript (shared configuration).
    - **Package Manager**: pnpm.
    - **Build System**: Turborepo.

## Workspace Structure
- `apps/web`: The main Next.js 16 application.
- `packages/ui`: Shared component library (`@workspace/ui`). Contains components, hooks, and global styles.
- `packages/eslint-config`: Shared ESLint configurations.
- `packages/typescript-config`: Shared TypeScript configurations.

## Building and Running
All commands should be run from the root directory using `pnpm`.

- **Install**: `pnpm install`
- **Development**: `pnpm dev` (Runs all applications in development mode with Turbopack)
- **Build**: `pnpm build` (Builds all workspace projects)
- **Lint**: `pnpm lint` (Lints all packages)
- **Format**: `pnpm format` (Formats code with Prettier)
- **Type-check**: `pnpm typecheck` (Performs workspace-wide TypeScript validation)
- **Test**: `pnpm test` (Runs tests across the workspace)

## Development Conventions

### Component Usage
- **New Components**: Always use shadcn/ui for new UI. Never hand-write primitive components (buttons, inputs, dialogs, etc.).
  ```bash
  pnpm dlx shadcn@latest add <component-name> -c apps/web
  ```
- **Shared vs. App-specific**:
    - **Shared/reusable** → `packages/ui/src/components/`
    - **App-specific/page-level** → `apps/web/components/`
- **Rules**:
    - Do not duplicate components — check `packages/ui/src/components/` before creating new ones.
    - All components must use `cn()` from `@workspace/ui/lib/utils` for conditional class merging.
    - Follow the existing shadcn/ui component pattern (variants via `cva`, `forwardRef`, etc.).
- **Importing**: Shared UI components are imported from the shared package:
  ```tsx
  import { Button } from "@workspace/ui/components/button";
  ```

### Styling
- **Tailwind**: Uses Tailwind CSS v4. Use Tailwind utility classes directly — no custom CSS unless absolutely necessary.
- **Animations**: Use `tw-animate-css` for animations.
- **Dark Mode**: Handled by `next-themes` via `ThemeProvider` in `apps/web/components/theme-provider.tsx`.
- **Global Styles**: Located in `packages/ui/src/styles/globals.css`.

### Commits & Branching
- **Commit Format**: Follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `chore:`). Enforced by `commitlint` and `husky`.
- **Branching Strategy**:
    - `main`: Production-ready code.
    - `dev`: Integration branch.
    - `feat/`, `fix/`, `chore/`: Feature or fix branches, branched from `dev`.
    - **Workflow**: `feat/` -> `dev` (via PR) -> `main` (via PR).

### Quality Control
- **Linting**: ESLint is used across the workspace with a shared base config.
- **Formatting**: Prettier is used for consistent code style, including Tailwind class sorting.
- **Type Safety**: Strict TypeScript settings are applied via the shared `@workspace/typescript-config`.
- **Imports**: Use relative imports if path alias not available.

