# Localization

> Status: inbox
> Level: system
> Phase: 2
> Depends on: (none; touches many UI components in fas 4 of impl, but spec is self-contained)
> ADR needed: yes — `0009-localization.md`

## Idea

Type-safe i18n keyed off Roblox `LocalizationService`. Strings registered under `shared/domain/Strings.ts` with one source-of-truth language (English). Other languages added as override tables. React hook `useTranslate()` + a `<Translate>` component for tagged strings. Auto-uses player's `LocaleId` from `LocalizationService.GetTranslatorForPlayerAsync`. Falls back to source on missing key.

## API sketch

```ts
// shared/domain/Strings.ts — source of truth (English)
export const Strings = {
  "currency.coins":       "Coins",
  "currency.gems":        "Gems",
  "settings.title":       "Settings",
  "settings.pvp":         "PvP",
  "shop.purchase":        "Purchase",
  "shop.notEnoughCoins":  "Not enough coins",
  "notification.welcome": "Welcome, {name}!",   // {placeholder} interpolation
} as const;
export type StringKey = keyof typeof Strings;

// shared/domain/locales/sv.ts (per-language override)
export const sv: Partial<Record<StringKey, string>> = {
  "currency.coins": "Mynt",
  "settings.title": "Inställningar",
  // missing keys fall back to source
};

// React API
const t = useTranslate();
<Text>{t("settings.title")}</Text>
<Text>{t("notification.welcome", { name: player.Name })}</Text>

// Or component form
<Translate k="settings.title" />
<Translate k="notification.welcome" vars={{ name: "Hector" }} />
```

## Files

- `src/shared/domain/Strings.ts` (new — source/English)
- `src/shared/domain/locales/sv.ts` (new — Swedish stub example)
- `src/shared/domain/locales/index.ts` (new — registry of all locales)
- `src/client/services/LocalizationController.ts` (new — `@Controller`; resolves player locale, exposes lookup)
- `src/client/ui/kit/hooks/use-translate.ts` (new — React hook reading from controller)
- `src/client/ui/kit/components/translate/translate.tsx` (new — declarative form)
- `src/server/cmdr/commands/setLocale.ts` + `setLocaleServer.ts` (debug — force locale for testing)
- `docs/systems/localization.md` (new)
- `docs/adr/0009-localization.md` (new)

## Dependencies

- None hard. Strings used downstream by Notifications, Settings UI, Shop UI, etc. — but those features can adopt incrementally.

## Decisions to make

- **D1: LocalizationService Tables vs in-source registry.** Roblox has its own `LocalizationTable` system. **Rec: in-source registry only.** Pros: typesafe, no Studio sync ritual, version-controlled. Cons: doesn't show up in Roblox's auto-translate panel. Worth the trade — typesafety > admin-panel integration.
- **D2: Source language.** **Rec: English (`en-us`).** Industry default. Player joining without a matching locale falls back to it.
- **D3: Locale detection.** **Rec: `LocalizationService.GetTranslatorForPlayerAsync(player).LocaleId`** server-side, push to player's `client` slice. Client reads via `useSelector`.
- **D4: Placeholder syntax.** **Rec: `{name}`.** Standard. Simple regex replace at render.
- **D5: Pluralization.** Out of scope. Add `t.plural(key, count)` later if any feature needs it.
- **D6: Per-page lazy load.** **Rec: no.** All strings ship in one bundle. Roblox doesn't have a streaming benefit here.
- **D7: How many initial locales?** **Rec: English (source) + Swedish stub (proves the override mechanism).**

## Acceptance criteria

- [ ] `Strings` registry has 5+ entries; `StringKey` type works
- [ ] `useTranslate()` returns the source string when no override matches
- [ ] Swedish locale overrides return Swedish; missing keys fall back to English
- [ ] Placeholder interpolation: `t("notification.welcome", { name: "X" })` → `"Welcome, X!"`
- [ ] `<Translate k="..." />` component variant works
- [ ] Cmdr `setLocale sv` switches the player's locale at runtime; UI updates without rejoin
- [ ] Settings page title uses translation (proof of integration)
- [ ] `npm run typecheck` + `npm run lint` clean
- [ ] ADR + `docs/systems/localization.md` written
