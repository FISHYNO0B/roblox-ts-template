# State (Reflex)

Reflex is the single source of truth for everything the UI needs to react to. Server state lives in `serverStore`, client state lives in `clientStore`, and most of `serverStore` is mirrored into `clientStore` automatically.

## Shape

- `players` slice — server's view of every connected player's data (balances, settings).
- `client` slice — client-only UI state (e.g. which holder page is open).

The two stores share the same root shape (`SharedState`) so selectors work identically on both sides.

## Sync mechanism

- Server uses a **broadcaster** middleware ([src/server/infra/store/middleware/broadcaster.ts](../../src/server/infra/store/middleware/broadcaster.ts)) — every state-changing action is sent to clients via `ClientEvents.reflex.dispatch`.
- Client uses a **receiver** middleware ([src/client/infra/store/middleware/receiver.ts](../../src/client/infra/store/middleware/receiver.ts)) — applies incoming actions to `clientStore`.
- New clients hydrate via `ClientEvents.reflex.hydrate` (full state snapshot).

## Slices

A slice = a piece of state + the actions that change it. Created with `createProducer`.

```ts
export const balanceSlice = createProducer(initialState, {
    loadPlayerData: (state, playerId, data) => ({ ...state, [playerId]: data.balance }),
    changeBalance:  (state, playerId, currency, amount) => { /* return new state */ },
});
```

**Rules:**
- Never mutate state. Always return a new object (`{ ...state, ... }`).
- Action names become methods on the store: `serverStore.changeBalance(...)`.

## Reading state

- **In React:** `useSelector(selectHolderPage)` — re-renders when the selected slice changes.
- **In server code:** `serverStore.getState(selectPlayerBalance(playerId, "Coins"))` for one-shot reads, or `serverStore.subscribe(selector, callback)` for reactive reads.

## Adding a slice

1. Create the slice file under `src/shared/infra/store/slices/<scope>/<name>.ts`.
2. Add it to the slice map in [src/shared/infra/store/index.ts](../../src/shared/infra/store/index.ts).
3. (Optional) Add selectors under `src/shared/infra/store/selectors/`.
