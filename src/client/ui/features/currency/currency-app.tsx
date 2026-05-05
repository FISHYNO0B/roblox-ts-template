import React from "@rbxts/react";
import { Stack } from "client/ui/kit";
import { CURRENCIES } from "shared/domain/Currency";
import CurrencyFrame from "./components/currency-frame";

export default function CurrencyApp() {
	return (
		<Stack
			direction="vertical"
			spacing={2}
			automaticSize={Enum.AutomaticSize.XY}
			size={new UDim2(0, 0, 0, 0)}
			layoutOrder={0}
		>
			{CURRENCIES.map((currency) => (
				<CurrencyFrame currency={currency} />
			))}
		</Stack>
	);
}
