# UI Kit

> Status: done
> Level: system
> Completed: 2026-05-05

## Idea

A reusable, theme-driven UI library for this template — modeled on shadcn/ui — that replaces `client/ui/primitives/`. Token-based theme (colors 50–950, semantic tokens, spacing, radius, typography, motion, gradients), a small variant helper, motion hooks on top of `@rbxts/ripple`, and a story per component in UI Labs. Dark-only. Default font: `BuilderExtended ExtraBold` (`rbxassetid://16658237174`).

## Problem

The current `primitives/` are thin passthrough wrappers around Roblox JSX intrinsics with hardcoded cartoon defaults (5px UIStroke, 22px corner radius, `FredokaOne`, a 4-color palette in `shared/domain/Gui.ts`). There is no theme system, no variants, no shared state/animation conventions, and no organized story layout. Every new feature ends up reinventing the look or fighting the defaults.

## Scope

**In scope:**
- New `client/ui/kit/` directory with theme, motion, components, stories
- Theme tokens: color scales (50–950), semantic tokens, radius, spacing, typography (single font), motion durations/easings, named gradients
- `<ThemeProvider>` + `useTheme()` hook (React context)
- `<KitRoot>` — replaces the `<ScreenGui>` wrapper pattern; mounts ScreenGui + UIScale + ThemeProvider
- `variant()` helper for typed variant/size/tone props
- Motion hooks: `useSpring`, `useHover`, `usePress`, `usePressScale` (wrapping `@rbxts/ripple`)
- Components (~17 across 4 waves): see Plan
- Story per component (variants + states + animations) using UI Labs `controls`
- `kitchen-sink.story.tsx` showing tokens + every component on one canvas
- Migration of `currency`, `settings`, `buttons`, `holder` features off old primitives
- Removal of `client/ui/primitives/` after migration completes
- Updated `docs/systems/ui.md`

**Out of scope:**
- Light mode (dark-only per decision)
- Multi-theme switching at runtime
- A second cartoony preset
- Shadcn parity beyond aesthetic — we don't ship every shadcn component, only the list below
- New gameplay features

## Plan

### Architecture

```
src/client/ui/kit/
├── theme/
│   ├── colors.ts        ← scales (slate 50–950, plus accents) + semantic tokens
│   ├── radius.ts        ← sm/md/lg/xl/full
│   ├── spacing.ts       ← 0/1/2/3/4/6/8/12/16 (px)
│   ├── typography.ts    ← FontFace + size scale (xs/sm/base/lg/xl/2xl/3xl)
│   ├── motion.ts        ← durations + spring presets (gentle, snappy, bouncy)
│   ├── gradients.ts     ← named gradients (primary, accent, surface, shimmer)
│   ├── theme.ts         ← composes the dark theme
│   ├── provider.tsx     ← ThemeProvider + useTheme
│   └── index.ts
├── motion/
│   ├── use-spring.ts
│   ├── use-hover.ts
│   ├── use-press.ts
│   ├── use-press-scale.ts
│   └── index.ts
├── core/
│   └── variant.ts       ← variant() helper
├── components/
│   ├── kit-root/        ← <KitRoot> ScreenGui + UIScale + ThemeProvider
│   ├── button/
│   ├── card/
│   ├── box/             ← themed Frame replacement
│   ├── text/            ← Text + Heading
│   ├── stack/           ← VStack / HStack
│   ├── separator/
│   ├── icon/
│   ├── badge/
│   ├── scroll-area/
│   ├── toggle/
│   ├── slider/
│   ├── text-input/
│   ├── checkbox/
│   ├── progress-bar/
│   ├── avatar/
│   ├── tabs/
│   ├── skeleton/
│   ├── dialog/
│   ├── tooltip/
│   └── toast/
├── stories/
│   ├── fixtures.ts      ← shared preview data (avatar urls, fake balances)
│   └── kitchen-sink.story.tsx
└── index.ts             ← re-exports
```

