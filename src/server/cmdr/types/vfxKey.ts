import { Registry } from "@rbxts/cmdr";
import { VFX } from "shared/domain/assets/VFX";

export = function (registry: Registry) {
	const keys = new Array<string>();
	for (const [key] of pairs(VFX)) {
		keys.push(key as string);
	}
	registry.RegisterType("vfxKey", registry.Cmdr.Util.MakeEnumType("vfxKey", keys));
};
