# Badges

> Status: inbox
> Level: feature
> Phase: 2
> Depends on: `game-notifications` (for the unlock toast); pairs with `analytics`
> ADR needed: no

## Idea

Wrapper around Roblox `BadgeService`. Typed registry of badge keys → ids. Server `award(player, key)` checks ownership, awards if missing, fires a Notification on success. Idempotent — safe to call repeatedly. Pre-checks `BadgeService:UserHasBadgeAsync` before granting to avoid spamming Roblox's API.

## API sketch

```ts
// shared/domain/Badges.ts
export const Badges = {
  firstWin:        { id: 0, title: "First Win",        description: "Won your first match" },
  hundredCoins:    { id: 0, title: "Coin Collector",   description: "Earned 100 coins" },
  tenHoursPlayed:  { id: 0, title: "Dedicated",        description: "Played 10 hours" },
} as const;
export type BadgeKey = keyof typeof Badges;

// server/services/BadgeService.ts (our wrapper, NOT Roblox's)
badge.award(player, "firstWin");                   // idempotent, fires notification on first grant
badge.has(player, "firstWin"): Promise<boolean>;   // queries Roblox + caches
badge.cached(player, "firstWin"): boolean;         // sync read of cache
```

Cache per-player, populated lazily as needed.

## Files

- `src/shared/domain/Badges.ts` (new — registry stubs)
- `src/server/services/BadgeService.ts` (new — `@Service`)
- `docs/systems/badges.md` (short)
- (test) `src/server/tests/badges/award-idempotent.spec.ts`

## Dependencies

- `game-notifications` (so award triggers a Notification)
- Logger (warn on `BadgeService` API failures)

## Decisions to make

- **D1: Pre-check ownership.** Roblox's `AwardBadge` is idempotent server-side, but rate-limited. **Rec: pre-check via `UserHasBadgeAsync`, skip if owned.** Saves quota.
- **D2: Cache layer.** **Rec: in-memory `Map<userId, Set<BadgeKey>>`** per server instance. Populate on `PlayerAdded` (lazy — query each on demand, not all upfront).
- **D3: Notification on award.** **Rec: yes.** Use `NotificationService.send(player, { kind: "badge", title: badge.title, body: badge.description, iconKey: ... })`. Optional icon resolved from registry meta later.
- **D4: Profile mirror.** Should owned badges be in player profile? **Rec: no.** Roblox is the source of truth; querying is cheap with caching.
- **D5: Where to call `award` from?** That's per-game logic. Template just provides the API.

## Acceptance criteria

- [ ] `Badges` registry exists with stub entries (id = 0 means disabled — no actual award possible)
- [ ] `badge.award(player, "firstWin")` calls `BadgeService:AwardBadge` if not owned, no-ops if owned
- [ ] First successful award fires a Notification with title + description
- [ ] Calling `award` 10x in a row results in at most 1 Roblox API call after the first
- [ ] `badge.cached(player, key)` returns sync boolean after first query
- [ ] Player leaving cleans up their cache entry
- [ ] Test: idempotent — second `award` of same badge does not re-notify
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] `docs/systems/badges.md` written
