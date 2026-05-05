import { createProducer } from "@rbxts/reflex";
import { Setting, VolumeGroup } from "shared/domain/Settings";
import { PlayerData, PlayerSettings } from "./types";

export type SettingsState = Readonly<Record<string, PlayerSettings | undefined>>;

const initialState: SettingsState = {};

function clampVolume(value: number): number {
	if (value < 0) return 0;
	if (value > 1) return 1;
	return value;
}

export const settingsSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.settings,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	toggleSetting: (state, player: string, setting: Setting) => {
		const current = state[player];
		if (!current) return state;

		return {
			...state,
			[player]: {
				...current,
				toggles: {
					...current.toggles,
					[setting]: !current.toggles[setting],
				},
			},
		};
	},

	setVolume: (state, player: string, group: VolumeGroup, value: number) => {
		const current = state[player];
		if (!current) return state;

		return {
			...state,
			[player]: {
				...current,
				volumes: {
					...current.volumes,
					[group]: clampVolume(value),
				},
			},
		};
	},
});
