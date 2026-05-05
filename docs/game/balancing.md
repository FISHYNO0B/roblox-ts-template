# Balancing

> Replace this file when the template is forked into a real game. The headings below are a starter structure — add/remove tables as the game's actual systems emerge.

**Living numbers document.** Design decisions belong in [design.md](design.md), [economy.md](economy.md), [progression.md](progression.md) — *this* file is just tuning values. Change freely during playtesting.

When a number stabilises after playtest, copy it into the matching config file in [src/](../../src/) — but this file remains the single source of truth until then.

## Starting values

| Variable | Value |
|---|---|
| Starting Coins | _e.g. 0_ |
| Starting Gems | _e.g. 0_ |
| Starting inventory slots | _e.g. 10_ |
| _… add as the game grows_ | _…_ |

## Currency sources

Every way the player can gain currency, and roughly how much per minute of active play.

| Source | Currency | Rate | Notes |
|---|---|---|---|
| _e.g. Quest reward_ | _Coins_ | _100 / quest_ | _Cap at 5 active quests_ |

## Currency sinks

Every way the player can spend currency.

| Sink | Currency | Cost | Notes |
|---|---|---|---|
| _e.g. Inventory expansion tier 1_ | _Coins_ | _500_ | _Doubles per tier_ |

## Tier tables

For any system with tiers (workers, storage, areas, weapons…), give each tier its full row here.

### _Example: Worker tiers_

| Tier | Unlock cost | Throughput | Notes |
|---|---|---|---|
| _T1_ | _Free_ | _1 item / 60s_ | _Starter_ |
| _T2_ | _$5,000_ | _1 item / 30s_ | _…_ |

## Drop rates / RNG tables

| Pool | Outcome | Weight | Notes |
|---|---|---|---|
| _e.g. Daily reward_ | _100 Coins_ | _60_ | _Common_ |
| _e.g. Daily reward_ | _500 Coins_ | _30_ | _Uncommon_ |
| _e.g. Daily reward_ | _1 Gem_ | _10_ | _Rare_ |

## Cooldowns / intervals

| Action | Interval | Notes |
|---|---|---|
| _e.g. Daily reward claim_ | _24h_ | _Resets at midnight UTC_ |

## Open balancing questions

Stuff to confirm during playtest. Move to the relevant table above once a value is picked.

- _e.g. Is the early-game grind too long? Target = 5 min to first upgrade._
- _e.g. Is the gamepass priced right? Target = ~2 hours of grind equivalent._
