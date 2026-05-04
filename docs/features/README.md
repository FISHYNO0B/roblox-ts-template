# Features

The idea → spec → done workflow.

## Stages

| Folder | Contains |
|---|---|
| `inbox/` | Raw ideas. One file per idea. A paragraph is fine. No commitment. |
| `active/` | Features being worked on now. Has a real spec (problem, scope, plan, tasks, acceptance criteria). |
| `done/` | Shipped features. Each has a short retro at the bottom: what worked, what surprised us. |

## Lifecycle

1. **Capture** — drop the idea in `inbox/<short-slug>.md`. Don't think too hard about it.
2. **Pull** — when you want to actually work on it: ask Claude to "pull `<slug>` into active".
3. **Grill** — Claude runs `grill-with-docs` to pressure-test against `CONTEXT.md` and existing systems. The result fills out the spec template.
4. **Implement** — Claude executes the plan. Tasks get checked off as they complete.
5. **Test** — acceptance criteria are verified.
6. **Retro** — file moves to `done/`, with one paragraph on what we learned.

## Spec template

See [_template.md](_template.md) for the structure each `active/` file follows.

## Keep ideas, lose ideas

Ideas in `inbox/` aren't promises. Delete (or move to `done/` with a "skipped — reason" note) anything you decide not to do. Don't let `inbox/` become a graveyard.
