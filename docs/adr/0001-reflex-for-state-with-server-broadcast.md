# Use Reflex with broadcaster/receiver for all shared state

We use Reflex on both sides and sync server→client via a broadcaster middleware (server) and a receiver middleware (client). Player-touching values go through the store; one-off RPCs (e.g. `toggleSetting`) use Flamework Networking and then dispatch a store action server-side.

**Why:** A single mental model for "where does this data live and when does it change" beats juggling RemoteEvents, ad-hoc replication, and React-local state. The broadcaster handles batching and ordering for free, and selectors give us cheap, granular React subscriptions.

**Trade-off:** Every "I just want to send one value" change has to go through a slice + action + selector. For very rare, ephemeral signals (effects, animations, hit feedback) it's overkill — those should stay as direct events.
