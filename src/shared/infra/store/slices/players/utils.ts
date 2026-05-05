import { GAME_PASS_KEYS } from "shared/domain/Products";
import { DEFAULT_VOLUME, SETTINGS, VOLUME_GROUPS } from "shared/domain/Settings";
import { PlayerData, PlayerPasses, PlayerSettings } from "./types";

export function getDefaultPlayerData(): PlayerData {
	const toggles = {} as PlayerSettings["toggles"];
	SETTINGS.forEach((setting) => {
		toggles[setting] = false;
	});

	const volumes = {} as PlayerSettings["volumes"];
	VOLUME_GROUPS.forEach((group) => {
		volumes[group] = DEFAULT_VOLUME;
	});

	return {
		balance: {
			Coins: 0,
			Gems: 0,
		},
		settings: {
			toggles,
			volumes,
		},
		purchaseHistory: [],
	};
}

export function getDefaultPlayerPasses(): PlayerPasses {
	const passes = {} as PlayerPasses;
	GAME_PASS_KEYS.forEach((key) => {
		passes[key] = false;
	});
	return passes;
}

export const defaultPlayerData: Readonly<PlayerData> = getDefaultPlayerData();
export const defaultPlayerPasses: Readonly<PlayerPasses> = getDefaultPlayerPasses();
