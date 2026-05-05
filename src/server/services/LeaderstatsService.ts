import { OnStart, Service } from "@flamework/core";
import { serverStore } from "server/infra/store";
import { Currency } from "shared/domain/Currency";
import { selectPlayerBalances } from "shared/infra/store/selectors/players";
import { forEveryPlayer } from "shared/utils/forEveryPlayer";

const LEADERSTATS_CURRENCIES: ReadonlyArray<Currency> = ["Coins", "Gems"];

@Service()
export class LeaderstatsService implements OnStart {
	private subscriptions = new Map<Player, () => void>();

	onStart() {
		forEveryPlayer(
			(player) => this.setupPlayer(player),
			(player) => this.cleanupPlayer(player),
		);
	}

	private setupPlayer(player: Player) {
		const userIdStr = tostring(player.UserId);

		const leaderstats = new Instance("Folder");
		leaderstats.Name = "leaderstats";

		const values = new Map<Currency, IntValue>();
		for (const currency of LEADERSTATS_CURRENCIES) {
			const value = new Instance("IntValue");
			value.Name = currency;
			value.Parent = leaderstats;
			values.set(currency, value);
		}

		leaderstats.Parent = player;

		const apply = (balances: ReturnType<ReturnType<typeof selectPlayerBalances>>) => {
			for (const currency of LEADERSTATS_CURRENCIES) {
				const stat = values.get(currency);
				if (stat) stat.Value = balances?.[currency] ?? 0;
			}
		};

		// Apply current state immediately in case the balance is already loaded,
		// then keep it in sync with future changes.
		apply(serverStore.getState(selectPlayerBalances(userIdStr)));
		const unsubscribe = serverStore.subscribe(selectPlayerBalances(userIdStr), apply);

		this.subscriptions.set(player, unsubscribe);
	}

	private cleanupPlayer(player: Player) {
		const unsubscribe = this.subscriptions.get(player);
		unsubscribe?.();
		this.subscriptions.delete(player);
	}
}
