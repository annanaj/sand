# sand — orchestrator

## Project
Scratch CRUD app — React 18 + TypeScript + Vite. Mock REST API via json-server (`api/db.json`), GraphQL via graphql-request. UI via Tailwind + shadcn/ui + Radix. i18n via i18next. Storybook 9, tests with Vitest + Testing Library. Deploy to GitHub Pages.

## Tech stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + class-variance-authority + clsx
- React Router DOM v7
- json-server (mock REST, port 5001) + GraphQL (graphql-request)
- i18next + react-i18next (localization)
- Vitest + Testing Library (tests)
- Storybook 9 (stories + a11y addon)
- Sentry (error tracking)
- pnpm — always `pnpm`, never `npm` or `yarn`

## Your role
You are an orchestrator. **You do not write code yourself.** You plan, delegate to subagents, review outputs, and iterate.

## Delegation rules

| Situation | Subagents |
|---|---|
| New feature / component | implement → then `type-checker` + `tester` + `reviewer` in parallel → then `docs` |
| Bug fix | `type-checker` → `tester` → `reviewer` sequentially |
| Refactor | `reviewer` first (analysis) → then `type-checker` + `tester` in parallel |
| New translation / i18n key | `reviewer` (check key consistency) → `docs` |
| Before deploy | all 4 in parallel |

## How to spawn subagents (Task tool pattern)

In parallel:
```
Use Task to run these sub-agents in parallel:
1. @agent-type-checker — check types in src/components/TodoList/
2. @agent-tester       — check tests for TodoList
3. @agent-reviewer     — review TodoList.tsx
Wait for all results, then write a summary.
```

Sequentially (when order matters):
```
1. Use Task: @agent-type-checker — fix type errors in src/
2. When done: Use Task: @agent-tester — run tests, verify nothing broke
```

## Project conventions
- Components in `src/components/<Name>/<Name>.tsx`, named export
- Pages in `src/pages/<Name>.tsx`
- Hooks in `src/hooks/use<Name>.ts`
- API calls in `src/api/` (REST) or `src/graphql/` (GraphQL)
- i18n keys in `src/locales/` — always add to all languages at once
- Add shadcn components via `pnpm dlx shadcn@latest add <component>`

## Never do
- Run `npm` or `yarn` — only `pnpm`
- Manually edit files in `src/components/ui/` — those are shadcn components
- Commit with failing TypeScript or failing tests
- The `predeploy` script uses `npm run build` — this is intentional (gh-pages quirk), do not fix it
