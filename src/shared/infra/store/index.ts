import { CombineStates } from "@rbxts/reflex";
import { playersSlice } from "./slices/players";
import { clientSlice } from "./slices/client";
import { effectsSlice } from "./slices/effects";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	players: playersSlice,
	client: clientSlice,
	effects: effectsSlice,
};
