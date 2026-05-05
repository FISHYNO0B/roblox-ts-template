import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Slider } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Box from "../box/box";
import Text from "../text/text";
import ScrollArea from "./scroll-area";

const Story = CreateReactStory(
	{
		summary: "ScrollArea — themed scrolling container",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			direction: EnumList({ vertical: "vertical", horizontal: "horizontal", both: "both" }, "vertical"),
			items: Slider(20, 5, 80, 1),
			padding: Slider(3, 0, 8, 1),
			spacing: Slider(2, 0, 8, 1),
		},
	},
	(props) => {
		const items: Array<number> = [];
		for (let i = 1; i <= props.controls.items; i++) items.push(i);
		const isHorizontal = props.controls.direction === "horizontal";

		return (
			<StoryShell title="ScrollArea" subtitle="Themed scrolling container — vertical / horizontal / both">
				<Section title="Interactive">
					<Box bg="card" radius="md" size={new UDim2(0, 360, 0, 240)} clipsDescendants={true}>
						<ScrollArea
							direction={props.controls.direction}
							padding={props.controls.padding as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8}
							spacing={props.controls.spacing as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8}
							size={new UDim2(1, 0, 1, 0)}
						>
							{items.map((i) => (
								<Box
									bg="primary"
									radius="md"
									padding={2}
									size={isHorizontal ? new UDim2(0, 80, 1, -16) : new UDim2(1, -16, 0, 40)}
								>
									<Text
										text={`Item ${i}`}
										align="center"
										alignY="center"
										frameSize={new UDim2(1, 0, 1, 0)}
									/>
								</Box>
							))}
						</ScrollArea>
					</Box>
				</Section>
			</StoryShell>
		);
	},
);

export = Story;
