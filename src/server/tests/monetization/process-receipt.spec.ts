import { MonetizationService } from "server/services/MonetizationService";
import { serverStore } from "server/infra/store";
import { DevProductEntry } from "shared/domain/Products";
import { selectPlayerPurchaseHistory } from "shared/infra/store/selectors/players";
import { getDefaultPlayerData } from "shared/infra/store/slices/players/utils";
import { resetStore } from "../utils/resetStore";

const FAKE_PRODUCT_ID = 9999001;
const FAKE_USER_ID = 424242;
const PLAYER_KEY = tostring(FAKE_USER_ID);
const FAKE_PURCHASE_ID = "PURCHASE-ABC";
const FAKE_ENTRY: DevProductEntry = { id: FAKE_PRODUCT_ID, handler: "grantCoins", amount: 100 };

function makeReceipt(purchaseId: string) {
	return {
		PlayerId: FAKE_USER_ID,
		ProductId: FAKE_PRODUCT_ID,
		PurchaseId: purchaseId,
		CurrencySpent: 100,
		CurrencyType: Enum.CurrencyType.Robux,
		PlaceIdWherePurchased: 0,
	};
}

export = () => {
	describe("ProcessReceipt", () => {
		let service: MonetizationService;
		let handlerCalls: number;

		beforeEach(() => {
			service = new MonetizationService();
			service.onInit();
			service.registerProduct(FAKE_PRODUCT_ID, "smallCoins", FAKE_ENTRY);

			handlerCalls = 0;
			service.registerHandler("grantCoins", () => {
				handlerCalls += 1;
			});
		});

		afterEach(() => {
			resetStore();
		});

		it("returns NotProcessedYet for an unknown ProductId", () => {
			serverStore.loadPlayerData(PLAYER_KEY, getDefaultPlayerData());
			serverStore.flush();

			const result = service.processReceipt({
				PlayerId: FAKE_USER_ID,
				ProductId: 1,
				PurchaseId: FAKE_PURCHASE_ID,
				CurrencySpent: 100,
				CurrencyType: Enum.CurrencyType.Robux,
				PlaceIdWherePurchased: 0,
			});

			expect(result).to.equal(Enum.ProductPurchaseDecision.NotProcessedYet);
			expect(handlerCalls).to.equal(0);
		});

		it("returns NotProcessedYet when the player profile is not loaded", () => {
			const result = service.processReceipt(makeReceipt(FAKE_PURCHASE_ID));
			expect(result).to.equal(Enum.ProductPurchaseDecision.NotProcessedYet);
			expect(handlerCalls).to.equal(0);
		});

		it("returns Granted on a replayed PurchaseId without re-running the handler", () => {
			serverStore.loadPlayerData(PLAYER_KEY, {
				...getDefaultPlayerData(),
				purchaseHistory: [FAKE_PURCHASE_ID],
			});
			serverStore.flush();

			const result = service.processReceipt(makeReceipt(FAKE_PURCHASE_ID));

			expect(result).to.equal(Enum.ProductPurchaseDecision.PurchaseGranted);
			expect(handlerCalls).to.equal(0);
		});

		it("does not append a duplicate PurchaseId to history on replay", () => {
			serverStore.loadPlayerData(PLAYER_KEY, {
				...getDefaultPlayerData(),
				purchaseHistory: [FAKE_PURCHASE_ID],
			});
			serverStore.flush();

			service.processReceipt(makeReceipt(FAKE_PURCHASE_ID));
			serverStore.flush();

			const history = serverStore.getState(selectPlayerPurchaseHistory(PLAYER_KEY));
			expect(history).to.be.ok();
			expect(history!.size()).to.equal(1);
		});
	});

	describe("purchaseHistory cap", () => {
		afterEach(() => {
			resetStore();
		});

		it("evicts the oldest entry when the cap is exceeded", () => {
			const seed: Array<string> = [];
			for (let i = 0; i < 50; i++) seed.push(`P-${i}`);

			serverStore.loadPlayerData(PLAYER_KEY, {
				...getDefaultPlayerData(),
				purchaseHistory: seed,
			});
			serverStore.flush();

			serverStore.recordPurchase(PLAYER_KEY, "P-NEW");
			serverStore.flush();

			const history = serverStore.getState(selectPlayerPurchaseHistory(PLAYER_KEY));
			expect(history).to.be.ok();
			expect(history!.size()).to.equal(50);
			expect(history![0]).to.equal("P-1");
			expect(history![49]).to.equal("P-NEW");
		});
	});
};
