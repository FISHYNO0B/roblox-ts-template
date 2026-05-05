# Networking

Type-safe client↔server messaging via Flamework Networking. No raw RemoteEvents anywhere.

## The contract

[src/shared/infra/network.ts](../../src/shared/infra/network.ts) is the single source of truth:

```ts
interface ServerEvents {                  // events the CLIENT fires AT the server
    reflex: { start: () => void };
    toggleSetting: (setting: Setting) => void;
}

interface ClientEvents {                  // events the SERVER fires AT clients
    reflex: {
        dispatch: (actions: Array<BroadcastAction>) => void;
        hydrate:  (actions: PlayerData) => void;
        start:    () => void;
    };
}
```

Both sides import from `client/infra/network` or `server/infra/network` — those re-export the typed wrappers.

## Adding an event

1. Add the signature to `ServerEvents` (client→server) or `ClientEvents` (server→client) in `shared/infra/network.ts`.
2. Wire a handler:
   - Server-side handler: `ServerEvents.myEvent.connect((player, args) => ...)`
   - Client-side handler: `ClientEvents.myEvent.connect((args) => ...)`
3. Fire from the other side: `ServerEvents.myEvent.fire(args)` (client) / `ClientEvents.myEvent.fire(player, args)` (server).

## Rate limiting

Server-bound events are rate-limited per player via a token-bucket middleware. Defends against trivial flood/spam exploits — not a substitute for server-side validation.

- Middleware: [src/server/infra/network-rate-limit.ts](../../src/server/infra/network-rate-limit.ts)
- Pure logic: [src/server/infra/token-bucket.ts](../../src/server/infra/token-bucket.ts)
- Wired in: [src/server/infra/network.ts](../../src/server/infra/network.ts)

Each `(userId, eventName)` pair gets its own bucket. Excess events are dropped silently and a `warn` is logged on the server. Buckets release on `PlayerRemoving`. Per-event budgets live in `RATE_LIMITS` next to the middleware; events without an entry use `RATE_LIMITS.default` (30 capacity, 15/s refill).

When you add a new server-bound event, also attach `rateLimitMiddleware` in `ServerEvents.createServer({ middleware: ... })` and add a `RATE_LIMITS` entry if the default budget doesn't fit. Clients should debounce their own input — a dropped event will not retry.

## Don't

- Don't bypass the `network.ts` contract by creating raw RemoteEvents.
- Don't trust client-supplied data for anything valuable — validate server-side (use `@rbxts/t` for runtime checks).
- Don't fire high-frequency state updates as events — use Reflex (the broadcaster handles batching).
- Don't rely on rate-limit middleware as security — it stops obvious flooding, not crafted abuse. Validate inputs server-side regardless.
