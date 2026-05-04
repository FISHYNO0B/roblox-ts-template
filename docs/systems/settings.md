# Settings

Per-player on/off preferences, persisted with the rest of the profile. Currently `PvP` — placeholder.

## Pieces

- **Type:** [`Setting`](../../src/shared/domain/Settings.ts) — string union of setting names.
- **Storage:** in `playerData.settings: Record<Setting, boolean>`.
- **Slice:** [`settingsSlice`](../../src/shared/infra/store/slices/players/settings.ts) — actions: `loadPlayerData`, `closePlayerData`, `toggleSetting`.
- **Network event:** [`toggleSetting`](../../src/shared/infra/network.ts) — `client → server`.
- **Server handler:** [`SettingsService`](../../src/server/services/SettingsService.ts) — receives the event and dispatches `toggleSetting` on the store.
- **UI:** [`SettingsApp`](../../src/client/ui/features/settings/settings-app.tsx) — toggleable buttons.

## Adding a new setting

1. Add the name to the `Setting` union in [Settings.ts](../../src/shared/domain/Settings.ts).
2. Add a default boolean to `defaultPlayerData.settings`.
3. The existing `toggleSetting` event handles all settings — no new networking needed.
4. (Optional) Add a row in `SettingsApp` if it should be toggleable from the menu.

## Server-authority rule

The client fires `toggleSetting` — it doesn't mutate state directly. The server validates (currently trivial) and dispatches the store action; the change syncs back to the client via Reflex.
