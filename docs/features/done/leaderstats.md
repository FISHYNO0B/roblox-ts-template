# Leaderstats

> Status: done
> Level: feature
> Phase: 2
> Depends on: (none — uses existing `players/balance` slice)
> ADR needed: no

## Idea

Mirror player `Balance` from the Reflex store to a `leaderstats` Folder under each Player so values show in the Roblox player list. One-way: store → leaderstats. Server-only. Subscribes per-player on `PlayerAdded`, cleans up on `PlayerRemoving`.

## API sketch

```ts
// server/services/LeaderstatsService.ts (Flamework @Service, no public API)
// On player added: create leaderstats folder + IntValue per currency
// Subscribe to selectPlayerBalances(player.UserId), update IntValue.Value on change
// On player removing: cleanup subscription (folder auto-destroyed with Player)

// Configurable: which currencies appear in leaderstats
const LEADERSTATS_CURRENCIES: Currency[] = ["Coins", "Gems"];
```

## Files

- `src/server/services/LeaderstatsService.ts` (new — `@Service`)
- `src/server/services/PlayerDataService.ts` (updated — inline leaderstats logic removed)
- `docs/systems/leaderstats.md` (new)

## Dependencies

- Existing `players/balance` slice + `selectPlayerBalances` selector

## Decisions taken

- **D1: Hardcoded `LEADERSTATS_CURRENCIES` constant** in the service file. Per-game tweak; intentionally not dynamic.
- **D2: Currencies/scores only.** Settings and other state stay out of `leaderstats`.
- **D3: `IntValue`.** All currencies are integers in this template. (Was `NumberValue` previously — fixed as part of the extraction.)
- **D4: Display name = currency name.** `Coins`, `Gems`. Localize later if needed.

## Acceptance criteria

- [x] Player joining sees Coins + Gems in leaderboard (Tab key)
- [x] `changeBalance(playerId, "Coins", 50)` updates leaderstats within one frame
- [x] No memory leak: subscriptions disposed on `PlayerRemoving`
- [x] `npm run typecheck` + `npm run lint` clean
- [x] `docs/systems/leaderstats.md` written

## Retro

Landed 2026-05-05. The inline `createLeaderstats` already existed inside `PlayerDataService` from earlier scaffolding — this feature was really an extraction + two upgrades:

- **`NumberValue` → `IntValue`.** The currencies are integers; `NumberValue` displays as `0` but introduces float oddities for any code that reads `.Value`. Cheap fix while the code was getting touched.
- **Configurable `LEADERSTATS_CURRENCIES` constant.** Loops over the list instead of hardcoding `coins` and `gems` references — adding a third currency to the leaderboard is now a one-line change.

One subtle change: the new service applies the current store value once at setup *before* subscribing, instead of relying on the `loadPlayerData` → `createLeaderstats` ordering inside `PlayerDataService.createProfile`. This decouples the two services and means a future code path that loads balance from somewhere other than ProfileService still gets reflected in the leaderboard.
