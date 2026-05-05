import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Slider } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Button from "../button/button";
import Tooltip, { TooltipSide } from "./tooltip";

const SIDES: Array<TooltipSide> = ["top", "bottom", "left", "right"];

const Story = CreateReactStory(
	{
		summary: "Tooltip — hover-shown popover with side and delay",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			content: "Save your progress",
			side: EnumList({ top: "top", bottom: "bottom", left: "left", right: "right" }, "top"),
			delay: Slider(0.4, 0, 1.5, 0.05),
		},
	},
	(props) => (
		<StoryShell title="Tooltip" subtitle="Hover-shown popover — side, delay, fade-in">
			<Section title="Interactive (hover the button)">
				<Tooltip content={props.controls.content} side={props.controls.side} delay={props.controls.delay}>
					<Button text="Hover me" />
				</Tooltip>
			</Section>

			<Section title="Sides">
				<Row spacing={6}>
					{SIDES.map((side) => (
						<Tooltip content={`Tooltip on ${side}`} side={side} delay={0.2}>
							<Button text={side} variant="outline" />
						</Tooltip>
					))}
				</Row>
			</Section>

			<Section title="Different content">
				<Row>
					<Tooltip content="Save (Ctrl+S)" delay={0.2}>
						<Button text="Save" variant="solid" leftIcon={16545611198} />
					</Tooltip>
					<Tooltip content="Settings (F2)" delay={0.2}>
						<Button variant="ghost" leftIcon={16545611198} />
					</Tooltip>
					<Tooltip
						content="This is a longer tooltip with more information about what this button does."
						side="bottom"
						delay={0.2}
					>
						<Button text="Long tooltip" variant="outline" />
					</Tooltip>
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
