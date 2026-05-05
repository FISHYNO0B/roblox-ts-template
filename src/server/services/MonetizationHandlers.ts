import { OnInit, Service } from "@flamework/core";
import { serverStore } from "server/infra/store";
import { MonetizationService } from "./MonetizationService";

@Service()
export class MonetizationHandlers implements OnInit {
	constructor(private monetization: MonetizationService) {}

	onInit() {
		this.monetization.registerHandler("grantCoins", (player, meta) => {
			serverStore.changeBalance(tostring(player.UserId), "Coins", meta.amount);
		});

		this.monetization.registerHandler("grantGems", (player, meta) => {
			serverStore.changeBalance(tostring(player.UserId), "Gems", meta.amount);
		});

		this.monetization.registerHandler("grantPack", (player, meta) => {
			const playerId = tostring(player.UserId);
			if (meta.pack === "starter") {
				serverStore.changeBalance(playerId, "Coins", 250);
				serverStore.changeBalance(playerId, "Gems", 10);
			}
		});
	}
}
