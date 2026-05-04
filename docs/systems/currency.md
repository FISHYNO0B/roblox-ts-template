# Currency

Per-player named integer balances. Currently `Coins` and `Gems` — placeholder content, expected to be replaced or extended per game.

## Pieces

- **Type:** [`Currency`](../../src/shared/domain/Currency.ts) — string union of currency names.
- **Storage:** in `playerData.balance: Record<Currency, number>`.
- **Slice:** [`balanceSlice`](../../src/shared/infra/store/slices/players/balance.ts) — actions: `loadPlayerData`, `closePlayerData`, `changeBalance`.
- **UI:** [`CurrencyApp`](../../src/client/ui/features/currency/currency-app.tsx) — displays balances in the top-right.
- **Cmdr:** `giveCurrency me Coins 100` ([definition](../../src/server/cmdr/commands/giveCurrency.ts), [handler](../../src/server/cmdr/commands/giveCurrencyServer.ts)).

## Adding a new currency

1. Add the name to the `Currency` union in [Currency.ts](../../src/shared/domain/Currency.ts).
2. Add a default of `0` in `defaultPlayerData.balance` ([utils.ts](../../src/shared/infra/store/slices/players/utils.ts)).
3. (Optional) Add a `Tickets` leaderstat in `PlayerDataService` if it should appear on the leaderboard.
4. Cmdr `giveCurrency` already supports any `Currency` value via the custom type — no change needed.

## Server-authority rule

All balance changes go through `serverStore.changeBalance` on the server. The client only **displays** balances — never dispatches to its own store directly.
