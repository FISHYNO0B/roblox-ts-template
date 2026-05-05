import { useSelectorCreator } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import { Box, Button, Icon, Stack, Text } from "client/ui/kit";
import { Currency } from "shared/domain/Currency";
import { IconKey } from "shared/domain/assets/Icons";
import { selectPlayerBalance } from "shared/infra/store/selectors/players";
import { GetStatePlayerId } from "client/ui/utils/GetStatePlayerId";

interface Props {
	currency: Currency;
}

const CURRENCY_ICONS: Record<Currency, IconKey> = {
	Coins: "coin",
	Gems: "gem",
};

export default function CurrencyFrame(props: Props) {
	const balance = useSelectorCreator(selectPlayerBalance, GetStatePlayerId(), props.currency) ?? 0;

	return (
		<Box bg="card" border="border" radius="lg" padding={2} size={new UDim2(0, 220, 0, 56)}>
			<Stack
				direction="horizontal"
				spacing={3}
				align="center"
				size={new UDim2(1, 0, 1, 0)}
				automaticSize={Enum.AutomaticSize.None}
			>
				<Button
					variant="solid"
					size="sm"
					text="+"
					onClick={() => undefined}
					layoutOrder={0}
					frameSize={new UDim2(0, 36, 0, 36)}
				/>
				<Stack
					direction="horizontal"
					spacing={2}
					align="center"
					justify="end"
					size={new UDim2(1, -44, 1, 0)}
					automaticSize={Enum.AutomaticSize.None}
					layoutOrder={1}
				>
					<Text
						text={tostring(balance)}
						size="xl"
						color="foreground"
						align="right"
						alignY="center"
						frameSize={new UDim2(1, -44, 1, 0)}
						layoutOrder={0}
					/>
					<Icon icon={CURRENCY_ICONS[props.currency]} size={36} layoutOrder={1} />
				</Stack>
			</Stack>
		</Box>
	);
}
