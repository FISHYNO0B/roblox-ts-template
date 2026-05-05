import { useSelector } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import { ClientEvents } from "client/infra/network";
import { Box, Stack, Text, Toggle } from "client/ui/kit";
import { Setting } from "shared/domain/Settings";
import { RunService } from "@rbxts/services";
import { selectPlayerSetting } from "shared/infra/store/selectors/players";
import { GetStatePlayerId } from "client/ui/utils/GetStatePlayerId";
import { clientStore } from "client/infra/store";

interface Props {
	setting: Setting;
}

export default function SettingButton(props: Props) {
	const value = useSelector(selectPlayerSetting(GetStatePlayerId(), props.setting));

	const toggle = () => {
		const isInGame = RunService.IsRunning();
		if (isInGame) ClientEvents.toggleSetting(props.setting);
		else clientStore.toggleSetting(GetStatePlayerId(), props.setting);
	};

	return (
		<Box bg="card" border="border" radius="md" paddingX={4} paddingY={3} size={new UDim2(1, 0, 0, 56)}>
			<Stack
				direction="horizontal"
				spacing={3}
				align="center"
				size={new UDim2(1, 0, 1, 0)}
				automaticSize={Enum.AutomaticSize.None}
			>
				<Text
					text={props.setting}
					size="lg"
					color="cardForeground"
					align="left"
					alignY="center"
					frameSize={new UDim2(1, -60, 1, 0)}
					layoutOrder={0}
				/>
				<Toggle checked={value ?? false} onChange={toggle} layoutOrder={1} />
			</Stack>
		</Box>
	);
}
