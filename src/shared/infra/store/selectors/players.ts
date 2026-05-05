import { Currency } from "shared/domain/Currency";
import { SharedState } from "../index";
import { createSelector } from "@rbxts/reflex";
import { defaultPlayerData } from "../slices/players/utils";
import { PlayerData } from "../slices/players/types";
import { Setting, VolumeGroup } from "shared/domain/Settings";

export const selectPlayerBalances = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.balance[playerId];
	};
};

export const selectPlayerBalance = (playerId: string, currency: Currency) => {
	return createSelector(selectPlayerBalances(playerId), (balances) => {
		return balances?.[currency];
	});
};

export const selectPlayerSettings = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.settings[playerId];
	};
};

export const selectPlayerSetting = (playerId: string, setting: Setting) => {
	return createSelector(selectPlayerSettings(playerId), (settings) => {
		return settings?.toggles[setting];
	});
};

export const selectPlayerVolumes = (playerId: string) => {
	return createSelector(selectPlayerSettings(playerId), (settings) => {
		return settings?.volumes;
	});
};

export const selectPlayerVolume = (playerId: string, group: VolumeGroup) => {
	return createSelector(selectPlayerSettings(playerId), (settings) => {
		return settings?.volumes[group];
	});
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(selectPlayerBalances(playerId), selectPlayerSettings(playerId), (balances, settings) => {
		return {
			balance: balances ?? defaultPlayerData.balance,
			settings: settings ?? defaultPlayerData.settings,
		} as PlayerData;
	});
};
