import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Slider } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Box from "../box/box";
import Stack from "../stack/stack";
import Text from "../text/text";
import Separator from "./separator";

const Story = CreateReactStory(
	{
		summary: "Separator — horizontal / vertical divider",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			orientation: EnumList({ horizontal: "horizontal", vertical: "vertical" }, "horizontal"),
			thickness: Slider(1, 1, 6, 1),
			color: EnumList({ border: "border", muted: "muted", primary: "primary", accent: "accent" }, "border"),
		},
	},
	(props) => (
		<StoryShell title="Separator" subtitle="Divider — orientation, thickness, color token">
			<Section title="Interactive">
				<Box bg="card" radius="md" padding={4} size={new UDim2(1, 0, 0, 120)}>
					<Stack
						direction={props.controls.orientation === "horizontal" ? "vertical" : "horizontal"}
						spacing={3}
						size={new UDim2(1, 0, 1, 0)}
						automaticSize={Enum.AutomaticSize.None}
					>
						<Text text="Above" />
						<Separator
							orientation={props.controls.orientation}
							thickness={props.controls.thickness}
							color={props.controls.color}
						/>
						<Text text="Below" />
					</Stack>
				</Box>
			</Section>

			<Section title="Horizontal in a card">
				<Box bg="card" radius="md" padding={4}>
					<Stack direction="vertical" spacing={3} automaticSize={Enum.AutomaticSize.Y}>
						<Text text="Profile settings" size="lg" />
						<Separator />
						<Text text="Some descriptive text below the divider." color="mutedForeground" />
					</Stack>
				</Box>
			</Section>
		</StoryShell>
	),
);

export = Story;
