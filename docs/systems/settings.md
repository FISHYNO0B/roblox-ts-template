# Settings

Per-player preferences, persisted with the rest of the profile. Two kinds: boolean **toggles** (currently just `PvP`) and numeric **volumes** (`master`, `sfx`, `music`, `ambience`, all `0..1`).

## Pieces

- **Types:** [`Setting`](../../src/shared/domain/Settings.ts) — string union of toggle names. [`VolumeGroup`](../../src/shared/domain/Settings.ts) — string union of volume group names.
- **Storage:** in `playerData.settings`, shaped as `{ toggles: Record<Setting, boolean>; volumes: Record<VolumeGroup, number> }`.
- **Slice:** [`settingsSlice`](../../src/shared/infra/store/slices/players/settings.ts) — actions: `loadPlayerData`, `closePlayerData`, `toggleSetting`, `setVolume` (clamps to `0..1`).
- **Network events:** [`toggleSetting`](../../src/shared/infra/network.ts) and [`setVolume`](../../src/shared/infra/network.ts) — both `client → server`.
- **Server handler:** [`SettingsService`](../../src/server/services/SettingsService.ts) — receives both events and dispatches the matching store action.
- **UI:** [`SettingsApp`](../../src/client/ui/features/settings/settings-app.tsx) — `VolumeSlider` rows for each volume group, `SettingButton` rows for each toggle.

## Adding a new toggle

1. Add the name to the `SETTINGS` tuple in [Settings.ts](../../src/shared/domain/Settings.ts).
2. Default value comes from `getDefaultPlayerData()` in [`utils.ts`](../../src/shared/infra/store/slices/players/utils.ts) (defaults to `false`).
3. The existing `toggleSetting` event handles all toggles — no new networking needed.
4. (Optional) Add a row in `SettingsApp` if it should be toggleable from the menu.

## Adding a new volume group

1. Add the name to `VOLUME_GROUPS` in [Settings.ts](../../src/shared/domain/Settings.ts).
2. Wire the new group inside [`SoundController.applyVolumes`](../../src/client/controllers/SoundController.ts) so it actually controls something.
3. (Optional) Add a `VolumeSlider` row in `SettingsApp`.

## Server-authority rule

The client fires `toggleSetting` / `setVolume` — it doesn't mutate state directly. The server validates (currently trivial — `setVolume` clamps to `0..1` in the slice), dispatches the store action, and the change syncs back to the client via Reflex.

## Related

- [Sound system](sound.md) — `volumes.*` drive the four `SoundGroup` instances.
