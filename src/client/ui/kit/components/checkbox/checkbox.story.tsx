import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Checkbox, { CheckboxSize } from "./checkbox";

const SIZES: Array<CheckboxSize> = ["sm", "md", "lg"];

function StatefulCheckbox(props: { initial?: boolean; size?: CheckboxSize; disabled?: boolean; label?: string }) {
	const [checked, setChecked] = useState(props.initial ?? false);
	return (
		<Checkbox
			checked={checked}
			onChange={setChecked}
			size={props.size}
			disabled={props.disabled}
			label={props.label}
		/>
	);
}

const Story = CreateReactStory(
	{
		summary: "Checkbox — animated tick",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			initial: false,
			size: EnumList({ sm: "sm", md: "md", lg: "lg" }, "md"),
			disabled: false,
			label: "Accept terms",
		},
	},
	(props) => (
		<StoryShell title="Checkbox" subtitle="Animated tick — bounce on check, fade transparency">
			<Section title="Interactive">
				<StatefulCheckbox
					initial={props.controls.initial}
					size={props.controls.size}
					disabled={props.controls.disabled}
					label={props.controls.label}
				/>
			</Section>

			<Section title="Sizes">
				<Row>
					{SIZES.map((s) => (
						<StatefulCheckbox initial={true} size={s} label={s} />
					))}
				</Row>
			</Section>

			<Section title="States">
				<Row wrap={true}>
					<StatefulCheckbox initial={false} label="unchecked" />
					<StatefulCheckbox initial={true} label="checked" />
					<StatefulCheckbox initial={false} disabled={true} label="disabled unchecked" />
					<StatefulCheckbox initial={true} disabled={true} label="disabled checked" />
				</Row>
			</Section>

			<Section title="Without label">
				<Row>
					<StatefulCheckbox initial={true} />
					<StatefulCheckbox initial={false} />
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
