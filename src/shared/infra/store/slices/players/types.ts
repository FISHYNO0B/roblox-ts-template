import { Currency } from "shared/domain/Currency";
import { GamePassKey } from "shared/domain/Products";
import { Setting, VolumeGroup } from "shared/domain/Settings";

export interface PlayerData {
	balance: PlayerBalance;
	settings: PlayerSettings;
	purchaseHistory: PlayerPurchaseHistory;
}

export type PlayerBalance = Record<Currency, number>;

export interface PlayerSettings {
	toggles: Record<Setting, boolean>;
	volumes: Record<VolumeGroup, number>;
}

export type PlayerPurchaseHistory = ReadonlyArray<string>;

export type PlayerPasses = Record<GamePassKey, boolean>;
