import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Stack from "../stack/stack";
import Text from "../text/text";
import TextInput, { TextInputSize, TextInputVariant } from "./text-input";

const VARIANTS: Array<TextInputVariant> = ["default", "outline", "ghost"];
const SIZES: Array<TextInputSize> = ["sm", "md", "lg"];

function StatefulInput(props: {
	placeholder?: string;
	size?: TextInputSize;
	variant?: TextInputVariant;
	disabled?: boolean;
	multiline?: boolean;
	label?: string;
	maxLength?: number;
}) {
	const [value, setValue] = useState("");
	return (
		<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.Y}>
			{props.label !== undefined && <Text text={props.label} size="sm" color="mutedForeground" />}
			<TextInput
				value={value}
				onChange={setValue}
				placeholder={props.placeholder ?? "Type here..."}
				size={props.size}
				variant={props.variant}
				disabled={props.disabled}
				multiline={props.multiline}
				maxLength={props.maxLength}
			/>
		</Stack>
	);
}

const Story = CreateReactStory(
	{
		summary: "TextInput — themed text box",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			placeholder: "Type something...",
			size: EnumList({ sm: "sm", md: "md", lg: "lg" }, "md"),
			variant: EnumList({ default: "default", outline: "outline", ghost: "ghost" }, "outline"),
			disabled: false,
			multiline: false,
		},
	},
	(props) => (
		<StoryShell title="TextInput" subtitle="Themed TextBox — variant, size, focus ring, multiline">
			<Section title="Interactive">
				<StatefulInput
					placeholder={props.controls.placeholder}
					size={props.controls.size}
					variant={props.controls.variant}
					disabled={props.controls.disabled}
					multiline={props.controls.multiline}
				/>
			</Section>

			<Section title="Variants">
				{VARIANTS.map((v) => (
					<StatefulInput variant={v} label={v} placeholder={`${v} input`} />
				))}
			</Section>

			<Section title="Sizes">
				{SIZES.map((s) => (
					<StatefulInput size={s} label={s} placeholder={`${s} size`} />
				))}
			</Section>

			<Section title="Multiline">
				<StatefulInput multiline={true} placeholder="Write a description..." />
			</Section>

			<Section title="Disabled">
				<StatefulInput disabled={true} placeholder="Disabled input" />
			</Section>

			<Section title="With max length (10 chars)">
				<StatefulInput maxLength={10} placeholder="Max 10 chars" />
			</Section>
		</StoryShell>
	),
);

export = Story;
