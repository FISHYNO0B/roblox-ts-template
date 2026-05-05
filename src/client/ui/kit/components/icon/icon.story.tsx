import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Slider } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Box from "../box/box";
import Text from "../text/text";
import Stack from "../stack/stack";
import Icon from "./icon";

const SAMPLE_ASSETS = [
	{ id: 16545611198, label: "settings" },
	{ id: 15416676802, label: "coins" },
	{ id: 15416675953, label: "gems" },
];

const TINTS = ["foreground", "mutedForeground", "primary", "destructive", "success", "warning", "accent"] as const;

const Story = CreateReactStory(
	{
		summary: "Icon — themed image label",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			asset: EnumList({ settings: 16545611198, coins: 15416676802, gems: 15416675953 }, "coins"),
			size: Slider(32, 12, 96, 2),
			color: EnumList(
				{ foreground: "foreground", primary: "primary", success: "success", destructive: "destructive" },
				"foreground",
			),
		},
	},
	(props) => (
		<StoryShell title="Icon" subtitle="Themed ImageLabel — asset id, size, color token">
			<Section title="Interactive">
				<Icon asset={props.controls.asset} size={props.controls.size} color={props.controls.color} />
			</Section>

			<Section title="Sample assets">
				<Row wrap={true}>
					{SAMPLE_ASSETS.map((s) => (
						<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.XY}>
							<Box bg="card" radius="md" padding={3}>
								<Icon asset={s.id} size={48} color="foreground" />
							</Box>
							<Text text={s.label} size="xs" color="mutedForeground" align="center" />
						</Stack>
					))}
				</Row>
			</Section>

			<Section title="Tints">
				<Row wrap={true}>
					{TINTS.map((t) => (
						<Box bg="card" radius="md" padding={3}>
							<Icon asset={15416676802} size={32} color={t} />
						</Box>
					))}
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
