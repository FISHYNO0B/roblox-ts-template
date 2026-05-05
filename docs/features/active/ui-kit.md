# UI Kit

> Status: active
> Level: system

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

- Roblox `Font` instance with custom asset id may need preloading for first-frame rendering. Decide in Wave 1 whether `<KitRoot>` should ContentProvider:PreloadAsync the font, or accept first-frame fallback.
- ScrollArea: do we need a custom themed scrollbar image, or stick with `ScrollBarImageColor3` set from a token?
- Toast positioning (top-right vs bottom-right vs configurable) — defer to Wave 4.
