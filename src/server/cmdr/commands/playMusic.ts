import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "playMusic",
	Aliases: ["pM"],
	Description: "Replace the current music track for the executor",
	Group: "Admin",
	Args: [
		{
			Type: "musicKey",
			Name: "Key",
			Description: "Music registry key",
		},
	],
});
