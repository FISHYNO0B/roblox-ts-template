import { Registry } from "@rbxts/cmdr";
import { Music } from "shared/domain/assets/Music";

export = function (registry: Registry) {
	const keys = new Array<string>();
	for (const [key] of pairs(Music)) {
		keys.push(key as string);
	}
	registry.RegisterType("musicKey", registry.Cmdr.Util.MakeEnumType("musicKey", keys));
};
