# Preload + Loading Screen

> Status: inbox
> Level: feature
> Phase: 2
> Depends on: `asset-registry`
> ADR needed: no

## Idea

Block initial UI behind `ContentProvider:PreloadAsync` over the asset registries (Icons, Images, Sounds, Music). Show a styled loading screen using kit components while preload runs. Hide when done. Prevents first-frame flash of unloaded textures and removes the audio "first-play stutter" common in Roblox.

## API sketch

```ts
// client/controllers/PreloadController.ts (Flamework @Controller, OnStart)
async OnStart() {
  this.showSplash();
  const assets = collectAssetIds(); // from Icons + Images + Sounds + Music registries
  await this.preloadInBatches(assets, 50);
  this.hideSplash();
}

// client/ui/features/loading/loading-app.tsx — uses kit Card + ProgressBar
// Reads progress from a small client-only Reflex slice or a binding
```

Splash mounted as a sibling under `KitRoot` with high `ZIndex` until preload completes. State held in `client` slice (`loading.progress: 0..1`, `loading.done: boolean`).

## Files

- `src/client/controllers/PreloadController.ts` (new — `@Controller`)
- `src/shared/infra/store/slices/client/loading.ts` (new — progress slice; client-only, not broadcast)
- `src/shared/infra/store/slices/client/index.ts` (register)
- `src/client/ui/features/loading/loading-app.tsx` (new — uses kit Card, Heading, ProgressBar)
- `src/client/ui/shell/holder-app.tsx` (or `App.controller.tsx`) — gate main UI behind `loading.done`
- `docs/systems/preload.md` (short)

## Dependencies

- `asset-registry` (must exist before this; preload reads from registries)
- Kit `Card`, `ProgressBar`, `Heading` (already exist)

## Decisions to make

- **D1: Block all UI or overlay?** **Rec: overlay with progress, hide HolderApp until done.** Flicker-free.
- **D2: Batch size.** **Rec: 50 assets per `PreloadAsync` call.** Single huge call can hang yields; batches give progress updates.
- **D3: Failure policy.** **Rec: log warn, continue.** A missing asset shouldn't softlock join. ContentProvider returns synchronously even on failure.
- **D4: Should server gate as well?** **Rec: no.** Preload is client-side polish. Server logic doesn't wait.
- **D5: Min display time?** **Rec: no min — hide as soon as done.** Players hate artificial delays.
- **D6: Music/Sound preload — does it actually help?** Yes for first-play latency. **Rec: include them.**

## Acceptance criteria

- [ ] On join, splash screen shown immediately
- [ ] Progress bar advances as preload batches complete
- [ ] When preload done, splash hides, HolderApp visible
- [ ] No icon/image flashes at first paint of HolderApp
- [ ] First UI sound (button click) plays without stutter
- [ ] `loading.done = true` accessible via selector for any feature wanting to know
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] `docs/systems/preload.md` written
