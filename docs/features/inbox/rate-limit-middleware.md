# Rate-limit Middleware (Networking)

> Status: inbox
> Level: feature
> Phase: 2
> Depends on: (none)
> ADR needed: no

## Idea

Per-player, per-event rate limiter for Flamework Networking server-bound events. Drops or throttles events that exceed a budget. Default applied globally; per-event override available. Cheap defense against trivial spam exploits — not a substitute for actual server-side validation, but stops obvious flood patterns.

## API sketch

```ts
// server/infra/network-rate-limit.ts
import { TokenBucket } from "./token-bucket";

export const rateLimitMiddleware: Middleware = (event) => {
  const bucket = bucketFor(player, event.name);
  if (!bucket.tryConsume(1)) {
    log.warn(`rate limited: ${player.Name} on ${event.name}`);
    return; // drop
  }
  return event.next();
};

// Per-event overrides
export const RATE_LIMITS: Record<string, { capacity: number; refillPerSec: number }> = {
  default:        { capacity: 30, refillPerSec: 15 },
  toggleSetting:  { capacity: 5,  refillPerSec: 2 },
  // server-callable events get specific limits as added
};
```

Wire it into `server/infra/network.ts` middleware chain.

## Files

- `src/server/infra/network-rate-limit.ts` (new)
- `src/server/infra/token-bucket.ts` (new — pure logic, testable)
- `src/server/infra/network.ts` (add middleware to chain)
- `src/server/tests/network/rate-limit.spec.ts` (new — token bucket test)
- `docs/systems/rate-limit.md` (short — under `docs/systems/` or merge into `networking.md`)

## Dependencies

- Existing `server/infra/network.ts` middleware infrastructure

## Decisions to make

- **D1: Token bucket vs fixed window.** **Rec: token bucket.** Smooths bursts; standard pattern.
- **D2: Drop vs throttle.** **Rec: drop, log warn.** Clients should never need to retry — UI should debounce its own user input. Server dropping silently is fine.
- **D3: Per-event config location.** **Rec: same file as middleware (`RATE_LIMITS` constant).** Reviewable in one place.
- **D4: Cleanup on `PlayerRemoving`.** Buckets keyed by `(userId, eventName)`. **Rec: drop entire user's buckets on remove.** Use `Map<userId, Map<eventName, TokenBucket>>`.
- **D5: Update `networking.md` or new file?** **Rec: update existing `docs/systems/networking.md`.** Don't fragment.

## Acceptance criteria

- [ ] Sending 100 `toggleSetting` events in 1s — first ~5 pass, rest dropped, no error to client
- [ ] After 5s of idle, bucket refilled to capacity
- [ ] Player leaving releases buckets (no leak)
- [ ] Token bucket unit-tested for capacity, refill, drain
- [ ] Existing tests still pass
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] `networking.md` updated with rate-limit section
