import { SETTINGS } from "shared/domain/Settings";
import { PlayerData, PlayerSettings } from "./types";

export function getDefaultPlayerData(): PlayerData {
	const settings = {} as PlayerSettings;
	SETTINGS.forEach((setting) => {
		settings[setting] = false;
	});

	return {
		balance: {
			Coins: 0,
			Gems: 0,
		},
		settings,
	};
}

export const defaultPlayerData: Readonly<PlayerData> = getDefaultPlayerData();
