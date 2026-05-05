import { Currency } from "shared/domain/Currency";
import { SharedState } from "../index";
import { createSelector } from "@rbxts/reflex";
import { defaultPlayerData } from "../slices/players/utils";
import { PlayerData } from "../slices/players/types";
import { GamePassKey } from "shared/domain/Products";
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

export const selectPlayerPurchaseHistory = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.purchaseHistory[playerId];
	};
};

export const selectHasPurchase = (playerId: string, purchaseId: string) => {
	return createSelector(selectPlayerPurchaseHistory(playerId), (history) => {
		return history?.includes(purchaseId) ?? false;
	});
};

export const selectPlayerPasses = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.passes[playerId];
	};
};

export const selectHasPass = (playerId: string, key: GamePassKey) => {
	return createSelector(selectPlayerPasses(playerId), (passes) => {
		return passes?.[key] ?? false;
	});
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalances(playerId),
		selectPlayerSettings(playerId),
		selectPlayerPurchaseHistory(playerId),
		(balances, settings, purchaseHistory) => {
			return {
				balance: balances ?? defaultPlayerData.balance,
				settings: settings ?? defaultPlayerData.settings,
				purchaseHistory: purchaseHistory ?? defaultPlayerData.purchaseHistory,
			} as PlayerData;
		},
	);
};
