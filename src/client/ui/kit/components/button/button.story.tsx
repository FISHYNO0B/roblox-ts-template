import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Button, { ButtonSize, ButtonVariant } from "./button";

const VARIANTS: Array<ButtonVariant> = ["solid", "secondary", "outline", "ghost", "destructive"];
const SIZES: Array<ButtonSize> = ["sm", "md", "lg"];

const Story = CreateReactStory(
	{
		summary: "Button — interactive with hover/press spring scale",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			text: "Click me",
			variant: EnumList(
				{
					solid: "solid",
					secondary: "secondary",
					outline: "outline",
					ghost: "ghost",
					destructive: "destructive",
				},
				"solid",
			),
			size: EnumList({ sm: "sm", md: "md", lg: "lg" }, "md"),
			disabled: false,
			leftIcon: false,
			rightIcon: false,
		},
	},
	(props) => (
		<StoryShell title="Button" subtitle="Interactive button — variant × size × state, springy hover/press">
			<Section title="Interactive">
				<Button
					text={props.controls.text}
					variant={props.controls.variant}
					size={props.controls.size}
					disabled={props.controls.disabled}
					leftIcon={props.controls.leftIcon ? "settings" : undefined}
					rightIcon={props.controls.rightIcon ? "settings" : undefined}
					onClick={() => print("button clicked")}
				/>
			</Section>

			<Section title="Variants (md)">
				<Row wrap={true}>
					{VARIANTS.map((v) => (
						<Button text={v} variant={v} size="md" onClick={() => print(`${v} clicked`)} />
					))}
				</Row>
			</Section>

			<Section title="Sizes (solid)">
				<Row wrap={true}>
					{SIZES.map((s) => (
						<Button
							text={`size ${s}`}
							variant="solid"
							size={s}
							onClick={() => print(`size ${s} clicked`)}
						/>
					))}
				</Row>
			</Section>

			<Section title="With icons">
				<Row wrap={true}>
					<Button text="Settings" variant="solid" leftIcon="settings" onClick={() => print("settings")} />
					<Button text="Buy coins" variant="solid" rightIcon="coin" onClick={() => print("buy")} />
					<Button text="Delete" variant="destructive" leftIcon="settings" onClick={() => print("delete")} />
					<Button variant="ghost" leftIcon="settings" onClick={() => print("ghost icon")} />
				</Row>
			</Section>

			<Section title="Disabled">
				<Row wrap={true}>
					{VARIANTS.map((v) => (
						<Button text={v} variant={v} size="md" disabled={true} />
					))}
				</Row>
			</Section>

			<Section title="Full width">
				<Button text="Full width solid" variant="solid" fullWidth={true} onClick={() => print("full")} />
			</Section>
		</StoryShell>
	),
);

export = Story;
