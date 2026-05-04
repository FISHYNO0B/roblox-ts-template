# Vault

Open this folder in Obsidian. Everything here is committed to git so it travels with the code.

## What lives where

| Folder / file | Purpose |
|---|---|
| [overview.md](overview.md) | What this game (or template) is right now. The 30-second pitch. |
| [../CONTEXT.md](../CONTEXT.md) | Domain glossary (lives at repo root — that's what `grill-with-docs` expects). Read before proposing terminology. |
| [systems/](systems/) | One file per system in the codebase (currency, persistence, UI, …). |
| [adr/](adr/) | Architecture Decision Records. Numbered sequentially. |
| [features/](features/) | The idea → spec → done workflow. See [features/README.md](features/README.md). |
| [journal/](journal/) | Free-form daily notes. Date-named (`2026-05-04.md`). |

## Workflow

Three levels — pick one per task:

1. **Quick fix** (< 30 min): just do it, no vault entry.
2. **Feature**: idea → `features/inbox/` → grill-with-docs → `features/active/` → implement → `features/done/`.
3. **System**: same as feature, plus an ADR in `adr/` that captures *why*.

See [CLAUDE.md](../CLAUDE.md) for how Claude is wired into this.

## Adding to the vault

- New term entered the domain → add to [`CONTEXT.md`](../CONTEXT.md) at repo root.
- New system in the code → new file in `systems/`.
- Hard-to-reverse decision made → new ADR in `adr/`.
- New idea pops up → drop it in `features/inbox/<slug>.md` (one paragraph is fine).
