import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Box from "../box/box";
import Stack from "../stack/stack";
import Skeleton, { SkeletonShape } from "./skeleton";

const SHAPES: Array<SkeletonShape> = ["rect", "circle", "text"];

function ProfileSkeleton() {
	return (
		<Box bg="card" radius="md" padding={4} size={new UDim2(0, 320, 0, 0)} automaticSize={Enum.AutomaticSize.Y}>
			<Stack direction="horizontal" spacing={3} align="center" automaticSize={Enum.AutomaticSize.Y}>
				<Skeleton shape="circle" width={new UDim(0, 56)} height={new UDim(0, 56)} />
				<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y} layoutOrder={1}>
					<Skeleton shape="text" width={new UDim(0, 160)} height={new UDim(0, 16)} />
					<Skeleton shape="text" width={new UDim(0, 100)} height={new UDim(0, 12)} />
				</Stack>
			</Stack>
		</Box>
	);
}

function CardSkeleton() {
	return (
		<Box bg="card" radius="md" padding={4} size={new UDim2(0, 320, 0, 0)} automaticSize={Enum.AutomaticSize.Y}>
			<Stack direction="vertical" spacing={3} automaticSize={Enum.AutomaticSize.Y}>
				<Skeleton shape="rect" width={new UDim(1, 0)} height={new UDim(0, 120)} />
				<Skeleton shape="text" width={new UDim(1, 0)} height={new UDim(0, 18)} />
				<Skeleton shape="text" width={new UDim(0.7, 0)} height={new UDim(0, 14)} />
				<Skeleton shape="text" width={new UDim(0.5, 0)} height={new UDim(0, 14)} />
			</Stack>
		</Box>
	);
}

const Story = CreateReactStory(
	{
		summary: "Skeleton — pulsing loading placeholders",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			shape: EnumList({ rect: "rect", circle: "circle", text: "text" }, "rect"),
		},
	},
	(props) => (
		<StoryShell title="Skeleton" subtitle="Pulsing placeholders — rect / circle / text shapes">
			<Section title="Interactive">
				<Skeleton shape={props.controls.shape} />
			</Section>

			<Section title="Shapes">
				{SHAPES.map((sh) => (
					<Skeleton shape={sh} />
				))}
			</Section>

			<Section title="Profile placeholder">
				<ProfileSkeleton />
			</Section>

			<Section title="Card placeholder">
				<CardSkeleton />
			</Section>
		</StoryShell>
	),
);

export = Story;
