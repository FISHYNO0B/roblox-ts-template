# Sound

Client-owned SFX/UI playback driven by the typed [`Sounds`](../../src/shared/domain/assets/Sounds.ts) registry. Volumes are per-player Reflex state, persisted with the rest of the profile.

See [ADR 0004](../adr/0004-sound-system.md) for why.

## Pieces

- **Registry:** [`Sounds`](../../src/shared/domain/assets/Sounds.ts) — `{ id, group, volume }` per key. `group` is `"ui" | "sfx"`.
- **Controller:** [`SoundController`](../../src/client/controllers/SoundController.ts) — `play`, `playAt`, `stop`, `preload`. Bootstraps `UI`, `SFX`, `Music`, `Ambience` `SoundGroup` instances under `SoundService` on `OnInit`.
- **Server service:** [`SoundService`](../../src/server/services/SoundService.ts) — `replicate(key, pos)` broadcasts a `playSoundAt` event so every client plays the SFX positionally.
- **Network event:** [`playSoundAt`](../../src/shared/infra/network.ts) — `server → client`, args `(SoundKey, Vector3)`.
- **Volume slice:** keys live in [`PlayerSettings.volumes`](../../src/shared/infra/store/slices/players/types.ts) — `master | sfx | music | ambience`, each `0..1`. Dispatched via `serverStore.setVolume(playerId, group, value)`.
- **Volume network event:** [`setVolume`](../../src/shared/infra/network.ts) — `client → server`, fired by the settings UI.
- **UI:** [`SettingsApp`](../../src/client/ui/features/settings/settings-app.tsx) — four `VolumeSlider`s, one `SettingButton` for `PvP`.
- **Cmdr:** `setVolume <player> <group> <0..1>` — see [`setVolume.ts`](../../src/server/cmdr/commands/setVolume.ts).

## Volume routing

```
SoundGroup.UI.Volume       = master
SoundGroup.SFX.Volume      = master * sfx
SoundGroup.Music.Volume    = master * music
SoundGroup.Ambience.Volume = master * ambience

Sound.Volume = Sounds[key].volume          // per-key default
             * (options.volume ?? 1)        // optional play-time override
```

Final loudness is the product of the two (`SoundGroup.Volume × Sound.Volume`). Mute = slider snapped to 0.

## Playing a sound

### Client-only (UI clicks, local feedback)

```ts
import { Dependency } from "@flamework/core";
import { SoundController } from "client/controllers/SoundController";

Dependency<SoundController>().play("click");
Dependency<SoundController>().play("purchase", { volume: 0.5 });
Dependency<SoundController>().playAt("explosion", new Vector3(0, 50, 0));
Dependency<SoundController>().stop("ambience");
```

### Server-triggered, all clients hear it

```ts
import { Dependency } from "@flamework/core";
import { SoundService } from "server/services/SoundService";

Dependency<SoundService>().replicate("explosion", part.Position);
Dependency<SoundService>().replicateTo(player, "purchase", part.Position);
```

The server only sends a key + position. Clients look up the asset locally — no audio bytes traverse the network.

## Adding a sound

1. Add an entry to [`Sounds.ts`](../../src/shared/domain/assets/Sounds.ts) with the `rbxassetid://`, `group`, and default `volume`.
2. Use the key — `sounds.play("yourKey")`. TypeScript will autocomplete from `SoundKey`.
3. If it's server-triggered, call `SoundService.replicate(key, pos)` from your service.

## Don't

- Don't create `Sound` instances by hand in feature code. Always go through the controller — otherwise volume sliders won't apply.
- Don't add per-game one-shot SFX as Reflex actions. The store is for state that needs to survive a rejoin; sound plays don't.
- Don't trust client-fired sound events for gameplay. The server-triggered path exists so the server stays authoritative.

## Related

- [Asset registry](assets.md) — where sound ids live.
- [Settings](settings.md) — volume sliders share the same `PlayerSettings` shape as the boolean toggles.
- [Music](music.md) — binds to the `Music` SoundGroup bootstrapped here.
