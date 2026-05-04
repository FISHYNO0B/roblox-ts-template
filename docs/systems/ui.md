# UI

React-based UI rendered into Roblox `Instance`s. State comes from Reflex via `useSelector`.

## Layout

```
client/ui/
├── primitives/    Reusable, generic building blocks (Frame, TextLabel, TextButton, …)
├── features/      Concrete UI features (currency, settings, buttons)
├── shell/         Top-level router — HolderApp decides what to show
├── stories/       *.story.tsx for UI Labs preview
└── utils/
```

## Mount point

The React tree is mounted by the [`App` controller](../../src/client/controllers/App.controller.tsx). It runs once on `OnStart`, creates a root, and renders the `HolderApp` shell into PlayerGui.

## Component conventions

- Files: `kebab-case.tsx`. Exports: `PascalCase`.
- Prefer the custom primitives (`<Frame>`, `<TextLabel>`, …) over JSX intrinsics (`<frame>`, `<textlabel>`) — the wrappers give consistent defaults.
- Subscribe to state with `useSelector(selector)`. Dispatch with `useProducer()`.
- One folder per feature under `features/`, with the feature root file at `features/<name>/<name>-app.tsx`.

## Adding a new UI feature

1. Create `client/ui/features/<feature>/<feature>-app.tsx`.
2. (Optional) Create `client/ui/features/<feature>/components/` for sub-components.
3. Render it from `HolderApp` (or directly from `App.controller.tsx` if it should always be mounted).
4. (Optional) Add `client/ui/stories/<feature>.story.tsx` for UI Labs preview.

## UI Labs

`*.story.tsx` files are picked up by the UI Labs Studio plugin. Use them to preview components without launching the game. See [src/client/ui/stories/holder.story.tsx](../../src/client/ui/stories/holder.story.tsx) for a working example.

## Don't

- Don't compute game logic inside components — selectors and store actions only.
- Don't mount additional React roots — there's one mount point and one provider.
