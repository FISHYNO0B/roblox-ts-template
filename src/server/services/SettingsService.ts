import { OnStart, Service } from "@flamework/core";
import { ServerEvents } from "server/infra/network";
import { serverStore } from "server/infra/store";
import { Setting, VolumeGroup } from "shared/domain/Settings";

@Service({})
export class SettingsService implements OnStart {
	onStart() {
		ServerEvents.toggleSetting.connect((player, setting) => this.toggleSetting(player, setting));
		ServerEvents.setVolume.connect((player, group, value) => this.setVolume(player, group, value));
	}

	private toggleSetting(player: Player, setting: Setting) {
		serverStore.toggleSetting(tostring(player.UserId), setting);
	}

	private setVolume(player: Player, group: VolumeGroup, value: number) {
		serverStore.setVolume(tostring(player.UserId), group, value);
	}
}
