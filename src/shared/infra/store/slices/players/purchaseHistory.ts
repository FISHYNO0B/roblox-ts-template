import { createProducer } from "@rbxts/reflex";
import { PURCHASE_HISTORY_CAP } from "shared/domain/Products";
import { PlayerData, PlayerPurchaseHistory } from "./types";

export type PurchaseHistoryState = Readonly<Record<string, PlayerPurchaseHistory | undefined>>;

const initialState: PurchaseHistoryState = {};

export const purchaseHistorySlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.purchaseHistory,
	}),

	closePlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	recordPurchase: (state, playerId: string, purchaseId: string) => {
		const current = state[playerId];
		if (!current) return state;
		if (current.includes(purchaseId)) return state;

		const appended = [...current, purchaseId];
		const overflow = appended.size() - PURCHASE_HISTORY_CAP;
		let trimmed: ReadonlyArray<string> = appended;
		if (overflow > 0) {
			const out: Array<string> = [];
			for (let i = overflow; i < appended.size(); i++) out.push(appended[i]);
			trimmed = out;
		}

		return {
			...state,
			[playerId]: trimmed,
		};
	},
});
