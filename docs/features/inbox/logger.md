# Logger

> Status: inbox
> Level: feature
> Phase: 2
> Depends on: (none; `analytics` later consumes the error stream)
> ADR needed: no

## Idea

Thin wrapper over `$print` (rbxts-transform-debug) adding log levels (`debug`, `info`, `warn`, `error`) and category tags. Production filtering: `debug`/`info` only in Studio. `warn`/`error` always. Provides a hook point for `analytics` to subscribe to the error stream later. Doesn't replace `$print` for one-off debug — replaces the ad-hoc `print(...)` for service/controller lifecycle and recoverable errors.

## API sketch

```ts
// shared/utils/logger.ts
export const log = {
  debug(category: string, ...args: unknown[]): void;  // Studio-only
  info(category: string, ...args: unknown[]): void;   // Studio-only by default
  warn(category: string, ...args: unknown[]): void;   // always
  error(category: string, err: unknown, ...args: unknown[]): void; // always; emits to onError signal
};

// Subscribe to errors (analytics will use this)
log.onError: Signal<{ category: string; err: unknown; args: unknown[] }>;

// Per-category log level override (rare)
log.setLevel("network", "warn");
```

Usage:
```ts
log.info("PlayerDataService", "loaded profile for", player.Name);
log.error("PlayerDataService", err, "failed to release profile for", player.Name);
```

## Files

- `src/shared/utils/logger.ts` (new)
- `src/server/services/PlayerDataService.ts` (replace ad-hoc `print` with `log.*`)
- `src/server/services/SettingsService.ts` (same)
- `docs/systems/logger.md` (short — under `docs/systems/`)

## Dependencies

- `@rbxts/signal` (already in deps) for `onError`

## Decisions to make

- **D1: Replace `$print` calls?** **Rec: no.** `$print` is for ad-hoc debugging during development — keep it. Logger is for structured lifecycle/error logging that survives in production.
- **D2: Production gating mechanism.** **Rec: `RunService.IsStudio()`.** Studio = full logs. Live game = warn+error only.
- **D3: Sink format.** **Rec: `print` underneath, formatted as `[category] level: ...`.** Roblox console shows it.
- **D4: Server vs client.** **Rec: same module, lives in `shared/`.** Both sides use it identically.
- **D5: Log buffer for analytics.** **Rec: `onError` signal only, no info/debug buffer.** Analytics cares about errors. Don't buffer everything.

## Acceptance criteria

- [ ] `log.debug` and `log.info` only print in Studio (RunService.IsStudio())
- [ ] `log.warn` and `log.error` print everywhere
- [ ] `log.error` fires `log.onError` signal with payload
- [ ] PlayerDataService + SettingsService use `log.*` instead of `print`
- [ ] Format: `[category] level: ...args`
- [ ] `log.setLevel("category", level)` overrides default per category
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] `docs/systems/logger.md` written
