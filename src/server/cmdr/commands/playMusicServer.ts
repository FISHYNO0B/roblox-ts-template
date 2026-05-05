import { Dependency } from "@flamework/core";
import { CommandContext } from "@rbxts/cmdr";
import { SoundService } from "server/services/SoundService";
import { MusicKey } from "shared/domain/assets/Music";

export = function (context: CommandContext, key: MusicKey) {
	Dependency<SoundService>().playMusicFor(context.Executor, key);
};
