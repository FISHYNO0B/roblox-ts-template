import React from "@rbxts/react";
import { Box, Button, Heading, ScrollArea, Stack } from "client/ui/kit";
import { clientStore } from "client/infra/store";
import { SETTINGS, VOLUME_GROUPS, VolumeGroup } from "shared/domain/Settings";
import SettingButton from "./components/setting-button";
import VolumeSlider from "./components/volume-slider";

const VOLUME_LABELS: Record<VolumeGroup, string> = {
	master: "Master",
	sfx: "Sound Effects",
	music: "Music",
	ambience: "Ambience",
};

export default function SettingsApp() {
	return (
		<Box
			bg="card"
			border="border"
			radius="xl"
			padding={5}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.5, 0, 0.5, 0)}
			size={new UDim2(0, 560, 0, 600)}
		>
			<Stack
				direction="vertical"
				spacing={4}
				size={new UDim2(1, 0, 1, 0)}
				automaticSize={Enum.AutomaticSize.None}
			>
				<Stack
					direction="horizontal"
					spacing={3}
					align="center"
					size={new UDim2(1, 0, 0, 48)}
					automaticSize={Enum.AutomaticSize.None}
					layoutOrder={0}
				>
					<Heading
						text="Settings"
						level="title"
						frameSize={new UDim2(1, -56, 1, 0)}
						align="left"
						layoutOrder={0}
					/>
					<Button
						variant="ghost"
						size="md"
						text="×"
						onClick={() => clientStore.setHolderPage(undefined)}
						layoutOrder={1}
						frameSize={new UDim2(0, 40, 0, 40)}
					/>
				</Stack>

				<ScrollArea direction="vertical" padding={2} spacing={2} size={new UDim2(1, 0, 1, -64)} layoutOrder={1}>
					{VOLUME_GROUPS.map((group) => (
						<VolumeSlider group={group} label={VOLUME_LABELS[group]} />
					))}
					{SETTINGS.map((setting) => (
						<SettingButton setting={setting} />
					))}
				</ScrollArea>
			</Stack>
		</Box>
	);
}
