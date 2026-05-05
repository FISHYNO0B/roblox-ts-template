/**
 * Stub ids — replace with real Roblox asset ids before shipping. Keeping them
 * as 0 means MarketplaceService prompts will fail at runtime, which is the
 * intended template default.
 */

export interface GrantCoinsHandler {
	id: number;
	handler: "grantCoins";
	amount: number;
}

export interface GrantGemsHandler {
	id: number;
	handler: "grantGems";
	amount: number;
}

export interface GrantPackHandler {
	id: number;
	handler: "grantPack";
	pack: "starter";
}

export type DevProductEntry = GrantCoinsHandler | GrantGemsHandler | GrantPackHandler;

export const DevProducts = {
	smallCoins: { id: 0, handler: "grantCoins", amount: 100 },
	mediumCoins: { id: 0, handler: "grantCoins", amount: 500 },
	smallGems: { id: 0, handler: "grantGems", amount: 25 },
	starterPack: { id: 0, handler: "grantPack", pack: "starter" },
} as const satisfies Record<string, DevProductEntry>;

export type DevProductKey = keyof typeof DevProducts;
export const DEV_PRODUCT_KEYS = (() => {
	const keys: Array<DevProductKey> = [];
	for (const [key] of pairs(DevProducts)) keys.push(key);
	return keys;
})();

export const GamePasses = {
	vip: { id: 0 },
	doubleCoin: { id: 0 },
} as const satisfies Record<string, { id: number }>;

export type GamePassKey = keyof typeof GamePasses;
export const GAME_PASS_KEYS = (() => {
	const keys: Array<GamePassKey> = [];
	for (const [key] of pairs(GamePasses)) keys.push(key);
	return keys;
})();

export type HandlerName = DevProductEntry["handler"];
export type HandlerMeta<H extends HandlerName> = Extract<DevProductEntry, { handler: H }>;

export const PURCHASE_HISTORY_CAP = 50;
