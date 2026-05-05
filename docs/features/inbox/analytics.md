# Analytics

> Status: inbox
> Level: system
> Phase: 2
> Depends on: `logger` (consumes error stream); pairs with `marketplace-monetization`, `badges`
> ADR needed: yes — `0010-analytics.md`

## Idea

Provider-agnostic analytics layer. Internal `track(event, props)` + `identify(player, traits)` API; behind it a pluggable provider (`PlayFab`, `GameAnalytics`, or a no-op for the template's default). Auto-emits standard events: `session_start`, `session_end`, `purchase`, `currency_change`, `error`. Game code calls custom events via the same API.

## API sketch

```ts
// server/services/AnalyticsService.ts (Flamework @Service)
analytics.track(player, "level_up", { level: 5 });
analytics.track(player, "purchase", { product: "smallCoins", robux: 99 }); // emitted by Monetization
analytics.identify(player, { firstSeenAt, country, deviceType });

// shared/infra/analytics/types.ts
type Provider = {
  track(event: string, userId: number, props: Record<string, unknown>): void;
  identify(userId: number, traits: Record<string, unknown>): void;
  flush(): Promise<void>;
};

// shared/infra/analytics/providers/noop.ts (default)
// shared/infra/analytics/providers/playfab.ts (stub — implement when keyed)
```

Auto-emitted events (wired by AnalyticsService):
- `session_start` on `PlayerAdded`
- `session_end` on `PlayerRemoving` with duration
- `error` on `log.onError` signal
- `purchase` listening for receipts in MonetizationService
- `currency_change` subscribing to balance slice diffs (optional, may be noisy — see decision)

## Files

- `src/shared/infra/analytics/types.ts` (new — `Provider` interface)
- `src/shared/infra/analytics/providers/noop.ts` (new — default)
- `src/shared/infra/analytics/providers/playfab.ts` (new — stub; TODO when keys added)
- `src/server/services/AnalyticsService.ts` (new — `@Service`)
- `src/server/infra/analytics-config.ts` (new — provider selection: `process.env.ANALYTICS_PROVIDER` doesn't exist in Roblox; use a constant)
- `docs/systems/analytics.md` (new)
- `docs/adr/0010-analytics.md` (new)
- (test) `src/server/tests/analytics/auto-events.spec.ts`

## Dependencies

- `logger` — `analytics` subscribes to `log.onError` for error tracking
- (optional integration) `marketplace-monetization` — emit `purchase` event after grant
- (optional integration) `badges` — emit `badge_unlocked` event after award

## Decisions to make

- **D1: Default provider.** **Rec: `noop`.** Template ships with no real analytics endpoint; per-game implementer wires `playfab` or similar.
- **D2: Auto-emit currency_change?** **Rec: no by default.** Too chatty for free-tier providers. Game can opt-in by wrapping `changeBalance` in a tracked action or calling `track` explicitly.
- **D3: Where does the provider live — server only or both?** **Rec: server only.** Client doesn't track directly. If client needs to log, it sends a Networking event to server, server tracks. (Reduces exploit surface — clients can spam fake events otherwise.)
- **D4: Buffering / flushing.** **Rec: provider-internal.** `Provider` interface stays simple: `track`, `identify`, `flush`. Each implementation handles its own batching.
- **D5: PII / userId hashing.** **Rec: pass raw `UserId`.** Roblox doesn't consider it PII. Per-game implementer can hash if needed for their compliance.
- **D6: Standard event names.** **Rec: snake_case, listed in `analytics-events.md`.** Documented constants prevent name drift across game iterations.

## Acceptance criteria

- [ ] `analytics.track(player, "test_event", { foo: "bar" })` calls provider with normalized payload
- [ ] `analytics.identify(player, { ... })` works
- [ ] Auto-events emitted on PlayerAdded (session_start), PlayerRemoving (session_end with duration_sec)
- [ ] `log.error(...)` triggers an `error` track event
- [ ] Monetization integration: receipt processed → `purchase` event with product + robux
- [ ] Provider selection via `analytics-config.ts` — switching to `playfab` swaps backend with no other code changes
- [ ] Test: `noop` provider doesn't error; auto-events fire with correct shapes
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] ADR + `docs/systems/analytics.md` + `docs/systems/analytics-events.md` written
