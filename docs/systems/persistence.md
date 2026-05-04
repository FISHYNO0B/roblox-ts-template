# Persistence

How player data is loaded, kept in sync, and saved.

## Pieces

- **ProfileService** — the DataStore wrapper. Handles session locking, retries, reconcile on schema changes.
- **`PlayerDataService`** ([src/server/services/PlayerDataService.ts](../../src/server/services/PlayerDataService.ts)) — the only place that talks to ProfileService. Loads on join, releases on leave, mirrors into Reflex.
- **`serverStore` (Reflex)** — the live, in-memory source of truth during the session.
- **`defaultPlayerData`** ([src/shared/infra/store/slices/players/utils.ts](../../src/shared/infra/store/slices/players/utils.ts)) — the schema and the default values for new players. Used by `Reconcile()` to fill in fields added since a player last played.

## Lifecycle

1. Player joins → `PlayerDataService` calls `LoadProfileAsync`.
2. `Reconcile()` fills in any new fields added to `defaultPlayerData`.
3. Loaded data is dispatched into `serverStore` via `loadPlayerData`.
4. The service subscribes to that player's slice — every store change is mirrored back into `profile.Data`.
5. On leave → `Release()` flushes to the DataStore.

## Datastore name

`Production` in real games, `Testing` in Studio. This means **player data does not save in Studio** unless API access is enabled — that's by design, so you can't corrupt live data.

## Adding a persistent field

1. Add the field to `PlayerData` in [src/shared/infra/store/slices/players/types.ts](../../src/shared/infra/store/slices/players/types.ts).
2. Add a default to `defaultPlayerData` in [utils.ts](../../src/shared/infra/store/slices/players/utils.ts).
3. If it has actions, create a slice for it under `src/shared/infra/store/slices/players/`.
4. Register the slice in [players/index.ts](../../src/shared/infra/store/slices/players/index.ts).
5. `Reconcile()` will fill the field for existing players the next time they load.

## Don't

- Don't write to `profile.Data` directly — go through the store.
- Don't read from `profile.Data` to display things — read the store via selectors.
