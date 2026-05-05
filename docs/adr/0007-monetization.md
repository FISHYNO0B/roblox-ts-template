# Monetization via a typed registry, idempotent ProcessReceipt, and a passes Reflex slice

A `MonetizationService` (Flamework `@Service`) owns all interaction with `MarketplaceService`. DeveloperProducts and GamePasses are described by two typed registries in `shared/domain/Products.ts` keyed by string (`"smallCoins"`, `"vip"`, …) — not by numeric asset id. Each DevProduct entry carries an `id`, a `handler` name, and handler-specific args. Handlers are registered in a separate `MonetizationHandlers` service and looked up by name; the service exposes `promptProduct(player, key)` / `promptPass(player, key)` server-side and routes a single client→server `promptPurchase(productKey)` event for client-driven prompts. `ProcessReceipt` is registered once at service start, looks up the product by `ProductId`, dispatches to its handler, persists the `PurchaseId` into `players/<id>/purchaseHistory`, and returns `Granted`. Any `error()` from a handler bubbles into `NotProcessedYet` so Roblox retries.

GamePass ownership is queried once on `PlayerAdded` (after profile load) via `MarketplaceService:UserOwnsGamePassAsync`, written into a new `players/<id>/passes: Record<GamePassKey, boolean>` Reflex slice, and never re-queried mid-session. Pass ownership is not persisted to ProfileService — it is derived from Roblox on join, so the slice loads from the live query rather than from `profile.Data`. Features that need to react to ownership use `selectHasPass(playerId, key)` exactly like the existing balance/setting selectors.

**Why a typed registry keyed by string, not numeric id:** numeric asset ids are unreadable in code (`grantCurrency(player, 1234567890)`), don't survive id swaps without a refactor, and prevent the type system from catching typos. Keying by `DevProductKey = keyof typeof DevProducts` gives autocomplete on every call site; the numeric id only appears once, in the registry, where it is also the natural place to put a handler reference. The same shape is used for [assets](0003-asset-registry.md) and is the established convention in this template.

**Why split the registry from the handlers:** the registry is pure data, lives in `shared/`, and can be read by tests, the Cmdr command, and the client (for prompting flows). The handlers reference `serverStore` and other server-only services, so they can't live in `shared/`. Putting them in a separate `MonetizationHandlers` service keeps the import graph one-way (server → shared), and keeps the registry trivially serialisable.

**Why `purchaseHistory` is an `Array<string>`, not a `Set`:**
- `Set` doesn't survive ProfileService's JSON-encoded DataStore round-trip cleanly (it serialises to `{}`); arrays do.
- FIFO pruning at 50 entries needs ordering, which `Set` doesn't expose.
- Lookup is O(n) instead of O(1), but n ≤ 50 — well below any cost worth caring about.

**Why passes live in the Reflex store, not just a server-side memory map:**
- Client UI needs to react to ownership (`<VipBadge>`, locked-feature gates) — using a selector on `clientStore` is identical to how the rest of the UI reads state, so there's no second mechanism to learn.
- The server still owns the data; the client cannot dispatch into it. Broadcaster middleware replicates it the same way as `balance` and `settings`.
- The cost is one extra slice and ~20 lines of selectors. Any approach that bypassed the store would need a parallel networking event for the client to learn about ownership anyway.

**Why pass ownership is not persisted:**
- GamePasses can be revoked via Roblox refunds; trusting `profile.Data` could grant the pass to a player who no longer owns it.
- `UserOwnsGamePassAsync` is the source of truth and is cheap on join (one round-trip per pass). Caching it for the session is enough — the spec explicitly accepts that mid-session purchases require a rejoin to take effect.

**Why a separate `purchaseHistory` slice instead of a field on the existing `balance` or `settings` slice:** the persistence pattern in this template is "one slice per concern". `balance` is currencies, `settings` is preferences, `purchaseHistory` is receipt idempotency. Mixing them would give actions on the wrong slice (e.g. `recordPurchase` on the balance slice) and complicate the `loadPlayerData` + reconcile path.

**Trade-offs:**
- **Save-shape change.** `PlayerData` gains `purchaseHistory: Array<string>`. ProfileService `Reconcile()` fills the field as `[]` for existing profiles, so the change is additive and safe. Flagged in the master plan accordingly.
- **`purchaseHistory` cap is heuristic.** 50 entries is "enough to cover Roblox retry windows, small enough to ignore size cost". A pathological player making thousands of distinct purchases over a session could theoretically see a `PurchaseId` evicted from the cap before all retries fire — but Roblox retries are bounded to a few attempts within minutes, so the practical risk is zero. If it ever shows up, raise the cap.
- **No client-side prompt UX.** `promptPurchase(key)` fires a server event that calls `MarketplaceService:PromptProductPurchase` on the server — Roblox handles the actual UI. Clients cannot bypass this to grant themselves products.
- **Stub ids.** All registry entries ship with `id: 0`. Forks must replace the ids before any real product/pass works. Tests use stubs; runtime products won't resolve until ids are filled in. Spec calls this out as deliberate.
- **GamePass mid-session purchases require rejoin.** Acceptable per D2; the alternative (re-querying on prompt-close) adds complexity and a flicker window. If a forked game wants live updates, add a `PromptGamePassPurchaseFinished` listener that flips the slice — additive change.
- **Cmdr `grantProduct` doesn't fake a real `ProcessReceipt`.** It calls the handler directly. Good enough for end-to-end smoke testing of grant logic; doesn't exercise the idempotency path. The unit test covers that path with a fake receipt.
