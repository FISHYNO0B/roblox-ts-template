# Cmdr (admin commands)

In-game developer console. Press **F2** in Studio (configurable in [runtime.client.ts](../../src/client/runtime.client.ts)).

## Layout

```
src/server/cmdr/
├── startup.server.ts       Registers the Cmdr server, types, and commands on game start.
├── commands/
│   ├── giveCurrency.ts          Definition (name, args, types).
│   └── giveCurrencyServer.ts    Implementation (the actual logic).
└── types/
    └── currency.ts         Custom Cmdr type for the Currency union — gives autocomplete.
```

## Adding a command

A Cmdr command is **two files**:

1. **Definition** — describes the command's name, args, and arg types.
2. **Server implementation** — runs when the command is invoked.

Both files live in `cmdr/commands/`. Follow the [`giveCurrency`](../../src/server/cmdr/commands/giveCurrency.ts) example.

If your args use a custom type (like `Currency`), define it under `cmdr/types/` and register it in `startup.server.ts`.

## Try it

```
giveCurrency me Coins 5000
```
