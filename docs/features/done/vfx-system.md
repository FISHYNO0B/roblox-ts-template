# VFX System

> Status: done
> Level: system
> Phase: 1
> Depends on: `asset-registry` (`VFX` registry)
> ADR needed: yes — `0006-vfx-system.md` (decides Reflex slice vs Networking event)

## Idea

Server-authoritative VFX with client-side rendering. Server pushes effects into a Reflex slice (`effects: { id, kind, cframe, startedAt, ttl }[]`). Clients receive via the existing broadcaster, spawn from prebuilt models in `ReplicatedStorage/VFX/`, and auto-cleanup at `startedAt + ttl`. Camera-shake is a client-only API (no replication needed). Pool models when reused often.

## API sketch

```ts
// shared/infra/store/slices/effects.ts — new top-level slice (NOT in players/)
{
  list: Effect[];          // each effect: { id, kind: VFXKey, cframe, startedAt, ttl }
}
playEffect(kind, cframe);  // action — server-only dispatch
removeEffect(id);          // action — for early termination
expireEffects(now);        // action — cleanup pass

// server/services/VFXService.ts
vfx.play("hit", cframe);            // dispatches to store
vfx.playAttached("buff", instance); // attached to a Part — ttl-based detach

// client/services/VFXController.ts
// Subscribes to effects.list. On insert: spawn. On expire/remove: destroy.
// Plus client-only:
vfx.shake({ intensity: 0.5, duration: 0.3 });
vfx.shakeFromExplosion(position, radius);
```

`ReplicatedStorage/VFX/<folder>/<name>` holds the prebuilt particle/beam/attachment templates (built by hand in Studio). `VFXController` clones them on play, sets `CFrame`, schedules `Debris:AddItem(model, ttl)`.

## Files

- `src/shared/infra/store/slices/effects.ts` (new)
- `src/shared/infra/store/slices/index.ts` (register new slice)
- `src/server/services/VFXService.ts` (new — `@Service`)
- `src/client/services/VFXController.ts` (new — `@Controller`)
- `src/client/services/CameraShakeController.ts` (new, OR fold into VFXController — see D2)
- `src/server/cmdr/commands/playVFX.ts` + `playVFXServer.ts` (debug)
- `docs/systems/vfx.md` (new)
- `docs/adr/0006-vfx-system.md` (new)
- (test) `src/server/tests/vfx/expire.spec.ts` — `expireEffects` reducer test

## Dependencies

- `asset-registry` (`VFX` registry: folder + name + ttl)

## Decisions to make

- **D1: Reflex slice vs Networking event.** **Rec: Reflex slice.** Reasons: matches repo's existing replication pattern (broadcaster handles it for free); rejoin-resilient (joining mid-effect still sees it); easy server-tests. Cost: list grows during heavy combat — mitigate with periodic `expireEffects(now)` on the server (every 0.5s via RunService.Heartbeat).
- **D2: Camera-shake — separate controller or method on VFXController?** **Rec: method on VFXController.** Same domain. Avoid `services/`-bloat. Internal state (current shake offset) is private to the controller.
- **D3: Pooling.** **Rec: lazy pool per VFX-key.** First play clones template once, parents it inactive. Subsequent plays move + activate. Keeps cost flat for repeated effects.
- **D4: Effect IDs.** **Rec: server-generated UUID-ish (`HttpService:GenerateGUID(false)`).** Clients use it to track active effect instances.
- **D5: ttl from registry vs override.** **Rec: registry default, callable override.** `vfx.play("hit", cframe, { ttl: 5 })` overrides the default.
- **D6: Where do prebuilt VFX models live?** **Rec: `ReplicatedStorage/VFX/<folder>/<name>` (folder = category from registry).** Synced via Rojo from `assets/VFX/` if you want them in source control — but that's per-game, out of scope for template.

## Acceptance criteria

- [x] `effects` slice registered, broadcaster syncs to clients
- [x] `VFXService.play("hit", cframe)` dispatches; client clones model, positions, destroys after ttl
- [x] `vfx.shake({ intensity, duration })` shakes the camera locally; multiple shakes resolve to **max** (see ADR — additive option rejected)
- [x] Server periodic cleanup runs every 0.5s; expired effects removed from slice
- [x] Cmdr `playVFX <key>` debug works at the player's CFrame
- [x] At least 1 stub VFX template in `ReplicatedStorage/VFX/` referenced from `VFX` registry
- [x] Pool reuses model after second play of same key
- [x] Test: `expireEffects(now)` reducer removes effects with `startedAt + ttl < now`
- [x] `npm run typecheck` + `npm run lint` clean
- [x] ADR + `docs/systems/vfx.md` written

## Retro

Landed 2026-05-05. Decisions taken per the spec recommendations: Reflex slice (D1, with rejoin-resilience as the deciding factor over ADR 0001's "ephemeral signals stay as direct events" — ADR 0006 calls out the override explicitly). Camera shake folded onto `VFXController` rather than a separate controller (D2). Lazy per-key pool with no eviction (D3). Server-generated GUIDs (D4). Registry default ttl with optional override (D5). `ReplicatedStorage/VFX/<folder>/<name>` layout (D6).

**Multiple-shakes resolution:** ADR locks in **max** over additive — bounded under spam, no clipping risk. Spec left it open.

**Stub template via `assets/VFX/` rbxmx pipeline.** A new top-level `assets/` folder ships the rbxmx files; `default.project.json` mounts `assets/VFX` → `ReplicatedStorage/VFX`. Authoring flow: build effect in Studio → Save to File (rbxmx) → drop under `assets/VFX/<folder>/<name>.rbxmx`. Validated end-to-end with `rojo build` — the place file shows `ReplicatedStorage/VFX/Combat/Hit` populated. The stub `Hit.rbxmx` is a 1-stud transparent orange Part — placeholder visual until a game replaces it. The `VFXController` still creates `ReplicatedStorage/VFX` programmatically as a fallback so the system never crashes on a missing folder.

**Wider blast radius than the spec listed:**
- Added `selectors/effects.ts` (the spec only listed slices). Mirrors `selectors/client.ts` — keeps consumers from reaching into store internals.
- The Cmdr `playVFX` debug command needed a new `vfxKey` type registry alongside `musicKey` — straightforward parallel.

**No `playAttached` in v1.** Spec mentioned it; not in the criteria. Deferred — Instance refs don't replicate cleanly through Reflex actions, so it would need a parallel Networking-event path. Pick it up when a real use case arrives.
