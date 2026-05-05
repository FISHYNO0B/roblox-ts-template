import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Slider } from "@rbxts/ui-labs";
import { IconKey } from "shared/domain/assets/Icons";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Box from "../box/box";
import Text from "../text/text";
import Stack from "../stack/stack";
import Icon from "./icon";

const SAMPLE_ICONS: Array<IconKey> = ["settings", "coin", "gem"];

const TINTS = ["foreground", "mutedForeground", "primary", "destructive", "success", "warning", "accent"] as const;

const Story = CreateReactStory(
	{
		summary: "Icon — themed image label",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			icon: EnumList({ settings: "settings", coin: "coin", gem: "gem" } as const, "coin"),
			size: Slider(32, 12, 96, 2),
			color: EnumList(
				{ foreground: "foreground", primary: "primary", success: "success", destructive: "destructive" },
				"foreground",
			),
		},
	},
	(props) => (
		<StoryShell title="Icon" subtitle="Themed ImageLabel — IconKey, size, color token">
			<Section title="Interactive">
				<Icon icon={props.controls.icon} size={props.controls.size} color={props.controls.color} />
			</Section>

			<Section title="Sample assets">
				<Row wrap={true}>
					{SAMPLE_ICONS.map((key) => (
						<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.XY}>
							<Box bg="card" radius="md" padding={3}>
								<Icon icon={key} size={48} color="foreground" />
							</Box>
							<Text text={key} size="xs" color="mutedForeground" align="center" />
						</Stack>
					))}
				</Row>
			</Section>

			<Section title="Tints">
				<Row wrap={true}>
					{TINTS.map((t) => (
						<Box bg="card" radius="md" padding={3}>
							<Icon icon="coin" size={32} color={t} />
						</Box>
					))}
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
