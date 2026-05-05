# Asset Registry

> Status: done
> Level: system
> Phase: 1
> Depends on: (none — foundation)
> ADR needed: yes — `0003-asset-registry.md`

## Idea

Centralize every `rbxassetid` reference (icons, sounds, music, VFX, animations, images) in typed registries under `src/shared/domain/assets/`. Components and services consume keys (`Icons.coin`) instead of raw ids. Swapping an asset = one edit. Foundation for Sound, Music, VFX, Preload — they all index into these tables.

## API sketch

```ts
// shared/domain/assets/Icons.ts
export const Icons = {
  coin: "rbxassetid://1234",
  gem: "rbxassetid://5678",
  settings: "rbxassetid://...",
} as const;
export type IconKey = keyof typeof Icons;

// shared/domain/assets/Sounds.ts — rich object: volume + group baked in
export const Sounds = {
  click:    { id: "rbxassetid://...", group: "ui",  volume: 0.5 },
  purchase: { id: "rbxassetid://...", group: "ui",  volume: 0.7 },
  explosion:{ id: "rbxassetid://...", group: "sfx", volume: 1.0 },
} as const;
export type SoundKey = keyof typeof Sounds;

// shared/domain/assets/Music.ts — track + bpm + loop-points (optional)
export const Music = {
  menu:  { id: "rbxassetid://...", volume: 0.6, looped: true },
  combat:{ id: "rbxassetid://...", volume: 0.7, looped: true },
} as const;
export type MusicKey = keyof typeof Music;

// shared/domain/assets/VFX.ts — folder/name in ReplicatedStorage/VFX/
export const VFX = {
  hit:       { folder: "Combat", name: "Hit",       ttl: 1.5 },
  explosion: { folder: "Combat", name: "Explosion", ttl: 3.0 },
} as const;
export type VFXKey = keyof typeof VFX;

// shared/domain/assets/Animations.ts — rig-targeted ids
// shared/domain/assets/Images.ts — UI textures (move from shared/domain/Gui.ts)
// shared/domain/assets/index.ts — re-exports all of the above
```

`Icon` component prop changes: `asset: string | number` → `icon: IconKey`.

## Files

- `src/shared/domain/assets/Icons.ts` (new)
- `src/shared/domain/assets/Sounds.ts` (new, stubs)
- `src/shared/domain/assets/Music.ts` (new, stubs)
- `src/shared/domain/assets/VFX.ts` (new, stubs)
- `src/shared/domain/assets/Animations.ts` (new, stubs)
- `src/shared/domain/assets/Images.ts` (new — move `IMAGES` from `shared/domain/Gui.ts`)
- `src/shared/domain/assets/index.ts` (new)
- `src/client/ui/kit/components/icon/icon.tsx` (refactor: takes `IconKey`)
- `src/client/ui/kit/components/icon/icon.story.tsx` (update)
- `src/client/ui/features/currency/components/currency-frame.tsx` (use `Icons.coin`/`Icons.gem`)
- `docs/systems/assets.md` (new)
- `docs/adr/0003-asset-registry.md` (new)

## Dependencies

None. Phase 2/3/4 systems all depend on this.

## Decisions to make

- **D1: Value shape per registry.** A) raw strings, B) numeric ids, C) rich objects. **Rec: A for Icons/Images/Animations (simple), C for Sounds (group + volume needed anyway), C for Music (looped + volume), C for VFX (folder + ttl).**
- **D2: Backward compat in `Icon` for raw string/number?** **Rec: no.** Template — clean API beats compat shim.
- **D3: Where do Animations live at runtime?** Registry stores ids; loading/Animator track-creation handled by whoever needs them (services or hooks). Registry is just metadata.
- **D4: VFX values — full Instance path or folder+name?** **Rec: folder + name.** Lookup at runtime via `ReplicatedStorage.VFX.<folder>.<name>:Clone()`. Cleaner than full Instance refs in domain layer.

## Acceptance criteria

- [x] `Icons`, `Sounds`, `Music`, `VFX`, `Animations`, `Images` all exist with >=1 stub entry each
- [x] `Icon` component takes `icon: IconKey`, never raw `string | number`
- [x] `currency-frame` uses `Icons.coin` / `Icons.gem`
- [x] Grep for `rbxassetid://` returns hits ONLY inside `src/shared/domain/assets/` (plus theme typography font already there)
- [x] `npm run typecheck` + `npm run lint` clean
- [x] ADR `0003-asset-registry.md` written
- [x] `docs/systems/assets.md` written
- [x] `shared/domain/Gui.ts` `IMAGES` either moved to `Images.ts` or re-exports from there

## Retro

Landed 2026-05-05. Decisions taken per the recommendations: A for `Icons`/`Images`/`Animations`, C for `Sounds`/`Music`/`VFX`. No compat shim on `Icon` — the migration was small enough (kit Button, three stories, two features) that the strict break was painless. Wider blast radius than the spec listed: the kit `Button` itself took raw `leftIcon`/`rightIcon` numbers, plus three story files passed numeric ids; all converted to `IconKey`. `Gui.ts` ended up only with `HOLDER_PAGES` — its `IMAGES` content moved into `Icons.ts` (the existing entries were all icon-shaped) rather than `Images.ts`, which kept a placeholder for future UI textures. Currency → icon mapping lives in `currency-frame.tsx` as a small `Record<Currency, IconKey>` rather than a separate domain module — currency-local concern, not worth its own file.
