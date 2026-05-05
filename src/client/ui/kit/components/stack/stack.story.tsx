import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Slider } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Box from "../box/box";
import Text from "../text/text";
import Stack from "./stack";

function Item(props: { i: number }) {
	return (
		<Box bg="primary" radius="md" size={new UDim2(0, 64, 0, 48)}>
			<Text text={`${props.i}`} size="lg" align="center" alignY="center" frameSize={new UDim2(1, 0, 1, 0)} />
		</Box>
	);
}

const Story = CreateReactStory(
	{
		summary: "Stack — VStack / HStack layout",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			direction: EnumList({ vertical: "vertical", horizontal: "horizontal" }, "horizontal"),
			spacing: Slider(3, 0, 12, 1),
			align: EnumList({ start: "start", center: "center", end: "end" }, "center"),
			justify: EnumList({ start: "start", center: "center", end: "end" }, "start"),
			items: Slider(5, 1, 12, 1),
		},
	},
	(props) => {
		const items: Array<number> = [];
		for (let i = 1; i <= props.controls.items; i++) items.push(i);
		const spacingToken = props.controls.spacing as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

		return (
			<StoryShell title="Stack" subtitle="Layout primitive — direction, spacing, align, justify, wrap">
				<Section title="Interactive">
					<Box bg="card" radius="md" padding={4} size={new UDim2(1, 0, 0, 240)}>
						<Stack
							direction={props.controls.direction}
							spacing={spacingToken}
							align={props.controls.align}
							justify={props.controls.justify}
							size={new UDim2(1, 0, 1, 0)}
							automaticSize={Enum.AutomaticSize.None}
						>
							{items.map((i) => (
								<Item i={i} />
							))}
						</Stack>
					</Box>
				</Section>

				<Section title="Vertical">
					<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y}>
						{[1, 2, 3].map((i) => (
							<Item i={i} />
						))}
					</Stack>
				</Section>

				<Section title="Horizontal">
					<Stack direction="horizontal" spacing={2} automaticSize={Enum.AutomaticSize.Y}>
						{[1, 2, 3, 4, 5].map((i) => (
							<Item i={i} />
						))}
					</Stack>
				</Section>

				<Section title="Wrap">
					<Box
						bg="card"
						radius="md"
						padding={3}
						size={new UDim2(1, 0, 0, 0)}
						automaticSize={Enum.AutomaticSize.Y}
					>
						<Stack
							direction="horizontal"
							spacing={2}
							wrap={true}
							automaticSize={Enum.AutomaticSize.Y}
							size={new UDim2(1, 0, 0, 0)}
						>
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
								<Item i={i} />
							))}
						</Stack>
					</Box>
				</Section>
			</StoryShell>
		);
	},
);

export = Story;
