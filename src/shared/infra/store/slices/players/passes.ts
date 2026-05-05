import { createProducer } from "@rbxts/reflex";
import { GamePassKey } from "shared/domain/Products";
import { PlayerPasses } from "./types";

export type PassesState = Readonly<Record<string, PlayerPasses | undefined>>;

const initialState: PassesState = {};

export const passesSlice = createProducer(initialState, {
	setPasses: (state, playerId: string, passes: PlayerPasses) => ({
		...state,
		[playerId]: passes,
	}),

	setPass: (state, playerId: string, key: GamePassKey, owned: boolean) => {
		const current = state[playerId];
		if (!current) return state;

		return {
			...state,
			[playerId]: {
				...current,
				[key]: owned,
			},
		};
	},

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
});
