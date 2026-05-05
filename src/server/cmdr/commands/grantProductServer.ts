import { Dependency } from "@flamework/core";
import { CommandContext } from "@rbxts/cmdr";
import { MonetizationService } from "server/services/MonetizationService";
import { DevProductKey } from "shared/domain/Products";

export = function (context: CommandContext, player: Player, key: DevProductKey) {
	Dependency<MonetizationService>().grantProductDirect(player, key);
	return `Granted "${key}" to ${player.Name}`;
};
