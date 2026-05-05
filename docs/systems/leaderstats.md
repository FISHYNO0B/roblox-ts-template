# Leaderstats

Mirror of player currency balances into a `leaderstats` Folder under each `Player`, so the values appear in the Roblox player list (Tab key). One-way: store → leaderstats. Server-only.

## Pieces

- **Service:** [`LeaderstatsService`](../../src/server/services/LeaderstatsService.ts) — on `PlayerAdded`, builds the folder + an `IntValue` per currency in `LEADERSTATS_CURRENCIES` and subscribes to [`selectPlayerBalances`](../../src/shared/infra/store/selectors/players.ts). Cleans up the subscription on `PlayerRemoving`.
- **Configured currencies:** `LEADERSTATS_CURRENCIES` constant at the top of the service file. Currently `["Coins", "Gems"]`.

## Adding a currency to the leaderboard

1. Make sure it's in [`CURRENCIES`](../../src/shared/domain/Currency.ts) and present on the default balance ([`utils.ts`](../../src/shared/infra/store/slices/players/utils.ts)).
2. Add the name to `LEADERSTATS_CURRENCIES` in [`LeaderstatsService.ts`](../../src/server/services/LeaderstatsService.ts).

## Notes

- `IntValue` is used because all currencies are integers in this template. If a non-integer "stat" is ever needed, that's a separate system — `leaderstats` is intentionally narrow.
- The service applies the current store value once at setup and then subscribes, so a player who joins after their profile has loaded still sees correct values immediately.
- Display name = currency name (`Coins`, `Gems`). Localize later if needed.

## Related

- [Currency / balance state](../../src/shared/infra/store/slices/players/balance.ts)
- [`PlayerDataService`](../../src/server/services/PlayerDataService.ts) — owns profile load/save; no longer manages leaderstats directly.
