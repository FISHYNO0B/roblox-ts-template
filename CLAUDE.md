# CLAUDE.md

How Claude works in this repo. These rules apply to **every** game built from this template.

## What this repo is

A roblox-ts template that I use as the starting point for all my Roblox games. It is **a game without the game-specific content** — not a scaffold. Forking it gives you a working "non-game" with currency, settings, save system, UI shell, and Cmdr commands. From there you replace and extend until it becomes the actual game.

There is no hard line between "template code" and "game code". The vault, the systems docs, and the source all describe **whatever this repo currently is**.

## Tech stack

- **roblox-ts** — TypeScript → Lua
- **Flamework** — services (server) and controllers (client) with DI
- **Reflex** — state management, server→client sync via broadcaster/receiver middleware
- **React (@rbxts/react)** + **react-reflex** — UI
- **ProfileService** — DataStore wrapper
- **Cmdr** — in-game admin console (F2 in Studio)
- **TestEZ** — `*.spec.ts`, auto-runs in Studio
- **UI Labs** — preview React components without launching the game (`*.story.tsx`)

## Where things live

```
src/
├── client/
│   ├── runtime.client.ts        ← entry point, do not move
│   ├── controllers/             ← Flamework @Controller classes (auto-discovered)
│   ├── infra/                   ← network, store, middleware
│   └── ui/
│       ├── primitives/          ← Frame, TextLabel, TextButton, … reusable building blocks
│       ├── features/            ← currency, settings, buttons — concrete UI features
│       ├── shell/               ← top-level UI router (HolderApp)
│       ├── stories/             ← *.story.tsx for UI Labs
│       └── utils/
├── server/
│   ├── runtime.server.ts        ← entry point, do not move
│   ├── services/                ← Flamework @Service classes (auto-discovered)
│   ├── cmdr/                    ← Cmdr commands, types, startup
│   ├── infra/                   ← network, store, middleware
│   └── tests/                   ← *.spec.ts
└── shared/
    ├── domain/                  ← pure types, constants (Currency, Settings, Gui)
    ├── infra/                   ← network signature + Reflex slices/selectors
    └── utils/                   ← shared helper functions
```

**Where do I put a new thing?**
- Reusable visual primitive (button, frame variant) → `client/ui/primitives/`
- A self-contained UI feature → `client/ui/features/<name>/`
- Server-side logic with state/lifecycle → `client/services/<Name>Service.ts` (Flamework)
- Pure data shape used on both sides → `shared/domain/`
- A Reflex slice → `shared/infra/store/slices/`

## Running it

```
npm start          # watch + Rojo serve in parallel
npm run build      # one-shot compile
npm run typecheck  # types only, no emit
npm run lint       # eslint
npm run lint:fix   # autofix
```

Tests run automatically when you press Play in Studio (Studio-only, gated by `RunService.IsStudio()`). Use the **TestEZ Companion** VS Code extension to run them without launching the game.

## How I work in this repo

### Three workflow levels — pick one per task

| Level | When | Process |
|---|---|---|
| **1. Quick fix** | < 30 min, no design question | Just do it. No vault entry. |
| **2. Feature** | New behaviour, multi-file, or design question | Idea lands in `docs/features/inbox/`. When ready I run `grill-with-docs` to pressure-test. Spec moves to `docs/features/active/<slug>.md`. Implement → test → move to `done/`. |
| **3. System** | Architectural impact, hard to reverse | Same as feature **+** an ADR in `docs/adr/` capturing *why*. |

The user picks the level. If a task is mis-leveled (e.g. "quick fix" but actually a system change), I flag it before starting.

### When to ask vs when to act

**Act without asking** for: fixing typos, adjusting styling, adding tests, renames within scope, anything reversible inside this repo.

**Ask first** for:
- Any change touching `shared/infra/store/slices/players/` (player save shape — backwards compatibility)
- Any change to `default.project.json`, `tsconfig.json`, `rokit.toml`, `package.json` deps
- Adding a new top-level folder under `src/`
- Architectural choices that would warrant an ADR

### Docs vault

`docs/` is an Obsidian vault committed to git. Open the folder in Obsidian. Structure:

- `../CONTEXT.md` (at repo root) — domain glossary. Updated by `grill-with-docs`. Read this before proposing terminology.
- `overview.md` — what this game is right now
- `systems/` — one file per system in the codebase
- `adr/` — architecture decision records
- `features/inbox|active|done/` — the three-stage feature flow
- `journal/` — free-form daily notes

**I read the vault for context before non-trivial work.** I write to it when:
- A feature finishes (move from `active/` to `done/`, add a one-paragraph retro)
- A system gets meaningfully changed (update `systems/<name>.md`)
- A new term enters the domain (add to `CONTEXT.md`)
- A hard-to-reverse decision is made (write an ADR)

### Code style

ESLint + Prettier are authoritative. Don't fight them. Notable conventions in this repo:
- Component files use `kebab-case.tsx`. Component exports use `PascalCase`.
- Reflex producer methods are named like commands: `loadPlayerData`, `changeBalance`.
- Selectors are functions returning selectors: `selectPlayerBalance(playerId, currency)`.
- Use `$print(...)` from `rbxts-transform-debug` for debug logging — gives file/line/expression context. Plain `print()` only when output is for the user.
- Custom UI components (`Frame`, `TextLabel`, …) over JSX intrinsics (`<frame>`, `<textlabel>`) when one exists.

### Don't

- Don't add abstractions for hypothetical future games. If three games need it, *then* extract.
- Don't rename or move files for cosmetic reasons. The current names are stable.
- Don't add JSDoc/comments for what code obviously does. Only comment **why** when non-obvious.
- Don't bypass server authority — never let the client write to anything valuable without server validation.
- Don't `--no-verify`, `--force`, or `--amend` published commits without explicit ask.

## Pointers

- New-developer onboarding: [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)
- High-level project README: [README.md](README.md)
- Vault index: [docs/README.md](docs/README.md)
