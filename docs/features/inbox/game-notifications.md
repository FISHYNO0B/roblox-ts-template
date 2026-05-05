# Game Notifications

> Status: inbox
> Level: feature
> Phase: 2
> Depends on: existing kit `Toast`, `asset-registry` (for icons in notifications)
> ADR needed: no

## Idea

Server-pushed in-game events ("You earned 50 Coins!", "Badge unlocked: First Win", "Level up!") rendered as styled notifications above the existing Toast component. Server dispatches via Reflex slice (auto-replicated); client subscribes and pops a Toast variant. Different from Toast: Toasts are immediate UI feedback for user actions; Notifications are server-authored events the player should see.

## API sketch

```ts
// shared/infra/store/slices/players/notifications.ts
{
  queue: Notification[]; // server pushes, client pops via dismiss action
}
type Notification = {
  id: string;            // GUID
  kind: "info" | "success" | "warning" | "reward" | "badge";
  title: string;
  body?: string;
  iconKey?: IconKey;
  expiresAt?: number;    // unix seconds
};
pushNotification(playerId, notification);
dismissNotification(playerId, id);

// server/services/NotificationService.ts (@Service)
notify.send(player, { kind: "reward", title: "+50 Coins", iconKey: "coin" });
notify.broadcast({ kind: "info", title: "Server restart in 5 min" });

// client/ui/features/notifications/notifications-app.tsx
// Subscribes to selectPlayerNotifications(localPlayer.UserId)
// Renders a stack of Toast-styled cards in top-right; auto-dismiss on expiresAt
```

## Files

- `src/shared/infra/store/slices/players/notifications.ts` (new)
- `src/shared/infra/store/slices/players/types.ts` (extend `PlayerData` with `notifications`)
- `src/shared/infra/store/selectors/players.ts` (add `selectPlayerNotifications`)
- `src/server/services/NotificationService.ts` (new — `@Service`)
- `src/client/ui/features/notifications/notifications-app.tsx` (new)
- `src/client/ui/features/notifications/components/notification-card.tsx` (new — kit Card variant)
- `src/client/ui/shell/holder-app.tsx` (mount `<NotificationsApp />`)
- `src/server/cmdr/commands/notify.ts` + `notifyServer.ts` (debug — `notify <playerName> <message>`)
- `docs/systems/notifications.md` (short)

## Dependencies

- `asset-registry` (icons referenced via `IconKey`)
- Kit Toast/Card already exist

## Decisions to make

- **D1: Persisted in profile or transient?** **Rec: transient.** Notifications are session-only. Don't bloat saves. They're not on the persisted slice path.
- **D2: Slice location — `players/` or top-level?** **Rec: `players/<id>/notifications`.** Per-player. Auto-replicated by broadcaster only to the relevant client (broadcaster filters by ownership, already wired for settings).
- **D3: Auto-dismiss strategy.** **Rec: client-side timer per notification using `expiresAt`.** Server doesn't tick to clean.
- **D4: Stack size cap.** **Rec: 5 visible, oldest pushed off-screen with fade.** Slice unlimited; rendering caps display.
- **D5: Reuse Toast component?** **Rec: new component, kit-styled.** Toasts are user-action feedback; Notifications are bigger (icon + body) and persist longer. Different use cases.

## Acceptance criteria

- [ ] `notify.send(player, { ... })` makes a card pop on that player's screen
- [ ] `notify.broadcast({ ... })` shows on all players
- [ ] Auto-dismiss at `expiresAt`; manual dismiss with click
- [ ] Stack of 3+ notifications stacks vertically with fade-out at the bottom
- [ ] Cmdr `notify <player> <message>` works
- [ ] No memory leak: dismissed notifications removed from slice
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] `docs/systems/notifications.md` written
