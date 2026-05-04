# Overview

> When this repo is forked into a real game, replace this file with the game's pitch — what it is, who it's for, and the design pillars.

## Right now: the template

This is the **starting state** every game built from this template inherits. It is a working "non-game" — a player joins, gets a `Coins` and `Gems` balance, opens a settings menu, and that's it.

The point is to begin every new project from a base that already has:

- Save system (ProfileService → Reflex)
- Server-authoritative state with auto-sync to clients
- Type-safe client↔server networking (Flamework Networking)
- A reusable UI primitive set + a router shell
- Cmdr admin commands
- Tests that run on press-Play in Studio

Forking gives you a project that builds, runs, and saves. From there you replace the placeholder content (currency names, settings, UI) and add the actual game.

## Design pillars (template-level)

Things every game built on this template should preserve. Override per-game if needed.

1. **Server is the source of truth.** Anything valuable is decided server-side and synced to clients via Reflex.
2. **Type safety end-to-end.** No untyped RemoteEvents, no untyped store access.
3. **One pattern per problem.** State = Reflex. UI = React. Persistence = ProfileService. Don't introduce competitors.
4. **Replaceable, not removable.** Currency/settings/etc. are example systems — they should be replaceable as a unit, not so entangled you can't pull them out.