Each component folder: `<name>.tsx` + `<name>.story.tsx`. Stories use UI Labs `controls` so props can be tweaked at runtime.

### Waves (one PR per wave)

- **Wave 1 — Foundation:** theme tokens, ThemeProvider, motion hooks, `variant()`, `<KitRoot>`, kitchen-sink skeleton, `kit/index.ts`. No user-facing components yet.
- **Wave 2 — Core:** Button, Card, Box, Text/Heading, Stack, Separator, Icon, Badge, ScrollArea + stories.
- **Wave 3 — Form + Display:** Toggle, Slider, TextInput, Checkbox, ProgressBar, Avatar, Tabs, Skeleton + stories.
- **Wave 4 — Overlays + migration:** Dialog, Tooltip, Toast + stories. Migrate `currency`, `settings`, `buttons`, `holder`. Delete `client/ui/primitives/`. Update `docs/systems/ui.md`.

### Conventions

- Filenames: `kebab-case.tsx` (matches CLAUDE.md, breaks the legacy `containerFrame.tsx` pattern intentionally — old files are deleted, not renamed).
- Component exports: `PascalCase` default export.
- All components consume tokens via `useTheme()` — no hardcoded colors, sizes, or fonts inside component files.
- Variants declared with the `variant()` helper, never inline if/else chains.
- Motion: every interactive component uses ripple-backed hooks for hover/press, never raw `TweenService`.
- Stories: one `.story.tsx` per component, exporting `controls` for the interesting props.

## Tasks

### Wave 1 — Foundation
- [ ] Add `@rbxts/ripple` to dependencies
- [ ] `kit/theme/colors.ts` (scales + semantic tokens)
- [ ] `kit/theme/radius.ts`
- [ ] `kit/theme/spacing.ts`
- [ ] `kit/theme/typography.ts` (BuilderExtended ExtraBold FontFace)
- [ ] `kit/theme/motion.ts`
- [ ] `kit/theme/gradients.ts`
- [ ] `kit/theme/theme.ts`
- [ ] `kit/theme/provider.tsx` + `useTheme`
- [ ] `kit/motion/{use-spring,use-hover,use-press,use-press-scale}.ts`
- [ ] `kit/core/variant.ts`
- [ ] `kit/components/kit-root/kit-root.tsx`
- [ ] `kit/stories/kitchen-sink.story.tsx` (skeleton — palette + spacing + typography only)
- [ ] `kit/index.ts`
- [ ] `npm run typecheck` + `npm run lint` clean

### Wave 2 — Core
- [ ] Button (variant: solid/outline/ghost/destructive, size: sm/md/lg)
- [ ] Card (with optional header/footer)
- [ ] Box (themed Frame replacement)
- [ ] Text + Heading
- [ ] Stack (VStack / HStack with spacing token prop)
- [ ] Separator
- [ ] Icon (asset-id wrapper)
- [ ] Badge (variant: default/secondary/destructive/outline)
- [ ] ScrollArea
- [ ] Stories for each
- [ ] Kitchen-sink updated

### Wave 3 — Form + Display
- [ ] Toggle / Switch
- [ ] Slider
- [ ] TextInput
- [ ] Checkbox
- [ ] ProgressBar
- [ ] Avatar
- [ ] Tabs
- [ ] Skeleton (loading)
- [ ] Stories for each
- [ ] Kitchen-sink updated

### Wave 4 — Overlays + migration
- [ ] Dialog / Modal
- [ ] Tooltip
- [ ] Toast / Notification
- [ ] Stories for each
- [ ] Migrate `client/ui/features/currency/` to kit
- [ ] Migrate `client/ui/features/settings/` to kit
- [ ] Migrate `client/ui/features/buttons/` to kit
- [ ] Migrate `client/ui/shell/holder-app.tsx` to kit
- [ ] Delete `client/ui/primitives/`
- [ ] Delete or move `shared/domain/Gui.ts` color constants (keep `IMAGES` + `HOLDER_PAGES`)
- [ ] Update `docs/systems/ui.md`
- [ ] Move this spec to `docs/features/done/ui-kit.md` with retro

