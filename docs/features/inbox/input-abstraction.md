# Input Abstraction

> Status: inbox
> Level: system
> Phase: 2
> Depends on: (none)
> ADR needed: yes — `0008-input-abstraction.md`

## Idea

Action-based input layer over `UserInputService` and `ContextActionService`. Code refers to actions (`"jump"`, `"openInventory"`) not raw `Enum.KeyCode.Space`. Bindings declared in one place; rebindable later if needed. Auto-handles keyboard, gamepad, and touch with sensible defaults per platform. Platform detection so UI can show the right glyph (E vs A vs touch button).

## API sketch

```ts
// shared/domain/InputActions.ts
export const InputActions = {
  jump:          { keyboard: Enum.KeyCode.Space,  gamepad: Enum.KeyCode.ButtonA },
  openInventory: { keyboard: Enum.KeyCode.E,      gamepad: Enum.KeyCode.ButtonY },
  cancel:        { keyboard: Enum.KeyCode.Escape, gamepad: Enum.KeyCode.ButtonB },
} as const;
export type ActionKey = keyof typeof InputActions;

// client/controllers/InputController.ts
input.bind("jump", () => character?.jump());
input.unbind("jump");
input.isDown("jump"): boolean;
input.platform(): "keyboard" | "gamepad" | "touch";
input.platformChanged: Signal<Platform>; // for swapping UI glyphs

// React hook
const platform = useInputPlatform();
```

`InputController` registers via `ContextActionService:BindAction` per action; one bind covers all platforms in the table.

## Files

- `src/shared/domain/InputActions.ts` (new)
- `src/client/controllers/InputController.ts` (new — `@Controller`)
- `src/client/ui/kit/hooks/use-input-platform.ts` (new — for UI to react to platform changes)
- `src/client/ui/kit/components/key-glyph/key-glyph.tsx` (new — small kit component to render the right glyph: "E", controller A, or touch button)
- `docs/systems/input.md` (new)
- `docs/adr/0008-input-abstraction.md` (new)

## Dependencies

- (no hard deps; pairs with `localization` if action names ever need to be displayed in tooltips)

## Decisions to make

- **D1: ContextActionService vs UserInputService.** **Rec: ContextActionService.** Built-in priority/sink, supports gamepad+keyboard+touch in one bind, mobile-friendly button generation.
- **D2: Mobile auto-buttons.** ContextActionService can auto-create a touch button. **Rec: yes when `platform() === "touch"`** for actions that aren't `jump` (Roblox default jump button covers that).
- **D3: Platform detection.** UserInputService.LastInputType. **Rec: subscribe to `LastInputTypeChanged`, classify into `keyboard | gamepad | touch`, fire `platformChanged` signal.**
- **D4: Rebinding UI.** Out of scope here. Just leave the data structure rebind-friendly (store overrides separately from defaults later).
- **D5: Glyph art.** Use Roblox built-in gamepad icons (rbxasset://textures/...) and text labels for keyboard. **Rec: text label "E" for keyboard, builtin texture for gamepad, generic touch icon for touch.** Add real glyph atlas in a later iteration.

## Acceptance criteria

- [ ] `InputActions` registry has `jump`, `openInventory`, `cancel` defined
- [ ] `input.bind("openInventory", fn)` triggers fn on E (keyboard) and Y (gamepad)
- [ ] `input.platform()` returns correct value when switching from keyboard to gamepad
- [ ] `<KeyGlyph action="openInventory" />` renders "E" on keyboard, gamepad-Y glyph on gamepad
- [ ] Touch device sees an auto-generated button for actions tagged `touchAuto: true`
- [ ] Multiple binds to same action error or warn (no silent override)
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] ADR + `docs/systems/input.md` written
