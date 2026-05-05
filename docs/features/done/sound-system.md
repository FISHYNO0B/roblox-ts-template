# Sound System

> Status: done
> Level: system
> Phase: 1
> Depends on: `asset-registry`
> ADR: [0004-sound-system.md](../../adr/0004-sound-system.md)

## Idea

Centralized SFX/UI playback via a Flamework `@Controller` on the client. Sounds are addressed by key from the asset registry, routed through `SoundService.SoundGroup` instances (`SFX`, `UI`, `Music`, `Ambience`), with volumes wired to player settings (Reflex). Server can trigger replicated SFX via a Flamework Networking event — server sends a key + position, client plays locally. Server never streams audio bytes.

## API sketch

```ts
// client/controllers/SoundController.ts (Flamework @Controller)
sounds.play("click");                                  // 2D, UI group
sounds.play("purchase", { volume: 0.5 });              // override
sounds.playAt("explosion", cframeOrPosition);          // 3D positional, SFX group
sounds.stop("ambience");                               // for loops
sounds.preload();                                      // ContentProvider:PreloadAsync, called once

// shared/infra/network.ts — new event
playSoundAt: (key: SoundKey, position: Vector3) => void; // server → client
setVolume:   (group: VolumeGroup, value: number) => void; // client → server
```

Volume settings live in a new `players/<id>/settings.volumes` sub-object:
```ts
{ master: number, sfx: number, music: number, ambience: number } // 0..1 each
```

`SoundController` subscribes via `clientStore.subscribe`, sets `SoundGroup.Volume` on changes.

## Files

- `src/client/controllers/SoundController.ts` (new — `@Controller`)
- `src/server/services/SoundService.ts` (new — `replicate(key, pos)` + `replicateTo(player, key, pos)`)
- `src/server/services/SettingsService.ts` (extended — handles `setVolume`)
- `src/shared/infra/network.ts` (added `playSoundAt`, `setVolume`)
- `src/shared/domain/Settings.ts` (restructured — `SETTINGS` now only `["PvP"]`, new `VOLUME_GROUPS`)
- `src/shared/infra/store/slices/players/settings.ts` (split `toggles` + `volumes`, new `setVolume` action with clamp)
- `src/shared/infra/store/slices/players/types.ts` + `utils.ts` (new shape)
- `src/shared/infra/store/selectors/players.ts` (new `selectPlayerVolume`/`selectPlayerVolumes`)
- `src/server/cmdr/commands/setVolume.ts` + `setVolumeServer.ts` + `types/volumeGroup.ts`
- `src/client/ui/features/settings/settings-app.tsx` (4 sliders + 1 toggle)
- `src/client/ui/features/settings/components/volume-slider.tsx` (new)
- `src/server/tests/sound/replicate.spec.ts`
- `docs/systems/sound.md` (new)
- `docs/systems/settings.md` (updated for new shape)
- `docs/adr/0004-sound-system.md` (new)

## Dependencies

- `asset-registry` (Sounds key + group + default volume) ✅

## Decisions taken

- **D1: SoundGroups bootstrapped at runtime in `SoundController.onInit`.** All four groups created under `SoundService` if missing. No Studio prereq.
- **D2: Per-key Sound cache.** First `play(key)` creates and parents a Sound; subsequent plays reuse and restart it. Positional `playAt` always creates a fresh Part+Sound + cleans up via `Sound.Ended` + `Debris` fallback.
- **D3: Flamework Networking event for server-triggered SFX.** No Reflex slice for one-shots.
- **D4: Linear volumes 0..1, passed straight through.** No log curve.
- **D5: Mute = volume === 0.** No separate boolean. The dead `"Play Music"` and `"Sound Effects"` toggles got dropped.

## Acceptance criteria

- [x] `sounds.play("click")` plays via UI SoundGroup with `Sounds.click.volume * masterVolume` (no `uiVolume` slider — UI tracks master only, per the "4 sliders" criterion)
- [x] `sounds.playAt("explosion", pos)` creates a 3D positional Sound at pos that auto-cleans up
- [x] Server-side `SoundService.replicate("explosion", pos)` fires the event and all clients hear it positionally
- [x] Settings page has 4 sliders (master/SFX/music/ambience), persisted to ProfileService
- [x] Changing slider updates `SoundGroup.Volume` instantly (controller subscribes to volumes selector)
- [x] Cmdr `setVolume <player> <group> <0..1>` works
- [x] Test: volume slice round-trips, clamps; `SoundService.replicate` doesn't throw broadcasting with no players
- [x] `npm run typecheck` + `npm run lint` clean
- [x] ADR + `docs/systems/sound.md` written

## Retro

Landed 2026-05-05. Followed the spec's recommendations cleanly. Two divergences worth noting:

- **`uiVolume` doesn't exist as a setting.** The spec's API sketch listed 4 sliders (master/SFX/music/ambience) but the acceptance criteria mentioned `uiVolume * masterVolume` for the click formula. Resolved by routing the UI SoundGroup to `master` only — UI clicks shouldn't be tied to the SFX slider (you'd want them audible even with SFX muted) and a 5th slider felt like overreach for a template. If a game wants finer control, adding `"ui"` to `VOLUME_GROUPS` is a one-line change plus a row in `SettingsApp`.
- **`PlayerSettings` shape break.** Splitting into `{ toggles, volumes }` was the right move — the `Record<Setting, boolean>` shape couldn't hold numeric volumes without ugly union types. Cost was touching every selector + the `getDefaultPlayerData` helper + `setting-button.tsx` (which now reads `settings.toggles[s]`). ProfileService.Reconcile fills in the new keys for old saves; orphaned `"Play Music"`/`"Sound Effects"` keys hang around until cleanup. Documented in the ADR.

The volume slice clamp lives in the slice action (`clampVolume(0..1)`), not the controller — keeps the invariant at the source of truth and means any caller (UI, Cmdr, server-side automation) gets the same guarantee.

The `SoundController` lives at `src/client/controllers/` (which didn't exist before — Flamework was scanning the path empty). First Flamework `@Controller` in the template; pattern mirrors existing services.
