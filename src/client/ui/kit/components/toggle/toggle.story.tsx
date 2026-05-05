import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Text from "../text/text";
import Stack from "../stack/stack";
import Toggle, { ToggleSize } from "./toggle";

const SIZES: Array<ToggleSize> = ["sm", "md", "lg"];

function StatefulToggle(props: { initial?: boolean; size?: ToggleSize; disabled?: boolean; label?: string }) {
	const [checked, setChecked] = useState(props.initial ?? false);
	return (
		<Stack direction="horizontal" spacing={2} align="center" automaticSize={Enum.AutomaticSize.XY}>
			<Toggle checked={checked} onChange={setChecked} size={props.size} disabled={props.disabled} />
			{props.label !== undefined && <Text text={props.label} size="sm" color="mutedForeground" />}
		</Stack>
	);
}

const Story = CreateReactStory(
	{
		summary: "Toggle — animated on/off switch",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			initial: false,
			size: EnumList({ sm: "sm", md: "md", lg: "lg" }, "md"),
			disabled: false,
		},
	},
	(props) => (
		<StoryShell title="Toggle" subtitle="Animated on/off switch — spring-driven thumb + track color">
			<Section title="Interactive">
				<StatefulToggle
					initial={props.controls.initial}
					size={props.controls.size}
					disabled={props.controls.disabled}
				/>
			</Section>

			<Section title="Sizes">
				<Row>
					{SIZES.map((s) => (
						<StatefulToggle initial={true} size={s} label={s} />
					))}
				</Row>
			</Section>

			<Section title="States">
				<Row>
					<StatefulToggle initial={false} label="off" />
					<StatefulToggle initial={true} label="on" />
					<StatefulToggle initial={false} disabled={true} label="disabled off" />
					<StatefulToggle initial={true} disabled={true} label="disabled on" />
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
