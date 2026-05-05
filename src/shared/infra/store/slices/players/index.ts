import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "./balance";
import { passesSlice } from "./passes";
import { purchaseHistorySlice } from "./purchaseHistory";
import { settingsSlice } from "./settings";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	settings: settingsSlice,
	purchaseHistory: purchaseHistorySlice,
	passes: passesSlice,
});
