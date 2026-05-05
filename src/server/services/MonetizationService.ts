import { OnInit, OnStart, Service } from "@flamework/core";
import { MarketplaceService } from "@rbxts/services";
import { ServerEvents } from "server/infra/network";
import { serverStore } from "server/infra/store";
import {
	DEV_PRODUCT_KEYS,
	DevProductEntry,
	DevProductKey,
	DevProducts,
	GAME_PASS_KEYS,
	GamePassKey,
	GamePasses,
	HandlerMeta,
	HandlerName,
} from "shared/domain/Products";
import { selectHasPass, selectPlayerPurchaseHistory } from "shared/infra/store/selectors/players";
import { getDefaultPlayerPasses } from "shared/infra/store/slices/players/utils";
import { forEveryPlayer } from "shared/utils/forEveryPlayer";

type Handler<H extends HandlerName = HandlerName> = (player: Player, meta: HandlerMeta<H>) => void;

interface ReceiptInfo {
	PlayerId: number;
	ProductId: number;
	PurchaseId: string;
	CurrencySpent: number;
	CurrencyType: Enum.CurrencyType;
	PlaceIdWherePurchased: number;
}

@Service()
export class MonetizationService implements OnInit, OnStart {
	private handlers = new Map<HandlerName, Handler>();
	private productById = new Map<number, { key: DevProductKey; entry: DevProductEntry }>();
	private passById = new Map<number, GamePassKey>();

	onInit() {
		for (const key of DEV_PRODUCT_KEYS) {
			const entry = DevProducts[key] as DevProductEntry;
			if (entry.id !== 0) this.registerProduct(entry.id, key, entry);
		}
		for (const key of GAME_PASS_KEYS) {
			const id = GamePasses[key].id;
			if (id !== 0) this.passById.set(id, key);
		}
	}

	public registerProduct(id: number, key: DevProductKey, entry: DevProductEntry) {
		this.productById.set(id, { key, entry });
	}

	onStart() {
		MarketplaceService.ProcessReceipt = (info) => this.processReceipt(info);

		ServerEvents.promptPurchase.connect((player, productKey) => this.promptProduct(player, productKey));
		ServerEvents.promptPass.connect((player, passKey) => this.promptPass(player, passKey));

		forEveryPlayer((player) => this.loadPasses(player));
	}

	public registerHandler<H extends HandlerName>(name: H, handler: Handler<H>) {
		this.handlers.set(name, handler as unknown as Handler);
	}

	public promptProduct(player: Player, key: DevProductKey) {
		const entry = DevProducts[key] as DevProductEntry;
		if (entry.id === 0) {
			warn(
				`monetization: cannot prompt "${key}" — id is 0 (stub). Set a real product id in shared/domain/Products.ts.`,
			);
			return;
		}
		MarketplaceService.PromptProductPurchase(player, entry.id);
	}

	public promptPass(player: Player, key: GamePassKey) {
		const id = GamePasses[key].id;
		if (id === 0) {
			warn(
				`monetization: cannot prompt pass "${key}" — id is 0 (stub). Set a real pass id in shared/domain/Products.ts.`,
			);
			return;
		}
		MarketplaceService.PromptGamePassPurchase(player, id);
	}

	public ownsPass(player: Player, key: GamePassKey): boolean {
		return serverStore.getState(selectHasPass(tostring(player.UserId), key));
	}

	/**
	 * Debug helper. Skips MarketplaceService entirely and calls the registered
	 * handler directly. Bypasses idempotency — calling twice grants twice.
	 */
	public grantProductDirect(player: Player, key: DevProductKey) {
		const entry = DevProducts[key] as DevProductEntry;
		const handler = this.handlers.get(entry.handler);
		if (!handler) {
			warn(`monetization: no handler "${entry.handler}" registered for "${key}"`);
			return;
		}
		handler(player, entry as never);
	}

	public processReceipt(info: ReceiptInfo): Enum.ProductPurchaseDecision {
		const product = this.productById.get(info.ProductId);
		if (!product) {
			warn(`monetization: ProcessReceipt got unknown ProductId ${info.ProductId} — returning NotProcessedYet`);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		const playerId = tostring(info.PlayerId);
		const history = serverStore.getState(selectPlayerPurchaseHistory(playerId));

		if (history === undefined) {
			warn(`monetization: ProcessReceipt for ${info.PlayerId} but no profile loaded — NotProcessedYet`);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		if (history.includes(info.PurchaseId)) return Enum.ProductPurchaseDecision.PurchaseGranted;

		const handler = this.handlers.get(product.entry.handler);
		if (!handler) {
			warn(
				`monetization: no handler "${product.entry.handler}" registered for "${product.key}" — NotProcessedYet`,
			);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		const player = this.findPlayer(info.PlayerId);
		if (!player) return Enum.ProductPurchaseDecision.NotProcessedYet;

		const [ok] = pcall(() => handler(player, product.entry as never));
		if (!ok) return Enum.ProductPurchaseDecision.NotProcessedYet;

		serverStore.recordPurchase(playerId, info.PurchaseId);
		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}

	private loadPasses(player: Player) {
		const playerId = tostring(player.UserId);
		const passes = getDefaultPlayerPasses();

		for (const key of GAME_PASS_KEYS) {
			const id = GamePasses[key].id;
			if (id === 0) continue;

			const [ok, owned] = pcall(() => MarketplaceService.UserOwnsGamePassAsync(player.UserId, id));
			if (!ok) {
				warn(`monetization: UserOwnsGamePassAsync failed for ${player.Name} pass "${key}": ${tostring(owned)}`);
				continue;
			}
			passes[key] = owned;
		}

		serverStore.setPasses(playerId, passes);
	}

	private findPlayer(userId: number): Player | undefined {
		for (const player of game.GetService("Players").GetPlayers()) {
			if (player.UserId === userId) return player;
		}
		return undefined;
	}
}
