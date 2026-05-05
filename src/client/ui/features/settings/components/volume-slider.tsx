import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { ClientEvents } from "client/infra/network";
import { clientStore } from "client/infra/store";
import { Box, Slider, Stack, Text } from "client/ui/kit";
import { GetStatePlayerId } from "client/ui/utils/GetStatePlayerId";
import { VolumeGroup } from "shared/domain/Settings";
import { selectPlayerVolume } from "shared/infra/store/selectors/players";

interface Props {
	label: string;
	group: VolumeGroup;
}

export default function VolumeSlider(props: Props) {
	const playerId = GetStatePlayerId();
	const value = useSelector(selectPlayerVolume(playerId, props.group)) ?? 1;

	const change = (nextValue: number) => {
		const isInGame = RunService.IsRunning();
		if (isInGame) ClientEvents.setVolume(props.group, nextValue);
		else clientStore.setVolume(playerId, props.group, nextValue);
	};

	return (
		<Box bg="card" border="border" radius="md" paddingX={4} paddingY={3} size={new UDim2(1, 0, 0, 64)}>
			<Stack
				direction="vertical"
				spacing={1}
				size={new UDim2(1, 0, 1, 0)}
				automaticSize={Enum.AutomaticSize.None}
			>
				<Stack
					direction="horizontal"
					spacing={3}
					align="center"
					size={new UDim2(1, 0, 0, 20)}
					automaticSize={Enum.AutomaticSize.None}
					layoutOrder={0}
				>
					<Text
						text={props.label}
						size="base"
						color="cardForeground"
						align="left"
						alignY="center"
						frameSize={new UDim2(1, -60, 1, 0)}
						layoutOrder={0}
					/>
					<Text
						text={`${math.round(value * 100)}%`}
						size="sm"
						color="mutedForeground"
						align="right"
						alignY="center"
						frameSize={new UDim2(0, 56, 1, 0)}
						layoutOrder={1}
					/>
				</Stack>
				<Slider value={value} onChange={change} min={0} max={1} step={0.01} layoutOrder={1} />
			</Stack>
		</Box>
	);
}
