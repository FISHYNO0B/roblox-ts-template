import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "playVFX",
	Aliases: ["pV"],
	Description: "Play a VFX at the executor's CFrame",
	Group: "Admin",
	Args: [
		{
			Type: "vfxKey",
			Name: "Key",
			Description: "VFX registry key",
		},
	],
});
