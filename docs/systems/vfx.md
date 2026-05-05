# VFX

Server-authoritative visual effects with client-side rendering. Effects are dispatched into a Reflex slice, replicated by the broadcaster, and rendered by `VFXController` from prebuilt templates in `ReplicatedStorage/VFX/`. Camera shake is a separate, client-only API on the same controller.

See [ADR 0006](../adr/0006-vfx-system.md) for why a slice and not a one-shot event.

## Pieces

- **Registry:** [`VFX`](../../src/shared/domain/assets/VFX.ts) — `{ folder, name, ttl }` per key. `folder` + `name` are looked up under `ReplicatedStorage/VFX/`.
- **Slice:** [`effects`](../../src/shared/infra/store/slices/effects.ts) — top-level `effects.list: Effect[]`. Actions: `playEffect(effect)`, `removeEffect(id)`, `expireEffects(now)`.
- **Selector:** [`selectEffects`](../../src/shared/infra/store/selectors/effects.ts).
- **Server service:** [`VFXService`](../../src/server/services/VFXService.ts) — `play(kind, cframe, options?)` returns the effect id; `stop(id)` removes early. A `Heartbeat` loop dispatches `expireEffects(now)` every 0.5s.
- **Client controller:** [`VFXController`](../../src/client/controllers/VFXController.ts) — subscribes to the slice, clones templates, pools per-key, and exposes `shake({ intensity, duration })` + `shakeFromExplosion(pos, radius)`.
- **Templates:** `ReplicatedStorage/VFX/<folder>/<name>` — any `PVInstance` (Part, Model, Attachment-parent). The controller calls `:PivotTo(cframe)`. Source files live under [`assets/VFX/<folder>/<name>.rbxmx`](../../assets/VFX/) and are mounted by Rojo.
- **Cmdr:** `playVFX <key>` — plays at the executor's `HumanoidRootPart`. See [`playVFX.ts`](../../src/server/cmdr/commands/playVFX.ts).

## Lifecycle

```
server                                   client
─────────────────────                    ────────────────────────
VFXService.play("hit", cf)
  → store.playEffect({…})       ┐
                                ├──► broadcaster ──► receiver
                                │                     │
                                │                     ▼
                                │       subscribe diff ► spawn
                                │       (clone or pool-pop, PivotTo, parent → Workspace)
                                │
Heartbeat every 0.5s            │
  → store.expireEffects(now) ───┘
                                          subscribe diff ► despawn
                                          (parent → VFXPool, push back into pool)
```

## Playing an effect

### Server-triggered (every client renders it, late joiners too)

```ts
import { Dependency } from "@flamework/core";
import { VFXService } from "server/services/VFXService";

const id = Dependency<VFXService>().play("hit", part.CFrame);
Dependency<VFXService>().play("explosion", cframe, { ttl: 5 });
Dependency<VFXService>().stop(id); // optional early termination
```

### Camera shake (client-only, no replication)

```ts
import { Dependency } from "@flamework/core";
import { VFXController } from "client/controllers/VFXController";

Dependency<VFXController>().shake({ intensity: 0.5, duration: 0.3 });
Dependency<VFXController>().shakeFromExplosion(position, 60);
```

Multiple concurrent shakes resolve as **max intensity** of active shakes — bounded by design. See ADR for the alternative (additive) and why max won.

## Adding a VFX

1. Build the model in Studio under any throwaway parent. Right-click → **Save to File** as `.rbxmx`.
2. Move the file to `assets/VFX/<folder>/<name>.rbxmx` — `<folder>` and `<name>` are arbitrary; the registry decides the lookup path. Rojo syncs `assets/VFX/` → `ReplicatedStorage/VFX/`.
3. Add an entry to [`VFX.ts`](../../src/shared/domain/assets/VFX.ts): `{ folder: "Combat", name: "Hit", ttl: 1.5 }`.
4. Call `VFXService.play("yourKey", cframe)` from your service. TypeScript will autocomplete from `VFXKey`.

## Pooling

First play of a key clones from the template. On TTL the clone is reparented under `ReplicatedStorage/VFXPool` and pushed onto a per-key stack. Next play of the same key pops from the stack — no clone. Pool is unbounded; if a game spawns hundreds of unique keys add an LRU cap (see ADR trade-offs).

## Don't

- Don't dispatch `playEffect` from the client. Server is authoritative; `VFXService.play` is the only sanctioned entry point.
- Don't bypass the controller and `:Clone()` templates yourself in feature code — pooling and lifecycle leak otherwise.
- Don't put per-effect logic (damage, knockback, particle randomization) inside the template lookup path. Templates are dumb visuals; gameplay belongs server-side.
- Don't replicate `vfx.shake` — it's local feedback. If you want a "shake everyone in radius," dispatch a slice action carrying the explosion CFrame and let each client decide its own falloff.

## Related

- [Asset registry](assets.md) — where VFX template paths live.
- [Sound](sound.md) — same shape (registry + service + controller), different replication path (Networking event vs Reflex slice). ADR 0006 explains why VFX needs the slice.
