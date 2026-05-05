import { DEFAULT_VOLUME, SETTINGS, VOLUME_GROUPS } from "shared/domain/Settings";
import { PlayerData, PlayerSettings } from "./types";

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
	};
}

export const defaultPlayerData: Readonly<PlayerData> = getDefaultPlayerData();
