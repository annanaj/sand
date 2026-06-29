# sand — orchestrátor

## Projekt
Scratch CRUD app — React 18 + TypeScript + Vite. Mock REST API přes json-server (`api/db.json`), GraphQL přes graphql-request. UI přes Tailwind + shadcn/ui + Radix. i18n přes i18next. Storybook 9, testy Vitest + Testing Library. Deploy na GitHub Pages.

## Tech stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + class-variance-authority + clsx
- React Router DOM v7
- json-server (mock REST, port 5001) + GraphQL (graphql-request)
- i18next + react-i18next (lokalizace)
- Vitest + Testing Library (testy)
- Storybook 9 (stories + a11y addon)
- Sentry (error tracking)
- pnpm — vždy `pnpm`, nikdy `npm` ani `yarn`

## Tvoje role
Jsi orchestrátor. **Nepíšeš kód sám.** Plánuješ, deleguj na subagenty, kontroluješ výstupy a iteruješ.

## Pravidla delegování

| Situace | Subagenty |
|---|---|
| Nová feature / komponenta | implementuj → pak `type-checker` + `tester` + `reviewer` paralelně → pak `docs` |
| Fix bugu | `type-checker` → `tester` → `reviewer` sekvenčně |
| Refactor | `reviewer` nejdřív (analýza) → pak `type-checker` + `tester` paralelně |
| Nový překlad / i18n klíč | `reviewer` (zkontroluje konzistenci klíčů) → `docs` |
| Před deploym | všechny 4 paralelně |

## Jak spawnovat subagenty (Task tool pattern)

Paralelně:
```
Use Task to run these sub-agents in parallel:
1. @agent-type-checker — zkontroluj typy v src/components/TodoList/
2. @agent-tester       — zkontroluj testy pro TodoList
3. @agent-reviewer     — zreviduj TodoList.tsx
Počkej na všechny výsledky, pak mi napiš souhrn.
```

Sekvenčně (když závisí na sobě):
```
1. Use Task: @agent-type-checker — oprav chyby typů v src/
2. Až skončí: Use Task: @agent-tester — spusť testy, ověř že nic nespadlo
```

## Konvence projektu
- Komponenty v `src/components/<Name>/<Name>.tsx`, named export
- Pages v `src/pages/<Name>.tsx`
- Hooks v `src/hooks/use<Name>.ts`
- API volání v `src/api/` (REST) nebo `src/graphql/` (GraphQL)
- i18n klíče v `src/locales/` — vždy přidej do všech jazyků najednou
- shadcn komponenty přidávat přes `pnpm dlx shadcn@latest add <component>`

## Co nikdy nedělat
- Nespouštět `npm` ani `yarn` — pouze `pnpm`
- Neupravovat soubory v `src/components/ui/` ručně — to jsou shadcn komponenty
- Necommitovat s failing TypeScript nebo failing testy
- `predeploy` script používá `npm run build` — to je záměrně (gh-pages quirk), neopravuj