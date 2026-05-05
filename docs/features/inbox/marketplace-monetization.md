# MarketplaceService (DevProducts + GamePasses)

> Status: inbox
> Level: system
> Phase: 2
> Depends on: (none — but pairs naturally with `analytics` later)
> ADR needed: yes — `0007-monetization.md`

## Idea

Skeleton for handling DeveloperProducts and GamePasses via `MarketplaceService`. Implements `ProcessReceipt` correctly (idempotent, returns `Granted`/`NotProcessedYet`). Per-product handlers registered as a typed map. GamePass ownership cached per session. No actual products in the template — just the registry stubs and the wiring.

## API sketch

```ts
// shared/domain/Products.ts
export const DevProducts = {
  smallCoins:  { id: 0, handler: "grantCoins",  amount: 100 },
  mediumCoins: { id: 0, handler: "grantCoins",  amount: 500 },
  starterPack: { id: 0, handler: "grantPack",   pack: "starter" },
} as const;
export type DevProductKey = keyof typeof DevProducts;

export const GamePasses = {
  vip:        { id: 0 },
  doubleCoin: { id: 0 },
} as const;
export type GamePassKey = keyof typeof GamePasses;

// server/services/MonetizationService.ts
mon.registerHandler("grantCoins", (player, productMeta) => {
  store.changeBalance(player.UserId, "Coins", productMeta.amount);
});
mon.ownsPass(player, "vip"): boolean;        // cached
mon.promptProduct(player, "smallCoins");     // server-side prompt helper
mon.promptPass(player, "vip");
```

`ProcessReceipt` looks up product by id, calls handler, returns `Granted`. Errors → `NotProcessedYet` so Roblox retries.

## Files

- `src/shared/domain/Products.ts` (new — registry stubs)
- `src/server/services/MonetizationService.ts` (new — `@Service`)
- `src/server/services/MonetizationHandlers.ts` (new — handler implementations)
- `src/shared/infra/network.ts` (add `promptPurchase(productKey)` server-bound event for client → server requests)
- `src/server/cmdr/commands/grantProduct.ts` + `grantProductServer.ts` (debug — fakes ProcessReceipt locally)
- `docs/systems/monetization.md` (new)
- `docs/adr/0007-monetization.md` (new)
- (test) `src/server/tests/monetization/process-receipt.spec.ts`

## Dependencies

- ProfileService (to log receipt history idempotently in profile)
- Reflex store (to grant currencies via `changeBalance`)

## Decisions to make

- **D1: Idempotency tracking.** **Rec: store `purchaseHistory: Set<string>` (PurchaseId) in player profile.** Prevents double-grant if Roblox retries `ProcessReceipt`. Capped at last 50 entries (pruned FIFO).
- **D2: Pass ownership caching.** **Rec: query once on `PlayerAdded`, cache in memory map.** Re-query never (passes don't get revoked mid-session). Refresh on join only.
- **D3: GamePass effects in store?** **Rec: yes — `players/<id>/passes: Set<GamePassKey>` slice.** Then features can `useSelector(selectHasPass(playerId, "vip"))` reactively.
- **D4: Where do prices live?** **Rec: don't.** MarketplaceService prompts handle prices server-side. Registry stores only id + handler info.
- **D5: Handler error policy.** **Rec: throw → return `NotProcessedYet`.** Roblox will retry. Better than granting and forgetting.

## Acceptance criteria

- [ ] `DevProducts` + `GamePasses` registries exist (stub ids = 0)
- [ ] `ProcessReceipt` is registered, looks up product by id, dispatches to handler
- [ ] `purchaseHistory` in profile prevents double-grant on replay
- [ ] `mon.ownsPass(player, "vip")` returns cached boolean
- [ ] `players/passes` slice synced via broadcaster
- [ ] Cmdr `grantProduct <key>` simulates a purchase end-to-end
- [ ] Test: ProcessReceipt with already-seen PurchaseId returns `Granted` without re-running handler
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] ADR + `docs/systems/monetization.md` written
