import { Currency } from "shared/domain/Currency";
import { Setting, VolumeGroup } from "shared/domain/Settings";

export interface PlayerData {
	balance: PlayerBalance;
	settings: PlayerSettings;
}

export type PlayerBalance = Record<Currency, number>;

export interface PlayerSettings {
	toggles: Record<Setting, boolean>;
	volumes: Record<VolumeGroup, number>;
}