## Acceptance criteria

- `client/ui/kit/` exists with all subfolders above and Wave 4 components shipped.
- Every component has a `.story.tsx` rendering all variants + states.
- A `kitchen-sink.story.tsx` shows the entire palette, spacing scale, typography, gradients, and one of every component.
- No file under `src/client/ui/` or `src/client/ui/features/` references `client/ui/primitives/*`.
- `client/ui/primitives/` directory is gone.
- `npm run typecheck` and `npm run lint` are clean.
- All existing features (currency display, settings page, holder cycling buttons) still work in Studio Play and look like the new design system.

## Open questions

- ~~Roblox `Font` instance with custom asset id may need preloading for first-frame rendering.~~ — Skipped preload; first-frame fallback to default font is acceptable.
- ~~ScrollArea: themed scrollbar image?~~ — Stuck with `ScrollBarImageColor3` set from `border` token.
- ~~Toast positioning?~~ — Top-right corner, hardcoded inside `ToastProvider`. Configurable later if needed.

## Retro

Shipped in four waves over a single session — Foundation → Core → Form/Display → Overlays + migration. Total: 21 components, 21 stories, full theme system, motion hooks on `@rbxts/ripple`, kitchen-sink, four migrated features.

**What worked:**
- Splitting into waves was the right call — each wave had a clean acceptance moment ("typecheck + lint clean, kitchen-sink renders") and a natural review point. Wave 4 was the heaviest because of migration but all the design work was settled by then.
- The `variant()` helper + `useTheme()` pattern made every component look consistent without copy-pasting style logic. Buttons, badges, and toasts all read the same color tokens.
- Story-shell helper (`<StoryShell>`, `<Section>`, `<Row>`) cut a lot of boilerplate — every component story has the same skeleton.
- `usePressScale()` baked into Button means hover/press feedback is uniform across the whole UI. No per-feature animation tweaking.
- For looping animations (Skeleton pulse, ProgressBar shimmer indeterminate), bypassing ripple and using `useBinding` + `RunService.Heartbeat` directly was simpler than chaining `motion.onComplete` callbacks.

**Surprises:**
- roblox-ts reserves `next` and a few other identifiers — had to rename local variables in slider, text-input, and progress-bar story.
- `useSpring<T>` inferring T as a literal (e.g. `Motion<-0.4>`) when called with a non-integer literal — fixed by passing explicit `<number>` and broadening `SpringOptions` (dropping the `<T>` constraint on the options arg).
- Custom Roblox `Font` from rbxassetid uses `FontFace` prop instead of `Font` — easy to miss, every text element in the kit has to remember.
- `imagelabel` doesn't have a `Loaded` event in @rbxts/types — Avatar fallback now just always renders behind the image instead of waiting for load.

**What we'd change next time:**
- Should have written a `<TextInput>` placeholder text component with a more obvious focus ring earlier — by Wave 4 most form examples already used the outline variant.
- The `frameSize` prop name (vs `size` for typographic size on `<Text>`) is awkward. Worth renaming consistently across the kit when we have a chance — perhaps `boxSize` everywhere.
- ToastProvider's viewport positioning is hardcoded to top-right. Should accept a prop like `position="top-right" | "bottom-right" | "top-center"` next time we touch it.

**Migration notes:**
- Currency frame is now smaller (220×56) and uses `Card`-style chrome — visually different from the cartoony original, but matches the rest of the kit. The "+" button is a `solid` Button instead of the green pill.
- Settings page uses `ScrollArea` with kit `Toggle`s instead of red/green toggle buttons. Each row is a `Card`-styled Box.
- Holder shell's studio-only "Next/Previous" cycle buttons are now outline `Button`s in the top-left corner.
- Image-asset values in `IMAGES` table stayed as bare digit strings; `Icon`'s asset resolver now handles them by autoprefixing `rbxassetid://`.
