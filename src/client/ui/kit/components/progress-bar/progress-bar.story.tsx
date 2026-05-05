import React, { useEffect, useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { RunService } from "@rbxts/services";
import { CreateReactStory, EnumList, Slider } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Stack from "../stack/stack";
import Text from "../text/text";
import ProgressBar, { ProgressBarSize, ProgressBarVariant } from "./progress-bar";

const SIZES: Array<ProgressBarSize> = ["sm", "md", "lg"];
const VARIANTS: Array<ProgressBarVariant> = ["default", "success", "warning", "destructive", "accent"];

function AutoProgress(props: { variant?: ProgressBarVariant; size?: ProgressBarSize; label?: string }) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		const conn = RunService.Heartbeat.Connect((deltaTime) => {
			setValue((current) => {
				const updated = current + deltaTime * 0.25;
				return updated > 1 ? 0 : updated;
			});
		});
		return () => conn.Disconnect();
	}, []);
	return (
		<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.Y}>
			{props.label !== undefined && <Text text={props.label} size="sm" color="mutedForeground" />}
			<ProgressBar value={value} max={1} variant={props.variant} size={props.size} />
		</Stack>
	);
}

const Story = CreateReactStory(
	{
		summary: "ProgressBar — animated fill, indeterminate mode",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			value: Slider(0.4, 0, 1, 0.01),
			size: EnumList({ sm: "sm", md: "md", lg: "lg" }, "md"),
			variant: EnumList(
				{
					default: "default",
					success: "success",
					warning: "warning",
					destructive: "destructive",
					accent: "accent",
				},
				"default",
			),
			indeterminate: false,
		},
	},
	(props) => (
		<StoryShell
			title="ProgressBar"
			subtitle="Spring-animated fill — variants, sizes, indeterminate looping shimmer"
		>
			<Section title="Interactive">
				<ProgressBar
					value={props.controls.value}
					max={1}
					size={props.controls.size}
					variant={props.controls.variant}
					indeterminate={props.controls.indeterminate}
				/>
			</Section>

			<Section title="Variants (auto-cycling)">
				{VARIANTS.map((v) => (
					<AutoProgress variant={v} label={v} />
				))}
			</Section>

			<Section title="Sizes">
				{SIZES.map((s) => (
					<AutoProgress size={s} label={s} />
				))}
			</Section>

			<Section title="Indeterminate">
				<ProgressBar indeterminate={true} />
				<ProgressBar indeterminate={true} variant="success" />
				<ProgressBar indeterminate={true} variant="accent" size="lg" />
			</Section>
		</StoryShell>
	),
);

export = Story;
