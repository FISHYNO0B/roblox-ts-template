# Progression

> Replace this file when the template is forked into a real game. The headings below are the structure to keep — the content is placeholder.

The shape of the player's journey from first-join to end-game. What unlocks, in what order, and how long each stage should feel. Numbers live in [balancing.md](balancing.md); this file describes the **path**.

## Player journey

A rough timeline. Each stage should have a clear "what am I trying to do right now" goal.

| Stage | Time-on-task (target) | Player goal | Unlocks at the end |
|---|---|---|---|
| First-join | _~5 min_ | _Learn the basic loop_ | _e.g. first upgrade, second area_ |
| Early | _~30 min_ | _Stretch goal_ | _e.g. category 2_ |
| Mid | _~2–5 hours_ | _Stretch goal_ | _e.g. all base content_ |
| Late | _~10+ hours_ | _Optimisation, completion_ | _e.g. cosmetic-only_ |
| End-game | _open-ended_ | _Daily login loop, social_ | _N/A_ |

## Unlock paths

What gates what. Keep this acyclic — every unlock should depend on something the player already has, never on something they could only get *after* this unlock.

- _e.g. **Area 2** unlocked by reaching $10k cash._
- _e.g. **Worker tier 2** unlocked by buying Area 2._
- _e.g. **Category C** unlocked by buying any Worker tier 2._

## Upgrade paths

The big multi-step upgrades the player works toward. One row per upgrade *family*, not per tier (tier numbers go in [balancing.md](balancing.md)).

| Upgrade family | What it improves | Tiers | Notes |
|---|---|---|---|
| _e.g. Storage_ | _Max items held_ | _5_ | _Final tier gates end-game content_ |

## Soft-locks to avoid

Specific failure modes the design must prevent:

- _e.g. Player runs out of cash with no way to earn more without spending._
- _e.g. A late upgrade is technically optional but in practice required, and the player doesn't know._

## No-reset commitment

_State whether progression ever resets (rebirth, prestige, season). If the answer is "no", say so explicitly — players ask, and "we don't do that" is a design decision worth documenting._
