import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "setVolume",
	Aliases: ["sV"],
	Description: "Set a player's volume group (0..1)",
	Group: "Admin",
	Args: [
		{
			Type: "player",
			Name: "player",
			Description: "Player",
		},
		{
			Type: "volumeGroup",
			Name: "Group",
			Description: "master | sfx | music | ambience",
		},
		{
			Type: "number",
			Name: "Value",
			Description: "0..1",
		},
	],
});
