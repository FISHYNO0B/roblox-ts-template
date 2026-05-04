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

## Don't

- Don't bypass the `network.ts` contract by creating raw RemoteEvents.
- Don't trust client-supplied data for anything valuable — validate server-side (use `@rbxts/t` for runtime checks).
- Don't fire high-frequency state updates as events — use Reflex (the broadcaster handles batching).
