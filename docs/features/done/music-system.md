# Music System

> Status: done
> Level: system
> Phase: 1
> Depends on: `asset-registry`, `sound-system` (uses `Music` SoundGroup + volume settings)
> ADR: [0005-music-system.md](../../adr/0005-music-system.md)

## Idea

Background music with crossfading and a stack-based context model. Whoever wants music calls `music.push("combat")` — the previous track fades out, the new one fades in. `music.pop()` returns to the prior track. Simple state machine, no shared mutable globals. Volume routed through the `Music` SoundGroup created by `SoundController`.

## API sketch

```ts
// client/controllers/MusicController.ts (Flamework @Controller, depends on SoundController)
music.push("menu");                       // play, push to stack
music.push("combat", { fadeMs: 1500 });   // crossfade in
music.pop();                              // crossfade back to previous
music.replace("boss");                    // replace top of stack (no nesting)
music.stop();                             // clear stack, fade out
music.current(): MusicKey | undefined;
```

Default track auto-plays on `OnStart` (configurable — `DEFAULT_MUSIC` constant).

## Files

- `src/client/controllers/MusicController.ts` (new — `@Controller`)
- `src/shared/domain/music/stack.ts` (new — pure reducer for the stack state machine)
- `src/shared/domain/assets/Music.ts` (added `combat`, `boss` entries alongside `menu`)
- `src/shared/infra/network.ts` (added `playMusic: (key: MusicKey) => void`, server → client)
- `src/server/services/SoundService.ts` (added `playMusicFor(player, key)`)
- `src/server/cmdr/commands/playMusic.ts` + `playMusicServer.ts` + `types/musicKey.ts` (new)
- `src/server/tests/music/stack.spec.ts` (new — logic-only)
- `docs/systems/music.md` (new)
- `docs/adr/0005-music-system.md` (new)

## Dependencies

- `asset-registry` (`Music` registry) ✅
- `sound-system` (`Music` SoundGroup, `musicVolume` slice) ✅

## Decisions taken

- **D1: Crossfade via `TweenService`.** Two `Sound` instances tween volumes (linear easing). Outgoing destroys on `Tween.Completed`.
- **D2: Stack with cap of 4.** `push` past the cap drops the oldest entry. `pop` on empty is a no-op. `replace` swaps the top in place; on an empty stack it starts a new one.
- **D3: No `duck` API.** Out of scope — added trade-off note in the ADR for if/when a game needs it.
- **D4: No persistence.** Every join starts from `DEFAULT_MUSIC`.
- **D5: Auto-start on join via `OnStart`.** `DEFAULT_MUSIC = "menu"`; set to `undefined` to disable per-game.

## Acceptance criteria

- [x] `music.push("menu")` plays the menu track via Music SoundGroup
- [x] `music.push("combat")` crossfades from menu→combat over `fadeMs` (default 1000)
- [x] `music.pop()` crossfades back to menu
- [x] `music.stop()` clears stack and fades out to silence
- [x] `musicVolume` setting affects playback in real-time (already wired by sound-system)
- [x] `music.current()` returns the top of stack
- [x] Pure-logic test for the stack reducer passes
- [x] Cmdr `playMusic <key>` debug command (uses `replace`)
- [x] `npm run typecheck` + `npm run lint` clean
- [x] ADR + `docs/systems/music.md` written

## Retro

Landed 2026-05-05. Followed the spec cleanly. Two notes worth keeping:

- **Reducer split paid for itself immediately.** Putting the state machine in `shared/domain/music/stack.ts` made the test trivial — it runs without touching `TweenService` or `SoundService`. Same shape Reflex already uses elsewhere; no new mental model. The controller's job shrank to "play whatever's on top of whatever the reducer gave back," which made the crossfade code easy to read end-to-end.
- **Cmdr `playMusic` ended up as a server command + network event** rather than client-side Cmdr. The existing setup is server-only; adding a client Cmdr registry for one debug command would have been more invasive than `SoundService.playMusicFor(executor, key)` plus a `playMusic` network event the controller picks up and routes through `replace`. Documented in the ADR. The event is server→client only and not part of the public music API — feature code uses `Dependency<MusicController>().push(key)` directly.

Music ids in the registry are still `rbxassetid://0` placeholders — replace per game.
