# Assets

Every `rbxassetid` reference in the project lives in a typed registry under [`src/shared/domain/assets/`](../../src/shared/domain/assets/). Components and services consume keys, never raw ids.

See [ADR 0003](../adr/0003-asset-registry.md) for why.

## Registries

| Registry | Value shape | Used for |
|---|---|---|
| [`Icons`](../../src/shared/domain/assets/Icons.ts) | `string` (full `rbxassetid://...`) | UI icons rendered via `<Icon icon="…" />` |
| [`Images`](../../src/shared/domain/assets/Images.ts) | `string` | UI textures (backgrounds, illustrations) |
| [`Animations`](../../src/shared/domain/assets/Animations.ts) | `string` | Animation track ids (rig-targeted, loaded by services) |
| [`Sounds`](../../src/shared/domain/assets/Sounds.ts) | `{ id, group, volume }` | One-shot SFX — `group: "ui" \| "sfx"` |
| [`Music`](../../src/shared/domain/assets/Music.ts) | `{ id, volume, looped }` | Music tracks |
| [`VFX`](../../src/shared/domain/assets/VFX.ts) | `{ folder, name, ttl }` | Particle/effect templates under `ReplicatedStorage/VFX/<folder>/<name>` |

All re-exported from [`shared/domain/assets/index.ts`](../../src/shared/domain/assets/index.ts).

## Adding an asset

1. Pick the right registry by what consumes it (UI icon → `Icons`; one-shot SFX → `Sounds`; music loop → `Music`; etc.).
2. Add an entry. Keys are camelCase (`coin`, `bossSpawn`), values follow the registry's shape.
3. Use it via the typed key — `<Icon icon="coin" />`, `Sounds.click`, `VFX.hit`.

Sounds, Music, and VFX entries currently ship with `rbxassetid://0` placeholders — replace with real ids per game.

## Using assets

```tsx
import { Icon } from "client/ui/kit";

<Icon icon="coin" size={32} color="warning" />
```

```ts
import { Sounds, VFX } from "shared/domain/assets";

const click = Sounds.click;          // { id, group, volume }
const hit = VFX.hit;                 // { folder, name, ttl }
```

The `Icon` component takes `icon: IconKey` — there is no fallback for raw strings or numbers. Any new icon must be added to `Icons.ts` first.

## Don't

- Don't write `"rbxassetid://..."` strings in components or services. The only place that should appear is inside `src/shared/domain/assets/`. (The kit's typography font in [theme/typography.ts](../../src/client/ui/kit/theme/typography.ts) is the one exception — fonts are loaded via `Font.fromId`, not the same lookup path.)
- Don't pass raw numbers to `<Icon>`. Add an entry to `Icons.ts` and use the key.
- Don't invent ad-hoc shapes for asset metadata in feature code. If a system needs more fields per asset, extend the registry's value type.

## Related

- [Sound system](sound-system.md) *(planned)* — indexes into `Sounds`.
- [Music](music.md) — indexes into `Music`.
- [VFX system](vfx-system.md) *(planned)* — indexes into `VFX`.
- [Preload / loading screen](preload-loading-screen.md) *(planned)* — preloads every id in the registries on join.
