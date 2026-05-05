import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Number, Slider } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Text from "../text/text";
import Box from "./box";

const SEMANTIC = [
	"background",
	"card",
	"primary",
	"secondary",
	"muted",
	"accent",
	"destructive",
	"success",
	"warning",
] as const;
const RADIUS = ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"] as const;
const GRADIENTS = [
	"primary",
	"primarySheen",
	"accent",
	"destructive",
	"success",
	"warning",
	"surface",
	"surfaceTop",
	"shimmer",
] as const;

const Story = CreateReactStory(
	{
		summary: "Box — themed container primitive",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			bg: EnumList(
				{
					background: "background",
					card: "card",
					primary: "primary",
					secondary: "secondary",
					accent: "accent",
					destructive: "destructive",
				},
				"card",
			),
			radius: EnumList(
				{ none: "none", sm: "sm", md: "md", lg: "lg", xl: "xl", "2xl": "2xl", full: "full" },
				"lg",
			),
			padding: Slider(4, 0, 12, 1),
			borderThickness: Slider(1, 0, 4, 1),
			showBorder: true,
			width: Number(220, 80, 600, 1),
			height: Number(120, 40, 400, 1),
		},
	},
	(props) => (
		<StoryShell title="Box" subtitle="Themed Frame replacement — bg, border, radius, gradient, padding tokens">
			<Section title="Interactive">
				<Box
					bg={props.controls.bg}
					radius={props.controls.radius}
					padding={props.controls.padding as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12}
					border={props.controls.showBorder ? "border" : undefined}
					borderThickness={props.controls.borderThickness}
					size={new UDim2(0, props.controls.width, 0, props.controls.height)}
				>
					<Text text="Hello box" align="center" alignY="center" frameSize={new UDim2(1, 0, 1, 0)} />
				</Box>
			</Section>

			<Section title="Semantic backgrounds">
				<Row wrap={true}>
					{SEMANTIC.map((token) => (
						<Box bg={token} radius="md" padding={3} size={new UDim2(0, 140, 0, 64)}>
							<Text
								text={token}
								size="sm"
								align="center"
								alignY="center"
								frameSize={new UDim2(1, 0, 1, 0)}
							/>
						</Box>
					))}
				</Row>
			</Section>

			<Section title="Radius scale">
				<Row wrap={true}>
					{RADIUS.map((r) => (
						<Box bg="primary" radius={r} size={new UDim2(0, 88, 0, 64)} />
					))}
				</Row>
			</Section>

			<Section title="Gradients">
				<Row wrap={true}>
					{GRADIENTS.map((g) => (
						<Box bg="card" radius="md" gradient={g} size={new UDim2(0, 160, 0, 80)} />
					))}
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
