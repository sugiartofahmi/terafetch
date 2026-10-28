# react-vite-tanstack

A React + Vite + TanStack boilerplate with a layered `api/hooks/UI` architecture, modeled after production conventions. Ships with three example flows (Login, Register, Dashboard) wired end-to-end against a mocked API layer, ready to swap in a real backend.

## Stack

- **React 19** + **Vite**
- **TanStack Router**: routing
- **TanStack Query**: server state
- **TanStack Store**: client state
- **shadcn/ui** + Tailwind v4: UI
- **react-hook-form** + **Zod**: forms and validation
- **vitest** + **Playwright**: unit and e2e tests

## Getting started

```bash
pnpm install
cp .env.example .env   # optional, falls back to sane defaults if skipped
pnpm dev
```

## Scripts

| Script                              | What it does                                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                          | Start the dev server                                                                                              |
| `pnpm build`                        | Production build (`vite build` first, then `tsc`, in that order so `routeTree.gen.ts` exists before typechecking) |
| `pnpm preview`                      | Preview the production build                                                                                      |
| `pnpm lint`                         | ESLint                                                                                                            |
| `pnpm format` / `pnpm format:check` | Prettier write / check                                                                                            |
| `pnpm check`                        | `format` + `lint` in one go                                                                                       |
| `pnpm test`                         | Unit tests (vitest)                                                                                               |
| `pnpm test:watch`                   | Unit tests in watch mode                                                                                          |
| `pnpm test:coverage`                | Unit tests with coverage                                                                                          |
| `pnpm test:e2e`                     | e2e tests (playwright, spins up the dev server automatically)                                                     |
| `pnpm test:e2e:ui`                  | e2e tests with the Playwright UI                                                                                  |

## Project structure

```
src/
  routes/          # TanStack Router, routing only, no business logic.
                    # Route-local pieces live in a `-components/` subfolder.
  apis/             # All data + logic, one folder per domain: api call,
                    # types, Zod schema, and a query/form hook.
  components/
    ui/              # shadcn primitives + app shell pieces (sidebar, navbar)
    layouts/          # ProtectedLayout, PublicLayout
  integrations/      # Per-library setup: axios, socket.io, TanStack Query/Store
  libs/               # Generic utilities: cookies, cn(), ts-belt/ts-pattern re-exports
  middlewares/         # Gatekeeping concerns: permission checks (RBAC)
  test/                 # Vitest setup
e2e/                     # Playwright specs
```

Each layer has one job: `routes/` wires up URLs, `apis/` owns data and form logic, `components/` renders. Mock API functions (`login.api.ts`, `register.api.ts`, `dashboard.api.ts`) resolve after a fake delay instead of hitting a server, and each has a commented-out real `axios` call ready to swap in.

## Testing

- **Unit** (`src/**/*.test.ts`): co-located with the module under test, e.g. `src/libs/cookies.test.ts`.
- **e2e** (`e2e/*.spec.ts`): full-flow checks against a running dev server.

## Environment variables

See `.env.example`. `VITE_API_BASE_URL` is the only one currently read (by the axios instance and the socket client) and defaults to `http://localhost:3100` if unset.
