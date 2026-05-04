# Beginner's Complete Guide to the Roblox-TS Template

Welcome! This guide is written for **complete beginners**. If you've never used Roblox-TS, Flamework, React, or Reflex before — this is the right place to start. Read it top to bottom. By the end you'll understand what every folder does, how the pieces fit together, and how to add your own features.

---

## Table of Contents

1. [What this template is](#1-what-this-template-is)
2. [The big picture: how a Roblox-TS game runs](#2-the-big-picture-how-a-roblox-ts-game-runs)
3. [Tools you need to install](#3-tools-you-need-to-install)
4. [First-time setup, step by step](#4-first-time-setup-step-by-step)
5. [The libraries used (and why)](#5-the-libraries-used-and-why)
6. [Project folder structure explained](#6-project-folder-structure-explained)
7. [How code starts running (the runtime files)](#7-how-code-starts-running-the-runtime-files)
8. [Flamework: services, controllers, and dependency injection](#8-flamework-services-controllers-and-dependency-injection)
9. [Reflex: state management and client/server sync](#9-reflex-state-management-and-clientserver-sync)
10. [ProfileService: saving player data](#10-profileservice-saving-player-data)
11. [React: building the UI](#11-react-building-the-ui)
12. [Networking: client ↔ server messages](#12-networking-client--server-messages)
13. [Cmdr: in-game developer commands](#13-cmdr-in-game-developer-commands)
14. [TestEZ: writing tests](#14-testez-writing-tests)
15. [The debug helper `$print`](#15-the-debug-helper-print)
16. [Common workflows: how do I…?](#16-common-workflows-how-do-i)
17. [Troubleshooting](#17-troubleshooting)
18. [Where to learn more](#18-where-to-learn-more)

---

## 1. What this template is

This is a **starter project** for making a Roblox game using **TypeScript** instead of Lua. TypeScript gives you autocomplete, type checking, and a better editor experience. The TypeScript code is compiled into Lua that Roblox can run.

The template comes pre-wired with battle-tested patterns so you don't have to set them up yourself:

- A **save system** (player coins, gems, settings persist between sessions)
- A **state system** (data stays in sync between server and client automatically)
- A **UI system** (React for building interfaces declaratively)
- A **command console** (press F2 in Studio to give yourself currency)
- A **test runner**

If any of those words are scary, don't worry — we'll explain them.

---

## 2. The big picture: how a Roblox-TS game runs

A Roblox game has two sides:

- **Server** — one computer that runs the game logic, owns the "real" data, decides what's allowed.
- **Client** — each player's own device, which shows the UI and reacts to input.

You write code in TypeScript. A tool called **roblox-ts** (the `rbxtsc` compiler) converts it to Lua. Another tool called **Rojo** takes those Lua files and syncs them into Roblox Studio so you can press Play and test.

```
your TypeScript files  ──(rbxtsc)──►  Lua files in /out
                                              │
                                              ▼
                                       Rojo serves them
                                              │
                                              ▼
                                  Roblox Studio loads them
```

You'll keep two terminal windows running:
1. **Watch mode** — recompiles TS to Lua whenever you save
2. **Rojo serve** — pushes the Lua into Studio

`npm start` runs both at once.

---

## 3. Tools you need to install

Install these once on your machine:

| Tool | What it is | How to get it |
|---|---|---|
| **Node.js** (LTS) | Runs `npm` and the TS compiler | https://nodejs.org/ |
| **Roblox Studio** | The Roblox editor | https://www.roblox.com/create |
| **Rokit** | Toolchain manager that installs Rojo (and any future Roblox tools) at the version this project pins | https://github.com/rojo-rbx/rokit |
| **Rojo Studio plugin** | Lets Studio talk to Rojo | Install via Roblox Studio → Toolbox → search "Rojo" |
| **VS Code** (recommended) | Code editor | https://code.visualstudio.com/ |

> You don't install Rojo directly anymore. This project ships a [`rokit.toml`](rokit.toml) that pins the exact Rojo version, and `rokit install` will fetch it for you (see next section).

**Recommended VS Code extensions:**
- ESLint
- Prettier ESLint (then disable plain Prettier)
- TestEZ Companion (lets you run tests inside VS Code)
- (In Studio) UI Labs plugin — preview your React UI without launching the game

---

## 4. First-time setup, step by step

Open a terminal in this folder, then:

```bash
# 1. Install Rojo (and any other Roblox tools pinned in rokit.toml)
rokit install

# 2. Install all the JavaScript packages listed in package.json
npm i

# 3. Compile the TypeScript once to make sure it builds
npm run build

# 4. Start the dev workflow (watch + Rojo together)
npm start
```

> `rokit install` reads [`rokit.toml`](rokit.toml), downloads the listed tools (currently `rojo-rbx/rojo`), and puts them on your PATH. You only need to re-run it after pulling changes that update `rokit.toml`.

Then in Roblox Studio:

1. Open a new empty place (File → New).
2. Open the Rojo plugin → click **Connect**.
3. Press **Play**. You should see a currency UI on screen and your coins ticking up.
4. Press **F2** to open the Cmdr console. Try `giveCurrency me Coins 1000`.

If something doesn't work, jump to [Troubleshooting](#17-troubleshooting).

### npm scripts cheat sheet

| Command | What it does |
|---|---|
| `npm run build` | Compile TS → Lua once |
| `npm run watch` | Compile TS → Lua continuously on save |
| `npm run serve` | Start Rojo (sync to Studio) |
| `npm start` | Run watch + serve together |
| `npm run typecheck` | Check types without compiling |
| `npm run lint` | Run ESLint (find code style problems) |
| `npm run lint:fix` | Auto-fix what ESLint can fix |

---

## 5. The libraries used (and why)

| Library | Purpose | Why it matters |
|---|---|---|
| **roblox-ts** | TS → Lua compiler | Lets you write TypeScript |
| **Flamework** | Service / controller framework | Organizes your code into nice classes that auto-start |
| **Flamework Networking** | Type-safe client↔server events | No more typo'd RemoteEvent names |
| **Reflex** | State management (like Redux) | Single source of truth, auto-syncs server→client |
| **React (@rbxts/react)** | UI library | Build UI as components, not by manipulating Instances |
| **react-reflex** | Connects React to Reflex | UI auto-updates when state changes |
| **ProfileService** | Player data persistence | Safely saves data to DataStores; handles session locking |
| **Cmdr** | In-game admin console | Easy debug commands like `giveCurrency` |
| **TestEZ** | Unit test runner | Write `.spec.ts` files, run them automatically |
| **UI Labs** | UI preview in Studio | See React components without launching the game |
| **rbxts-transform-debug** | The `$print()` helper | Better debug output |
| **@rbxts/t** | Runtime type checks | Useful for validating Cmdr inputs, network messages |
| **@rbxts/signal** | Lightweight event/signal type | Custom events |
| **@rbxts/services** | Typed wrappers for Roblox services | `import { Players } from "@rbxts/services"` |

---

## 6. Project folder structure explained

```
roblox-ts-template/
├── src/
│   ├── client/      ← runs on each player's machine
│   ├── server/      ← runs on the Roblox server only
│   └── shared/      ← used by both
├── default.project.json   ← Rojo config: where files go in Studio
├── rokit.toml             ← Roblox toolchain (pins Rojo version)
├── tsconfig.json          ← TypeScript compiler config
├── eslint.config.js       ← linter config
├── package.json           ← dependencies + npm scripts
└── testez-companion.toml  ← TestEZ extension config
```

### Inside `src/client/`

```
client/
├── runtime.client.ts   ← Entry point on the client. Starts Flamework + Cmdr.
├── infra/              ← Plumbing (no game logic): network, store setup
│   ├── network.ts
│   └── store/          ← Client-side Reflex store + receiver middleware
├── pages/              ← Flamework Controllers (one creates the React root)
│   └── App.tsx         ← Mounts the React tree under PlayerGui
├── app/holder/         ← The "Holder" UI — a router that switches pages
│   └── holder-app.tsx
└── system-ui/          ← All UI building blocks
    ├── components/     ← Generic primitives (Frame, TextButton, …)
    ├── apps/           ← Concrete UI features (currency, settings, buttons)
    ├── *.story.tsx     ← UI Labs stories (preview without running game)
    └── ui.storybook.ts
```

### Inside `src/server/`

```
server/
├── runtime.server.ts   ← Entry point on the server. Starts Flamework + tests.
├── infra/              ← Plumbing: network, store, broadcaster middleware
└── actions/            ← Flamework Services — the actual server logic
    ├── PlayerDataService.ts   ← Loads/saves player profiles, leaderstats
    ├── SettingsService.ts     ← Handles "toggleSetting" requests
    └── cmdr/                  ← Cmdr commands and types
        ├── startup.server.ts
        ├── commands/
        └── types/
└── test/               ← TestEZ specs (*.spec.ts)
```

### Inside `src/shared/`

```
shared/
├── domain/             ← Pure types/constants used everywhere
│   ├── Currency.ts
│   ├── Settings.ts
│   └── Gui.ts
├── infra/
│   ├── network.ts      ← The single source of truth for all RemoteEvents
│   └── store/          ← Reflex slices + selectors (same shape on both sides)
└── utils/              ← Helper functions (forEveryPlayer, toTitleCase, …)
```

**Rule of thumb:**
- Server-only secrets → `server/`
- UI/Input → `client/`
- Anything both sides need to agree on (data shape, state slices, network signatures) → `shared/`

---

## 7. How code starts running (the runtime files)

### Server: [src/server/runtime.server.ts](src/server/runtime.server.ts)

```ts
Flamework.addPaths("src/server/actions");
Flamework.ignite();

if (RunService.IsStudio()) {
    TestEZ.TestBootstrap.run([script.Parent!]);
}
```

What's happening:
1. `addPaths("src/server/actions")` — tells Flamework "look in this folder for `@Service` classes."
2. `Flamework.ignite()` — instantiates every service, calls their lifecycle hooks (`onInit`, `onStart`).
3. In Studio only, run all `.spec.ts` files using TestEZ.

### Client: [src/client/runtime.client.ts](src/client/runtime.client.ts)

```ts
CmdrClient.SetActivationKeys([Enum.KeyCode.F2]);
Flamework.addPaths("src/client/pages");
Flamework.ignite();
```

1. F2 will toggle the Cmdr console.
2. Look in `src/client/pages` for `@Controller` classes (the `App` controller mounts the React tree).
3. Start them all.

> **Why `.client.ts` / `.server.ts`?** roblox-ts uses these suffixes to mark scripts as LocalScripts vs Scripts in Roblox.

---

## 8. Flamework: services, controllers, and dependency injection

Flamework is the framework that organizes your code into **classes that start themselves**. Two main concepts:

- **`@Service`** — a class that lives on the server.
- **`@Controller`** — a class that lives on the client.

Both can implement lifecycle hooks:
- `OnInit` → runs first, before anything starts. Good for setup.
- `OnStart` → runs after every service has initialized. Good for connecting events.

### Example: a service

```ts
import { Service, OnStart } from "@flamework/core";

@Service({})
export class GreetingService implements OnStart {
    onStart() {
        print("Hello from the server!");
    }
}
```

Save this file under `src/server/actions/`. Flamework will discover it automatically — you don't need to register it anywhere.

### Dependency Injection

Need to use one service inside another? Just declare it in the constructor:

```ts
@Service({})
export class ShopService implements OnStart {
    constructor(private readonly playerData: PlayerDataService) {}

    onStart() {
        const profile = this.playerData.getProfile(somePlayer);
    }
}
```

Flamework finds `PlayerDataService` and gives it to you. No `new`, no singletons to manage.

The same pattern works on the client with `@Controller`. See [src/client/pages/App.tsx](src/client/pages/App.tsx).

---

## 9. Reflex: state management and client/server sync

Reflex is a Redux-style state library. Your data lives in a **store**. You change it by calling **actions**. Anything subscribed re-runs.

### The shared shape

`SharedState` describes what the game's state looks like on both sides. See [src/shared/infra/store/index.ts](src/shared/infra/store/index.ts):

```ts
export const slices = {
    players: playersSlice,   // server's view of every player's saved data
    client: clientSlice,     // client-only UI state (e.g. which page is open)
};
```

### A slice = a piece of state + the actions that change it

[src/shared/infra/store/slices/players/balance.ts](src/shared/infra/store/slices/players/balance.ts):

```ts
export const balanceSlice = createProducer(initialState, {
    loadPlayerData: (state, playerId, data) => ({ ...state, [playerId]: data.balance }),
    closePlayerData: (state, playerId)     => ({ ...state, [playerId]: undefined }),
    changeBalance:  (state, playerId, currency, amount) => { /* ... */ },
});
```

Two important rules:
1. **Never mutate state** — always return a new object (notice the `...state` spread).
2. The function's name (`changeBalance`) becomes a method on the store: `serverStore.changeBalance(...)`.

### Server store vs client store

- **`serverStore`** ([src/server/infra/store/index.ts](src/server/infra/store/index.ts)) — the source of truth.
- **`clientStore`** ([src/client/infra/store/index.ts](src/client/infra/store/index.ts)) — a mirror that gets updates from the server.

The magic that keeps them in sync:
- Server uses a **broadcaster middleware** ([src/server/infra/store/middleware/broadcaster.ts](src/server/infra/store/middleware/broadcaster.ts)) to send state changes over the network.
- Client uses a **receiver middleware** ([src/client/infra/store/middleware/receiver.ts](src/client/infra/store/middleware/receiver.ts)) to apply them.

### Selectors: reading state

A selector is a tiny function that says "I want this part of the state." See [src/shared/infra/store/selectors/players.ts](src/shared/infra/store/selectors/players.ts).

In React you use `useSelector` to subscribe to one:

```tsx
const page = useSelector(selectHolderPage);  // re-renders when holder page changes
```

In server code you use `store.subscribe(selector, callback)` — see how `PlayerDataService` watches the player's balance so it can update their `leaderstats`.

---

## 10. ProfileService: saving player data

Roblox DataStores are tricky (rate limits, double-loading, partial writes). **ProfileService** is the gold-standard wrapper that handles all the gotchas.

[src/server/actions/PlayerDataService.ts](src/server/actions/PlayerDataService.ts) does this:

1. When a player joins, `LoadProfileAsync` fetches their save (or creates a default).
2. `Reconcile()` adds any new fields you've added to `defaultPlayerData` since they last played.
3. Pushes the data into `serverStore` so the rest of the game sees it.
4. Subscribes to that player's slice — whenever the store changes, copy it back into `profile.Data` so it'll be saved on leave.
5. When the player leaves, `Release()` flushes the save.

The DataStore name is **"Production"** in real games and **"Testing"** in Studio — so you can't corrupt live data by accident.

> 📝 The default save shape lives in [src/shared/infra/store/slices/players/utils.ts](src/shared/infra/store/slices/players/utils.ts). To add a new field, edit `defaultPlayerData` and the `PlayerData` type in [types.ts](src/shared/infra/store/slices/players/types.ts).

---

## 11. React: building the UI

In Roblox-TS, React renders into actual Roblox `Instance`s (Frames, TextLabels, etc.) instead of HTML.

### The mounting point

[src/client/pages/App.tsx](src/client/pages/App.tsx):

```tsx
@Controller({})
export class App implements OnStart {
    private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

    onStart() {
        const root = createRoot(new Instance("Folder"));
        root.render(
            createPortal(
                <ReflexProvider producer={clientStore}>
                    <ScreenGui>
                        <HolderApp />
                    </ScreenGui>
                </ReflexProvider>,
                this.playerGui,
            ),
        );
    }
}
```

- `createRoot` — start a React tree.
- `createPortal` — render it under PlayerGui.
- `<ReflexProvider>` — gives every child access to `useSelector`, `useProducer`.
- `<HolderApp />` — your top-level UI.

### Two flavors of components

You'll see both:

```tsx
// JSX intrinsic — directly maps to a Roblox class (lowercase)
<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={...} />

// Custom component — defined in src/client/system-ui/components
<Frame size={new UDim2(1, 0, 1, 0)} backgroundTransparency={1} />
```

Custom components (`Frame`, `TextButton`, `TextLabel`, …) are wrappers that provide nicer defaults and a unified prop style. Prefer these in your own UI.

### Hooks you'll use

- `useSelector(selector)` — read state and re-render when it changes
- `useProducer()` — get the store to dispatch actions
- `useState`, `useEffect` — same as React on the web

### UI Labs (preview without running the game)

Files ending in `.story.tsx` define previews. With the **UI Labs** Studio plugin connected to Rojo, you can browse and live-edit each story. See [src/client/system-ui/holder.story.tsx](src/client/system-ui/holder.story.tsx) for a working example.

---

## 12. Networking: client ↔ server messages

Forget `RemoteEvent.OnServerEvent` strings. With Flamework Networking, you describe events in **one TypeScript interface** and both sides get fully-typed APIs.

[src/shared/infra/network.ts](src/shared/infra/network.ts):

```ts
interface ServerEvents {
    reflex: { start: () => void };
    toggleSetting: (setting: Setting) => void;
}

interface ClientEvents {
    reflex: {
        dispatch: (actions: Array<BroadcastAction>) => void;
        hydrate:  (actions: PlayerData) => void;
        start:    () => void;
    };
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
```

- **`ServerEvents`** = events the **client fires** at the server.
- **`ClientEvents`** = events the **server fires** at the client.

To use them:

```ts
// On the server (handle a client event)
ServerEvents.toggleSetting.connect((player, setting) => { ... });

// On the client (fire a server event)
ClientEvents.reflex.start.connect(() => { ... });
ServerEvents.toggleSetting.fire("musicEnabled");
```

There's `GlobalFunctions` too, for request/response (RemoteFunctions) — currently unused in this template.

---

## 13. Cmdr: in-game developer commands

Cmdr is an admin/debug console. Press **F2** in Studio.

### Adding a command

A Cmdr command is in **two files**:

1. The **definition** ([giveCurrency.ts](src/server/actions/cmdr/commands/giveCurrency.ts)) — describes name, args, types.
2. The **implementation** ([giveCurrencyServer.ts](src/server/actions/cmdr/commands/giveCurrencyServer.ts)) — runs the command.

The bootstrap that registers everything: [src/server/actions/cmdr/startup.server.ts](src/server/actions/cmdr/startup.server.ts).

### Custom argument types

If your command needs a custom enum (like the `Currency` type — Coins/Gems), define it in [src/server/actions/cmdr/types/currency.ts](src/server/actions/cmdr/types/currency.ts) and Cmdr will give you autocomplete.

### Try it
```
giveCurrency me Coins 5000
```

---

## 14. TestEZ: writing tests

Tests live next to the code, named `*.spec.ts`. The server runtime auto-runs them in Studio.

A spec looks like:

```ts
return () => {
    describe("balance slice", () => {
        it("adds coins", () => {
            serverStore.changeBalance("1", "Coins", 10);
            expect(selectPlayerBalances("1")(serverStore.getState())?.Coins).to.equal(10);
        });
    });
};
```

See [src/server/test/player/balance.spec.ts](src/server/test/player/balance.spec.ts) for a real example.

Install the **TestEZ Companion** VS Code extension to run tests with one click without launching the game.

---

## 15. The debug helper `$print`

`rbxts-transform-debug` rewrites `$print(x)` at compile time so you get the file, line, and the original expression as well as the value:

```ts
$print(10 > 20);            // [src/foo.ts:8] 10 > 20 = false
$print(`Hi ${name}`);       // [src/foo.ts:9] `Hi ${name}` = Hi Bob
```

Way more useful than a bare `print()` when you have many logs.

---

## 16. Common workflows: how do I…?

### …add a new currency (e.g. "Tickets")?

1. Open [src/shared/domain/Currency.ts](src/shared/domain/Currency.ts), add `"Tickets"` to the union.
2. Open [src/shared/infra/store/slices/players/utils.ts](src/shared/infra/store/slices/players/utils.ts) and set `Tickets: 0` in `defaultPlayerData.balance`.
3. (Optional) Update `PlayerDataService` to create a `Tickets` leaderstat.
4. Use it: `serverStore.changeBalance(userId, "Tickets", 5)`.

### …add a new player setting?

1. Open [src/shared/domain/Settings.ts](src/shared/domain/Settings.ts), add the setting name.
2. Add a default value in `defaultPlayerData.settings`.
3. The existing `toggleSetting` event already handles it.

### …add a new UI page?

1. Create a folder in `src/client/system-ui/apps/<your-app>/`.
2. Make `<your-app>.tsx` exporting a React component.
3. Render it from `HolderApp` (or from `App.tsx` directly).
4. (Optional) Add a `.story.tsx` next to it for UI Labs preview.

### …add a new server-side feature?

1. Create `src/server/actions/MyFeatureService.ts`:
   ```ts
   @Service({})
   export class MyFeatureService implements OnStart {
       onStart() { /* ... */ }
   }
   ```
2. That's it — Flamework auto-discovers it.

### …send a new message from client to server?

1. Edit [src/shared/infra/network.ts](src/shared/infra/network.ts), add the event signature to `ServerEvents`.
2. On the server, `ServerEvents.myEvent.connect((player, args) => ...)`.
3. On the client, `ServerEvents.myEvent.fire(args)`.

### …add new persistent data?

1. Add the field to `PlayerData` in [types.ts](src/shared/infra/store/slices/players/types.ts).
2. Add a default in [utils.ts](src/shared/infra/store/slices/players/utils.ts).
3. Create a slice for it under `src/shared/infra/store/slices/players/`.
4. Register it in [players/index.ts](src/shared/infra/store/slices/players/index.ts).
5. ProfileService's `Reconcile()` will fill the field for existing players.

---

## 17. Troubleshooting

**`compilerOptions.jsxFactory must be Roact.createElement`** — follow the README link to fix the `tsconfig.json` JSX settings for `@rbxts/react-roblox`.

**`Failed to find tool 'rojo' in any project manifest file`** — you haven't run `rokit install` yet (or you're in a folder without a `rokit.toml`). Run `rokit install` from the project root.

**`rokit: command not found`** — Rokit itself isn't installed globally yet. Follow https://github.com/rojo-rbx/rokit, then re-run `rokit install` here.

**Rojo won't connect** — make sure `npm start` (or `npm run serve`) is running, and that the Studio Rojo plugin is open and pointed at the same port (default 34872).

**Nothing is updating in Studio** — Watch mode might have crashed. Re-run `npm start`. Also confirm `out/` is being regenerated.

**`Flamework.ignite was already called`** — you imported a runtime file twice. Don't import `runtime.server.ts` from anywhere else.

**Player data not saving in Studio** — That's expected: ProfileService uses the "Testing" datastore in Studio and writes are mock unless API access is enabled. Test in a real published place.

**`F2` doesn't open Cmdr** — F2 may be bound by a Studio shortcut. Click into the game viewport first.

**Tests don't run** — they only run in Studio (`RunService.IsStudio()`). Use the TestEZ Companion extension for VS Code-based runs.

---

## 18. Where to learn more

- **Roblox-TS** — https://roblox-ts.com/
- **Flamework** — https://fireboltofdeath.dev/docs/flamework
- **Reflex** — https://littensy.github.io/reflex/
- **React (rbxts)** — https://www.npmjs.com/package/@rbxts/react-roblox
- **ProfileService** — https://madstudioroblox.github.io/ProfileService/
- **Cmdr** — https://eryn.io/Cmdr/
- **UI Labs** — https://ui-labs-roblox.github.io/ui-labs-docs/
- **TestEZ** — https://www.npmjs.com/package/@rbxts/testez
- **Rojo** — https://rojo.space/

### Suggested learning order

1. Get the template running (Section 4).
2. Read the runtime files top-to-bottom and follow each import.
3. Add a `print("hi")` to a service, see it appear in the Studio output.
4. Add a new Cmdr command — it teaches networking + Flamework in one go.
5. Add a new UI page using an existing app as a template.
6. Add a new persistent data field — touches Reflex + ProfileService end-to-end.

Welcome to Roblox-TS — have fun shipping! 🚀
