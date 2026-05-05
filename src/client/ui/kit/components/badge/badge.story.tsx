import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Badge, { BadgeSize, BadgeVariant } from "./badge";

const VARIANTS: Array<BadgeVariant> = [
	"default",
	"secondary",
	"destructive",
	"success",
	"warning",
	"accent",
	"outline",
];
const SIZES: Array<BadgeSize> = ["sm", "md"];

const Story = CreateReactStory(
	{
		summary: "Badge — small status pill",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			text: "Beta",
			variant: EnumList(
				{
					default: "default",
					secondary: "secondary",
					destructive: "destructive",
					success: "success",
					warning: "warning",
					accent: "accent",
					outline: "outline",
				},
				"default",
			),
			size: EnumList({ sm: "sm", md: "md" }, "md"),
		},
	},
	(props) => (
		<StoryShell title="Badge" subtitle="Compact label — variant, size">
			<Section title="Interactive">
				<Badge text={props.controls.text} variant={props.controls.variant} size={props.controls.size} />
			</Section>

			<Section title="All variants (md)">
				<Row wrap={true}>
					{VARIANTS.map((v) => (
						<Badge text={v} variant={v} size="md" />
					))}
				</Row>
			</Section>

			<Section title="All variants (sm)">
				<Row wrap={true}>
					{VARIANTS.map((v) => (
						<Badge text={v} variant={v} size="sm" />
					))}
				</Row>
			</Section>

			<Section title="Per size">
				{SIZES.map((s) => (
					<Row wrap={true}>
						{VARIANTS.map((v) => (
							<Badge text={`${v} ${s}`} variant={v} size={s} />
						))}
					</Row>
				))}
			</Section>
		</StoryShell>
	),
);

export = Story;
