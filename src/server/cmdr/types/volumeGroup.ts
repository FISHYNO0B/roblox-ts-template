import { Registry } from "@rbxts/cmdr";
import { VOLUME_GROUPS } from "shared/domain/Settings";

export = function (registry: Registry) {
	registry.RegisterType("volumeGroup", registry.Cmdr.Util.MakeEnumType("volumeGroup", [...VOLUME_GROUPS]));
};
