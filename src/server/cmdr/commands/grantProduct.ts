import { CommandDefinition } from "@rbxts/cmdr";

export = identity<CommandDefinition>({
	Name: "grantProduct",
	Aliases: ["gP"],
	Description: "Run a DevProduct handler directly (skips ProcessReceipt; for debug only)",
	Group: "Admin",
	Args: [
		{
			Type: "player",
			Name: "player",
			Description: "Player",
		},
		{
			Type: "devProductKey",
			Name: "ProductKey",
			Description: "DevProduct key from shared/domain/Products.ts",
		},
	],
});
