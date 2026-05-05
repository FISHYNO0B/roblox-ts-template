# Game

Game-specific design docs. Everything in this folder is **placeholder template content** until the repo is forked into a real game — at which point you fill these in.

The split between this folder and the rest of `docs/`:

- `docs/game/` — what the game *is* (design, economy, progression, numbers). Replace per-game.
- `docs/systems/`, `docs/adr/`, `docs/features/` — how the codebase works (architecture, decisions, in-flight work). Mostly game-agnostic, carries over between forks.

## Files

| File | What it covers |
|---|---|
| [design.md](design.md) | Pitch, pillars, references, non-goals, core loop. The **what & why**. |
| [economy.md](economy.md) | Currencies, gamepasses, devproducts, pricing principles. |
| [progression.md](progression.md) | Player journey, unlock paths, upgrade families. |
| [balancing.md](balancing.md) | Living numbers doc — tier tables, prices, drop-rates. Tuned during playtest. |

## Suggested fill-in order

When forking, work through them in this order — each builds on the previous:

1. **design.md** — settle the pitch, pillars, non-goals first. Everything else flows from these.
2. **economy.md** — once you know the fantasy, decide what the player earns and spends.
3. **progression.md** — once you know the economy, lay out the unlock path through it.
4. **balancing.md** — fill in numbers last, and re-tune them throughout playtest.
