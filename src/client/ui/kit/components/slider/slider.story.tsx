import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Slider as UISlider } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Stack from "../stack/stack";
import Text from "../text/text";
import Slider, { SliderSize } from "./slider";

const SIZES: Array<SliderSize> = ["sm", "md", "lg"];

function StatefulSlider(props: {
	initial?: number;
	min?: number;
	max?: number;
	step?: number;
	size?: SliderSize;
	disabled?: boolean;
}) {
	const [value, setValue] = useState(props.initial ?? 50);
	return (
		<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.Y}>
			<Slider
				value={value}
				onChange={setValue}
				min={props.min}
				max={props.max}
				step={props.step}
				size={props.size}
				disabled={props.disabled}
			/>
			<Text text={`Value: ${math.round(value * 100) / 100}`} size="sm" color="mutedForeground" />
		</Stack>
	);
}

const Story = CreateReactStory(
	{
		summary: "Slider — drag-to-set value",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			initial: UISlider(50, 0, 100, 1),
			min: UISlider(0, 0, 100, 1),
			max: UISlider(100, 0, 200, 1),
			step: UISlider(1, 0, 25, 1),
			size: EnumList({ sm: "sm", md: "md", lg: "lg" }, "md"),
			disabled: false,
		},
	},
	(props) => (
		<StoryShell title="Slider" subtitle="Drag-to-set value — min, max, step, animated thumb">
			<Section title="Interactive">
				<StatefulSlider
					initial={props.controls.initial}
					min={props.controls.min}
					max={props.controls.max}
					step={props.controls.step}
					size={props.controls.size}
					disabled={props.controls.disabled}
				/>
			</Section>

			<Section title="Sizes">
				{SIZES.map((s) => (
					<StatefulSlider initial={50} size={s} />
				))}
			</Section>

			<Section title="Stepped (step=10)">
				<StatefulSlider initial={50} step={10} />
			</Section>

			<Section title="Disabled">
				<StatefulSlider initial={50} disabled={true} />
			</Section>
		</StoryShell>
	),
);

export = Story;
