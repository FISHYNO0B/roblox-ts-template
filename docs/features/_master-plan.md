# Master plan — common-game systems backlog

Roadmap for adding standard Roblox-game systems to this template. 16 systems split into 3 phases. Each has a stub spec in `inbox/`. Pull one at a time into `active/`, implement in a fresh session, move to `done/` with retro.

## Phase 1 — foundation (sequential, must be done in this order)

| # | Spec | Level | ADR | Notes |
|---|---|---|---|---|
| 1 | [asset-registry](done/asset-registry.md) ✅ | system | 0003 | foundation; everything else indexes into it |
| 2 | [sound-system](done/sound-system.md) ✅ | system | 0004 | depends on #1 |
| 3 | [music-system](done/music-system.md) ✅ | system | 0005 | depends on #2 |
| 4 | [vfx-system](done/vfx-system.md) ✅ | system | 0006 | depends on #1 |

Why first: every other system either references the asset registry directly (icons, sounds, music keys) or expects the kit-level "audiovisual feel" to be in place.

## Phase 2 — independent systems (any order; pick by priority per game)

| # | Spec | Level | ADR | Touches save schema? |
|---|---|---|---|---|
| 5 | [leaderstats](inbox/leaderstats.md) | feature | — | no |
| 6 | [rate-limit-middleware](inbox/rate-limit-middleware.md) | feature | — | no |
| 7 | [marketplace-monetization](inbox/marketplace-monetization.md) | system | 0007 | yes (purchase history; safe additive) |
| 8 | [preload-loading-screen](inbox/preload-loading-screen.md) | feature | — | no |
| 9 | [game-notifications](inbox/game-notifications.md) | feature | — | no (transient) |
| 10 | [input-abstraction](inbox/input-abstraction.md) | system | 0008 | no |
| 11 | [logger](inbox/logger.md) | feature | — | no |
| 12 | [localization](inbox/localization.md) | system | 0009 | no |
| 13 | [badges](inbox/badges.md) | feature | — | no |
| 14 | [analytics](inbox/analytics.md) | system | 0010 | no |

Suggested order if undecided: 11 (logger) → 9 (notifications) → 5 (leaderstats) → 6 (rate-limit) → 8 (preload) → 7 (marketplace) → 13 (badges) → 14 (analytics) → 10 (input) → 12 (localization).

Reason: small wins first, high-value-but-isolated next, schema-touching last.

## Phase 3 — touches player save schema (review before pull)

| # | Spec | Level | ADR | Notes |
|---|---|---|---|---|
| 15 | [daily-rewards](inbox/daily-rewards.md) | system | 0011 | adds `players/<id>/rewards` slice |
| 16 | [promo-codes](inbox/promo-codes.md) | system | 0012 | adds `players/<id>/codes` slice + global `codeUsage` DataStore |

These each add new top-level keys to the player profile. ProfileService default-merge handles existing profiles, but each change is hard to roll back once shipped. Land them deliberately, with the schema change reviewed before impl.

## How to consume one

```
1. Pick a spec from inbox/. (Phase 1 in order; Phase 2 any; Phase 3 with care.)
2. Open new Claude session.
3. "Pull <slug> into active and implement it."
   Claude will: move file inbox/ → active/, fill out plan/tasks against the
   stub, write ADR if needed, implement, test, move to done/ with retro.
4. Merge PR. Spec lives in done/ as historical record.
```

Each impl session starts cold from: this master plan + the relevant inbox spec + repo state. No conversation history needed.

## Skip / kill criteria

If a system in inbox stops being a fit (per-game requirements diverge, smaller scope acceptable, etc.):
- Move file to `done/` with retro paragraph: "Skipped — reason: …"
- Update this master plan to strike the row

Don't let `inbox/` rot.
