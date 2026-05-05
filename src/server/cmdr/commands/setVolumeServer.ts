import { CommandContext } from "@rbxts/cmdr";
import { serverStore } from "server/infra/store";
import { VolumeGroup } from "shared/domain/Settings";

export = function (_context: CommandContext, player: Player, group: VolumeGroup, value: number) {
	serverStore.setVolume(tostring(player.UserId), group, value);
};
