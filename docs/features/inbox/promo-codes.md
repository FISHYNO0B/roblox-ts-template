# Promo Codes

> Status: inbox
> Level: system
> Phase: 3 (touches player save schema — review before impl)
> Depends on: `game-notifications`
> ADR needed: yes — `0012-promo-codes.md`

## Idea

Redeemable codes that grant rewards. Code definitions live in `shared/domain/Codes.ts` (codes + reward + optional expiry/uses). Server validates, grants, marks redeemed in player profile. Client has a TextInput UI to enter codes. Idempotent: each player can redeem each code at most once. Optional global usage cap supported (first-N-claimers). Useful for marketing campaigns, content drops, apology gifts after outages.

## API sketch

```ts
// shared/domain/Codes.ts
export const Codes = {
  WELCOME:    { reward: { currency: "Coins", amount: 100 } },
  SUMMER2026: { reward: { currency: "Gems", amount: 50 }, expiresAt: 1735689600 },
  FIRST1000:  { reward: { currency: "Coins", amount: 1000 }, maxUses: 1000 },
} as const;
export type CodeKey = keyof typeof Codes;

// shared/infra/store/slices/players/codes.ts — adds to player save
{
  redeemed: Set<CodeKey>;  // codes this player has used
}

// Top-level slice (NOT per-player) for global usage counts
// shared/infra/store/slices/codeUsage.ts — server only, NOT broadcast to clients
{
  counts: Record<CodeKey, number>;
}

// shared/infra/network.ts
redeemCode: (code: string) => RedeemResult; // client → server
type RedeemResult = "ok" | "unknownCode" | "alreadyRedeemed" | "expired" | "exhausted";

// server/services/CodesService.ts (@Service)
codes.redeem(player, codeString): RedeemResult;
codes.has(player, key): boolean;

// client/ui/features/codes/codes-app.tsx — TextInput + Button + result message
```

## Files

- `src/shared/domain/Codes.ts` (new)
- `src/shared/infra/store/slices/players/codes.ts` (new — player save schema change)
- `src/shared/infra/store/slices/players/types.ts` (extend)
- `src/shared/infra/store/slices/players/index.ts` (register)
- `src/shared/infra/store/slices/codeUsage.ts` (new — server-only top-level)
- `src/server/services/CodesService.ts` (new — `@Service`)
- `src/server/services/CodeUsagePersistence.ts` (new — global usage counts to DataStore separate from profiles)
- `src/shared/infra/network.ts` (`redeemCode` event)
- `src/client/ui/features/codes/codes-app.tsx` (new — kit TextInput + Button + Toast on result)
- `src/client/ui/shell/holder-app.tsx` (add "Codes" page to HOLDER_PAGES)
- `src/server/cmdr/commands/createCode.ts` + `createCodeServer.ts` (NO — codes are static in source per security; cmdr only for resetting redemption history of test players)
- `src/server/cmdr/commands/resetCodes.ts` + `resetCodesServer.ts` (debug — clear redeemed set)
- `docs/systems/codes.md` (new)
- `docs/adr/0012-promo-codes.md` (new)
- (test) `src/server/tests/codes/redeem.spec.ts`

## Dependencies

- `game-notifications` (success/failure feedback)
- Existing `players/balance` (currency grants)
- ProfileService (per-player redeemed set)
- DataStore (global usage counts for `maxUses` codes)
- ⚠️ **Modifies player save schema**

## Decisions to make

- **D1: Codes static in source vs admin-add at runtime.** **Rec: static.** Adding codes via Cmdr means they live only in one server instance. Static = git-tracked, all servers share. Admin-add can come later as separate system.
- **D2: Case sensitivity.** **Rec: case-insensitive on input — uppercase before lookup.** Standard UX.
- **D3: Global usage caps storage.** Roblox profiles are per-player. Global counts need a separate DataStore. **Rec: yes, keyed `"codeUsage:<CODE>"`, increment with `UpdateAsync` (atomic).** Slow path used only for codes with `maxUses` set.
- **D4: Result type — enum vs error throw.** **Rec: discriminated string union** (`"ok" | "unknownCode" | ...`). Cleaner client UX, no exception noise.
- **D5: UI placement.** **Rec: new "Codes" page in HolderApp, like settings is.**
- **D6: Schema migration.** New `redeemed: Set<CodeKey>` on player save. **Rec: rely on ProfileService default-merge with empty set.** No explicit migration.
- **D7: Reward types.** Start with currency-only. **Rec: extend reward shape later** (`{ kind: "currency" | "badge" | "item" }`) once those systems are ready.
- **D8: Codes secret in client?** Code names are visible in UI clearly. Game logic shouldn't enumerate `Codes` to client — clients send a string, server matches. **Rec: keep `Codes` server-only at runtime — don't import into client code.** A server-only-domain pattern.

## Acceptance criteria

- [ ] `WELCOME` code redeems → grants 100 Coins, marks redeemed
- [ ] Second redeem of same code by same player → `"alreadyRedeemed"`
- [ ] Unknown code → `"unknownCode"`
- [ ] Expired code (past `expiresAt`) → `"expired"`
- [ ] `maxUses`-capped code: first N players redeem successfully, rest get `"exhausted"`
- [ ] Case-insensitive: `welcome` and `WELCOME` both work
- [ ] UI shows result message (Toast) on each attempt
- [ ] Cmdr `resetCodes <player>` clears their redemption history for testing
- [ ] Test: redeem reducer handles all result branches
- [ ] Existing player-save tests still pass; new `redeemed` key doesn't break load
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] ADR + `docs/systems/codes.md` written
- [ ] `Codes` registry not imported by any client-side file (grep check)
