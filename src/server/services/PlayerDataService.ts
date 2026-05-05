import { OnInit, Service } from "@flamework/core";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { Players, RunService } from "@rbxts/services";
import { serverStore } from "server/infra/store";
import { selectPlayerData } from "shared/infra/store/selectors/players";
import { PlayerData } from "shared/infra/store/slices/players/types";
import { getDefaultPlayerData } from "shared/infra/store/slices/players/utils";
import { forEveryPlayer } from "shared/utils/forEveryPlayer";

let DataStoreName = "Production";
const KEY_TEMPLATE = "%d_Data";

if (RunService.IsStudio()) DataStoreName = "Testing";

@Service()
export class PlayerDataService implements OnInit {
	private profileStore = ProfileService.GetProfileStore(DataStoreName, getDefaultPlayerData());
	private profiles = new Map<Player, Profile<PlayerData>>();

	onInit() {
		forEveryPlayer(
			(player) => this.createProfile(player),
			(player) => this.removeProfile(player),
		);

		// Demo: gives every player +1 Coin per second so the template's reflex broadcast
		// is visible without writing any gameplay logic. Remove for a real game.
		task.spawn(() => {
			while (true) {
				Players.GetPlayers().forEach((player) =>
					serverStore.changeBalance(tostring(player.UserId), "Coins", 1),
				);
				task.wait(1);
			}
		});
	}

	private createProfile(player: Player) {
		const userId = player.UserId;
		const userIdStr = tostring(userId);
		const profileKey = KEY_TEMPLATE.format(userId);
		const profile = this.profileStore.LoadProfileAsync(profileKey);

		if (!profile) return player.Kick();

		profile.AddUserId(userId);
		profile.Reconcile();

		this.profiles.set(player, profile);
		serverStore.loadPlayerData(userIdStr, profile.Data);

		const unsubscribeData = serverStore.subscribe(selectPlayerData(userIdStr), (save) => {
			if (save) profile.Data = save;
		});

		profile.ListenToRelease(() => {
			unsubscribeData();
			this.profiles.delete(player);
			serverStore.closePlayerData(userIdStr);
			player.Kick();
		});
	}

	private removeProfile(player: Player) {
		const profile = this.profiles.get(player);
		profile?.Release();
	}

	public getProfile(player: Player) {
		return this.profiles.get(player);
	}
}
