# Replace primitives with a shadcn-style design system

We replace `client/ui/primitives/` with a new `client/ui/kit/` modeled on shadcn/ui: a token-driven theme, a small variant helper, motion hooks built on `@rbxts/ripple`, and a story per component in UI Labs. The old primitives are migrated feature-by-feature, then deleted. The kit is dark-only and uses `BuilderExtended ExtraBold` (`rbxassetid://16658237174`) as the default font.

**Why:** The current primitives are passthrough wrappers with hardcoded cartoon defaults (5px UIStroke, 22px corner radius, `FredokaOne`, a flat 4-color palette in `shared/domain/Gui.ts`). Every new feature has to override the same handful of props to escape the look, and there is no shared concept of variant, state, or theme. We want a baseline aesthetic that is closer to shadcn — neutral, minimal, theme-driven — and a structure that scales without each feature reinventing it.

**Trade-off:** Every existing UI feature (currency, settings, holder, buttons) needs migrating before the old primitives can be removed; until that lands, two UI systems live in the repo. Going all-in on one stylistic direction (no cartoon variant) makes the kit ~half the work but locks in the look — switching back later means rewriting tokens, not adding a parallel theme.
