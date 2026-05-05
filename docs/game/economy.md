# Economy

> Replace this file when the template is forked into a real game. The headings below are the structure to keep — the content is placeholder.

How value flows through the game: what the player earns, what they spend it on, and what real-money items exist. Concrete numbers live in [balancing.md](balancing.md); this file is about **principles and shape**.

## Currencies

The template ships with `Coins` and `Gems` as placeholder examples. Replace with whatever the game actually uses (and update [shared/domain](../../src/shared/domain/) + [CONTEXT.md](../../CONTEXT.md) when you do).

| Currency | Source(s) | Sinks | Soft-cap? |
|---|---|---|---|
| _e.g. Cash_ | _Selling items, daily rewards_ | _Worker hires, plot expansion_ | _No / Yes (why)_ |

Single-currency games are usually better than multi-currency. Only add a second currency if it serves a clearly different purpose (e.g. premium-only progression that can't be ground out).

## Monetization

What real-money products exist, and what role each plays. **Don't list IDs here** — those live in [`GameConfig`](../../src/shared/domain/) once known.

### Gamepasses (one-time)

| Pass | What it does | Design intent |
|---|---|---|
| _e.g. 2× Income_ | _Doubles all currency gains_ | _Permanent QoL multiplier — appeals to long-haul players_ |

### Developer products (consumable)

| Product | What it does | Design intent |
|---|---|---|
| _e.g. Cash Pack S_ | _+10,000 Cash_ | _Whale lane / catch-up after a long break_ |

## Pricing principles

Rules of thumb for setting numbers (the actual numbers go in [balancing.md](balancing.md)):

- _e.g. Early-game upgrade prices roughly double per tier._
- _e.g. A gamepass should pay for itself within ~2 hours of active play for a mid-engaged player._
- _e.g. The cheapest devproduct should buy roughly 30 minutes of grind; the most expensive ~10 hours._

## Anti-patterns we're avoiding

- _e.g. No pay-to-win mechanics that can't be ground out for free given enough time._
- _e.g. No FOMO timers on premium currency._
