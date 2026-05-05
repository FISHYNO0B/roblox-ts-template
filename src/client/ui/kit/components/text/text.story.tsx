import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import { fontSize, FontSizeToken } from "../../theme/typography";
import Text from "./text";

const SIZES: Array<FontSizeToken> = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];
const COLORS = ["foreground", "mutedForeground", "primary", "destructive", "success", "warning", "accent"] as const;

const Story = CreateReactStory(
	{
		summary: "Text — themed text label",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			text: "The quick brown fox jumps over the lazy dog",
			size: EnumList(
				{
					xs: "xs",
					sm: "sm",
					base: "base",
					lg: "lg",
					xl: "xl",
					"2xl": "2xl",
					"3xl": "3xl",
					"4xl": "4xl",
					"5xl": "5xl",
					"6xl": "6xl",
				},
				"base",
			),
			color: EnumList(
				{
					foreground: "foreground",
					muted: "mutedForeground",
					primary: "primary",
					destructive: "destructive",
					success: "success",
				},
				"foreground",
			),
			align: EnumList({ left: "left", center: "center", right: "right" }, "left"),
		},
	},
	(props) => (
		<StoryShell title="Text" subtitle="Token-driven TextLabel — size, color, align">
			<Section title="Interactive">
				<Text
					text={props.controls.text}
					size={props.controls.size}
					color={props.controls.color}
					align={props.controls.align}
				/>
			</Section>

			<Section title="Size scale">
				{SIZES.map((s) => (
					<Text text={`${s} (${fontSize[s]}px) — Hamburgefonstiv`} size={s} />
				))}
			</Section>

			<Section title="Colors">
				<Row wrap={true}>
					{COLORS.map((c) => (
						<Text text={c} color={c} size="lg" />
					))}
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
