# Roblox Template Game

The game's domain glossary. Add terms as they enter the project. The `grill-with-docs` skill maintains this file when you stress-test plans against it.

> Currently sparse — the template has no actual game yet, so most terms here are placeholder content from the example systems. Replace and extend as the real game takes shape.

## Language

**Player**:
A connected human controlling a character in the game.
_Avoid_: User, account, client (client = the device, not the person).

**Profile**:
A player's persistent save data, loaded by ProfileService when they join, written back when they leave.
_Avoid_: Account, save file, data.

**Balance**:
The set of currency amounts a player owns (e.g. `{ Coins: 100, Gems: 5 }`).
_Avoid_: Wallet, funds, money.

**Currency**:
A named, integer-valued resource a player can earn and spend. Currently `Coins` and `Gems` (placeholder — replace per game).
_Avoid_: Token, points, score.

**Setting**:
A per-player on/off preference (e.g. `PvP`, `MusicEnabled`). Toggled via the `toggleSetting` event.
_Avoid_: Preference, option, flag.

**Holder Page**:
The current page displayed by the top-level UI shell (`HolderApp`). One of `HOLDER_PAGES`.
_Avoid_: Screen, view, route.

## Relationships

- A **Player** has exactly one **Profile** while connected.
- A **Profile** contains a **Balance** and a set of **Settings**.
- A **Balance** maps each **Currency** to a non-negative integer.

## Example dialogue

> **Dev:** When a **Player** spends **Coins**, do we mutate their **Balance** directly?
> **Domain expert:** No — you dispatch `changeBalance` to the server store; the broadcaster syncs it to the client; ProfileService picks up the change and writes it back to the **Profile** on session end.

## Flagged ambiguities

_(none yet — add as they come up)_
