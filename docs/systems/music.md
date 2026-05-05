# Music

Background music with crossfading and a stack-based context model. Whoever wants music calls `music.push("combat")` — the previous track fades out, the new one fades in. `music.pop()` returns to the prior track. Volume is routed through the `Music` `SoundGroup` bootstrapped by [`SoundController`](../../src/client/controllers/SoundController.ts).

See [ADR 0005](../adr/0005-music-system.md) for why.

## Pieces

- **Registry:** [`Music`](../../src/shared/domain/assets/Music.ts) — `{ id, volume, looped }` per key.
- **Controller:** [`MusicController`](../../src/client/controllers/MusicController.ts) — `push`, `pop`, `replace`, `stop`, `current`. Listens to the `playMusic` network event for the Cmdr debug command.
- **Pure stack reducer:** [`shared/domain/music/stack.ts`](../../src/shared/domain/music/stack.ts) — `applyMusicStackOp(stack, op)` and `topOfMusicStack(stack)`. The controller delegates here so the state-transition logic is unit-testable.
- **Network event:** [`playMusic`](../../src/shared/infra/network.ts) — `server → client`, args `(MusicKey)`. Used by the Cmdr `playMusic` command; not intended as a general-purpose channel.
- **Cmdr:** `playMusic <key>` — see [`playMusic.ts`](../../src/server/cmdr/commands/playMusic.ts). Calls `replace` on the executor's controller.
- **Volume:** `musicVolume` lives in [`PlayerSettings.volumes`](../../src/shared/infra/store/slices/players/types.ts) (already wired by the [sound system](sound.md)). Changing the slider updates `SoundGroup.Music.Volume` reactively — no music-system code needed.

## Stack model

The controller owns a stack of `MusicKey`s. Each op transitions the top:

```
push("menu")             → stack = [menu]               playing menu
push("combat")           → stack = [menu, combat]       crossfade → combat
push("boss")             → stack = [menu, combat, boss] crossfade → boss
pop()                    → stack = [menu, combat]       crossfade → combat
pop()                    → stack = [menu]               crossfade → menu
replace("credits")       → stack = [credits]            crossfade → credits
stop()                   → stack = []                   fade to silence
```

The stack is capped at 4 entries to prevent leaks. Pushing past the cap drops the oldest entry. `pop` on an empty stack is a no-op.

## API

```ts
import { Dependency } from "@flamework/core";
import { MusicController } from "client/controllers/MusicController";

const music = Dependency<MusicController>();

music.push("menu");                       // play, push to stack
music.push("combat", { fadeMs: 1500 });   // crossfade in over 1.5s
music.pop();                              // crossfade back to previous
music.replace("boss");                    // replace top of stack
music.stop();                             // clear stack, fade out
music.current();                          // → MusicKey | undefined
```

`fadeMs` defaults to 1000. `MusicController.onStart` auto-pushes `DEFAULT_MUSIC` (currently `"menu"`); set the constant to `undefined` in [`MusicController.ts`](../../src/client/controllers/MusicController.ts) to disable autoplay per-game.

## Crossfade

Two `Sound` instances exist during a transition: the outgoing one tweens to volume `0` and is destroyed on `Tween.Completed`; the incoming one is created at volume `0` and tweens up to `entry.volume`. Both run on `TweenService` with linear easing. `entry.volume` is the per-track default from the registry — final loudness is `SoundGroup.Music.Volume × Sound.Volume`, same model as SFX.

## Adding a track

1. Add an entry to [`Music.ts`](../../src/shared/domain/assets/Music.ts) with the `rbxassetid://`, default `volume`, and `looped`.
2. Use the key — `music.push("yourKey")`. TypeScript will autocomplete from `MusicKey`.

## Don't

- Don't create `Sound` instances for music in feature code. Always go through the controller — otherwise crossfades, the stack, and the music volume slider won't apply.
- Don't push the same key twice expecting a re-trigger. The current track will fade out and a fresh sound will fade in, but the stack will contain duplicates. Use `replace` to swap the top in place.
- Don't store the current track in the Reflex store. Cross-session music state is overkill — every join starts from `DEFAULT_MUSIC`.

## Related

- [Sound](sound.md) — bootstraps the `Music` SoundGroup and owns the volume slider.
- [Asset registry](assets.md) — where music ids live.
- [Settings](settings.md) — `musicVolume` slider routes through the same `PlayerSettings` shape as SFX.
