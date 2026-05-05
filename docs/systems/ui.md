# UI

React-based UI rendered into Roblox `Instance`s, on top of a token-driven design system (the **UI kit**) modeled on shadcn/ui. State comes from Reflex via `useSelector`.

See [ADR 0002](../adr/0002-ui-kit-shadcn-style.md) for why we replaced the old `primitives/` with the kit.

## Layout

```
client/ui/
├── kit/              The design system — theme tokens, motion hooks, components, stories
│   ├── theme/        colors, radius, spacing, typography, motion, gradients, ThemeProvider
│   ├── motion/       useSpring / useHover / usePress / usePressScale / useMotion
│   ├── core/         variant() helper, color resolver
│   ├── components/   Box, Button, Card, Stack, … (one folder per component, each with .story.tsx)
│   └── stories/      kitchen-sink.story.tsx + story-shell helpers
├── features/         Concrete UI features (currency, settings, buttons)
├── shell/            Top-level router — HolderApp decides what to show
├── stories/          *.story.tsx for full-app previews (e.g. holder)
└── utils/
```

## Mount point

The React tree is mounted by the [App controller](../../src/client/controllers/App.controller.tsx). It runs once on `OnStart`, creates a root, and renders into PlayerGui:

```tsx
<ReflexProvider producer={clientStore}>
  <KitRoot>
    <ToastProvider>
      <HolderApp />
    </ToastProvider>
  </KitRoot>
</ReflexProvider>
```

`KitRoot` provides the `ScreenGui`, the `UIScale` for resolution scaling, and the `ThemeProvider`. `ToastProvider` enables `useToast()` from anywhere in the tree.

## Using the kit

```tsx
import { Button, Card, CardHeader, CardTitle, Stack, useToast } from "client/ui/kit";

function MyFeature() {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <CardTitle text="Hello" />
      </CardHeader>
      <Button text="Click me" variant="solid" onClick={() => toast({ title: "Clicked" })} />
    </Card>
  );
}
```

All components consume tokens via `useTheme()` internally — no hardcoded colors, sizes, or fonts in feature code.

## Component conventions

- Files: `kebab-case.tsx`. Default export: `PascalCase`.
- Prefer kit components (`<Button>`, `<Box>`, `<Stack>`) over JSX intrinsics (`<frame>`, `<textbutton>`). Drop to intrinsics only when no kit component fits.
- Subscribe to state with `useSelector(selector)`. Dispatch via `clientStore` or `useProducer()`.
- One folder per feature under `features/`, with the feature root file at `features/<name>/<name>-app.tsx`.
- For interactive elements that need hover/press feedback, use `usePressScale()` from the kit's motion hooks.

## Adding a new UI feature

1. Create `client/ui/features/<feature>/<feature>-app.tsx` using kit components.
2. (Optional) Create `client/ui/features/<feature>/components/` for sub-components.
3. Render it from `HolderApp` (or directly from `App.controller.tsx` if it should always be mounted).
4. (Optional) Add a `*.story.tsx` for UI Labs preview — wrap in `<ThemeProvider theme={darkTheme}>` so it renders on the design-system background.

## Adding a new kit component

1. Create `client/ui/kit/components/<name>/<name>.tsx` — read tokens via `useTheme()`, never hardcode.
2. Create `client/ui/kit/components/<name>/index.ts` re-exporting the component and types.
3. Create `client/ui/kit/components/<name>/<name>.story.tsx` — show every variant, size, and state. Use UI Labs `controls` for interactive props. Wrap in `<StoryShell>` from `stories/story-shell.tsx`.
4. Add the component to `client/ui/kit/index.ts`.
5. Add a section to `stories/kitchen-sink.story.tsx`.

## UI Labs

`*.story.tsx` files are picked up by the UI Labs Studio plugin. Two storybooks live in this repo:

- [client/ui/stories/ui.storybook.ts](../../src/client/ui/stories/ui.storybook.ts) — full-app previews like the Holder shell.
- [client/ui/kit/stories/kit.storybook.ts](../../src/client/ui/kit/stories/kit.storybook.ts) — design system: kitchen sink + every component story.

## Theme tokens

Defined in [client/ui/kit/theme/](../../src/client/ui/kit/theme/):

- **Colors** — full Tailwind-style scales (50–950) for slate, blue, violet, emerald, red, amber. Plus semantic tokens (`primary`, `card`, `muted`, `destructive`, `border`, …).
- **Radius** — `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`.
- **Spacing** — `0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24` (px, multiples of 4).
- **Typography** — `BuilderExtended ExtraBold` (rbxassetid `16658237174`), sizes `xs`–`6xl`.
- **Motion** — `duration` (instant/fast/base/slow/slower), `spring` presets (gentle/snappy/bouncy/stiff/wobbly), `tween` presets.
- **Gradients** — named gradients (`primary`, `accent`, `surface`, `shimmer`, …).

Dark theme only. To recolor: edit [theme/colors.ts](../../src/client/ui/kit/theme/colors.ts) and ship.

## Don't

- Don't compute game logic inside components — selectors and store actions only.
- Don't mount additional React roots — there's one mount point and one provider.
- Don't hardcode colors / sizes / fonts in feature components — read from `useTheme()` or use kit components.
- Don't reach for raw `<frame>` / `<textlabel>` when `<Box>` / `<Text>` would do.
