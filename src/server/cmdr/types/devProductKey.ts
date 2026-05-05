import { Registry } from "@rbxts/cmdr";
import { DEV_PRODUCT_KEYS } from "shared/domain/Products";

export = function (registry: Registry) {
	registry.RegisterType("devProductKey", registry.Cmdr.Util.MakeEnumType("devProductKey", [...DEV_PRODUCT_KEYS]));
};
