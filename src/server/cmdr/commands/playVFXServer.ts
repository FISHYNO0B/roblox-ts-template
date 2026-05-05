import { Dependency } from "@flamework/core";
import { CommandContext } from "@rbxts/cmdr";
import { VFXService } from "server/services/VFXService";
import { VFXKey } from "shared/domain/assets/VFX";

export = function (context: CommandContext, key: VFXKey) {
	const character = context.Executor.Character;
	const root = character?.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
	const cframe = root?.CFrame ?? new CFrame(0, 5, 0);
	Dependency<VFXService>().play(key, cframe);
	return `Played VFX ${key}`;
};
