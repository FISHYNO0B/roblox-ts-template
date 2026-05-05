# Monetization

How DeveloperProducts and GamePasses are wired into the template.

See [ADR 0007](../adr/0007-monetization.md) for the *why*.

## Pieces

- **`Products` registry** ([src/shared/domain/Products.ts](../../src/shared/domain/Products.ts)) — the canonical list of every DevProduct and GamePass the game sells. Keyed by string (`"smallCoins"`, `"vip"`). Pure data, no logic.
- **`MonetizationService`** ([src/server/services/MonetizationService.ts](../../src/server/services/MonetizationService.ts)) — registers `ProcessReceipt`, prompts purchases, queries pass ownership. The single owner of `MarketplaceService` interaction.
- **`MonetizationHandlers`** ([src/server/services/MonetizationHandlers.ts](../../src/server/services/MonetizationHandlers.ts)) — implements what each DevProduct *does* when granted. Registered with `MonetizationService` at start.
- **`purchaseHistory` slice** ([src/shared/infra/store/slices/players/purchaseHistory.ts](../../src/shared/infra/store/slices/players/purchaseHistory.ts)) — list of granted `PurchaseId`s (capped at 50, FIFO). Persisted via the existing ProfileService mirror.
- **`passes` slice** ([src/shared/infra/store/slices/players/passes.ts](../../src/shared/infra/store/slices/players/passes.ts)) — `Record<GamePassKey, boolean>`. Populated on join from `MarketplaceService:UserOwnsGamePassAsync`. Not persisted — Roblox is the source of truth.

## Adding a new DevProduct

1. In [Products.ts](../../src/shared/domain/Products.ts), add an entry to `DevProducts`:
   ```ts
   bigCoins: { id: 1234567890, handler: "grantCoins", amount: 1000 },
   ```
2. If the `handler` already exists in `MonetizationHandlers`, you're done.
3. Otherwise add a new handler in [MonetizationHandlers.ts](../../src/server/services/MonetizationHandlers.ts) — `mon.registerHandler("yourHandler", (player, meta) => { ... })`. The `meta` argument is the registry entry, fully typed via the discriminated `handler` field.

## Adding a new GamePass

1. Add an entry to `GamePasses` in [Products.ts](../../src/shared/domain/Products.ts):
   ```ts
   bigSpender: { id: 9876543210 },
   ```
2. The pass appears in `players/<id>/passes` automatically on next player join. Read it via `selectHasPass(playerId, "bigSpender")` from anywhere.

## Lifecycle

1. Player joins → `PlayerDataService` loads the profile (incl. `purchaseHistory`).
2. `MonetizationService` queries `UserOwnsGamePassAsync` once per registered pass, dispatches `setPasses`.
3. Player triggers a purchase prompt — either via server (`mon.promptProduct(player, "smallCoins")`) or via the client `promptPurchase` event.
4. Roblox shows the prompt; on completion fires `MarketplaceService.ProcessReceipt`.
5. Service checks `purchaseHistory` for the `PurchaseId`. If present → `Granted` (replay). If absent → look up product by `ProductId`, run handler, append `PurchaseId` to history (FIFO-prune at 50), return `Granted`. Handler `error()` → `NotProcessedYet`.

## Idempotency

`ProcessReceipt` is allowed to be called multiple times for the same `PurchaseId` (Roblox retries on failure). The `purchaseHistory` cap is the dedupe — checked before the handler runs. Don't put side effects (analytics events, etc.) before the dedupe check, or they'll fire on every retry.

## Debug

```
grantProduct <player> <productKey>      # cmdr — runs handler directly, bypasses idempotency
giveCurrency <player> <currency> <n>    # cmdr — for testing what handlers grant
```

## Don't

- Don't reference numeric product/pass ids outside `Products.ts`. Use the typed key.
- Don't add side effects in `ProcessReceipt` outside the handler — they won't be deduped.
- Don't persist pass ownership. Refunds revoke passes; stale `profile.Data` would grant a pass the player no longer owns.
- Don't write to `passes` from a handler. Passes are populated on join only.
