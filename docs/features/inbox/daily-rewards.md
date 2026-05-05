# Daily Rewards

> Status: inbox
> Level: system
> Phase: 3 (touches player save schema — review before impl)
> Depends on: `game-notifications` (claim-success notification)
> ADR needed: yes — `0011-daily-rewards.md`

## Idea

Standard Roblox login-streak reward. Players get a reward each calendar day (server time) they log in. Streak resets after a missed day. Streak length up to 7 (configurable), then loops or holds at 7. Server-authoritative: client requests claim, server validates last-claim timestamp + streak, grants reward + updates state.

## API sketch

```ts
// shared/domain/Rewards.ts — daily reward table
export const DailyRewards = [
  { day: 1, kind: "currency" as const, currency: "Coins", amount: 50 },
  { day: 2, kind: "currency" as const, currency: "Coins", amount: 100 },
  { day: 3, kind: "currency" as const, currency: "Gems",  amount: 5  },
  { day: 4, kind: "currency" as const, currency: "Coins", amount: 200 },
  { day: 5, kind: "currency" as const, currency: "Gems",  amount: 10 },
  { day: 6, kind: "currency" as const, currency: "Coins", amount: 400 },
  { day: 7, kind: "currency" as const, currency: "Gems",  amount: 25 },
];

// shared/infra/store/slices/players/rewards.ts — NEW SLICE on player profile
{
  lastClaimDay: string | undefined;  // ISO day, e.g. "2026-05-05"
  streak: number;                    // 1..7
}
claimDaily(playerId);   // server-only action, validates + grants

// shared/infra/network.ts — new event
claimDailyReward: () => boolean; // client → server, returns success

// server/services/DailyRewardService.ts (@Service) — orchestrates validation + grant + notification

// client/ui/features/daily-reward/daily-reward-app.tsx — popup on login if claimable
```

## Files

- `src/shared/domain/Rewards.ts` (new — daily reward table; per-game tweak)
- `src/shared/infra/store/slices/players/rewards.ts` (new — adds to player save schema)
- `src/shared/infra/store/slices/players/types.ts` (extend `PlayerData` with `rewards`)
- `src/shared/infra/store/slices/players/index.ts` (register slice)
- `src/shared/infra/store/selectors/players.ts` (add `selectDailyRewardState`)
- `src/server/services/DailyRewardService.ts` (new — `@Service`)
- `src/shared/infra/network.ts` (`claimDailyReward` event)
- `src/client/ui/features/daily-reward/daily-reward-app.tsx` (new — kit Dialog with reward grid)
- `src/client/ui/shell/holder-app.tsx` (mount popup on first-claim-available)
- `src/server/cmdr/commands/resetDaily.ts` + `resetDailyServer.ts` (debug)
- `docs/systems/daily-rewards.md` (new)
- `docs/adr/0011-daily-rewards.md` (new)
- (test) `src/server/tests/rewards/streak-logic.spec.ts`

## Dependencies

- `game-notifications` (success feedback)
- Existing `players/balance` (granting currency)
- ⚠️ **Modifies player save schema** — must coexist with existing balance/settings slices, ProfileService keys must include `rewards`

## Decisions to make

- **D1: Day boundary — server time or player local time?** **Rec: UTC server day (`os.date("!*t")`).** Per-player time-zone abuse possible otherwise. Players in different zones will see "tomorrow" at slightly inconvenient hours; acceptable trade.
- **D2: Streak reset on miss.** **Rec: missed > 1 day → streak resets to 0.** Came back next day = streak continues.
- **D3: Loop or cap at 7?** **Rec: loop back to day 1.** Long-term retention reward.
- **D4: Auto-popup vs button.** **Rec: auto-popup once per claim availability, dismissable.** UI shell shows a small "claim" indicator on settings/menu icon if not claimed.
- **D5: Client-shown UI before claim event lands.** Optimistic? **Rec: pessimistic.** Wait for server response. Avoid dupe-claim impressions.
- **D6: Schema migration for existing profiles.** Default `lastClaimDay: undefined`, `streak: 0`. ProfileService default-merges missing keys. **Rec: rely on default-merge — no explicit migration.**

## Acceptance criteria

- [ ] First login: player can claim day 1 reward; streak goes to 1
- [ ] Same-day re-login: claim button disabled, streak unchanged
- [ ] Next-day login: claim available; streak goes to 2; day 2 reward granted
- [ ] Skipping a day: streak resets to 0 on next login
- [ ] Day 7 → day 8 = loops back to day 1 reward
- [ ] Notification fires on successful claim with reward summary
- [ ] Cmdr `resetDaily` clears `lastClaimDay` + `streak` for testing
- [ ] Pure-logic test for streak transitions (input: lastClaimDay + currentDay → output: newStreak + grantedReward)
- [ ] Existing player-save tests still pass; new key doesn't break load
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] ADR + `docs/systems/daily-rewards.md` written
