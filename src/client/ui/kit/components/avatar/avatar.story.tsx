import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Avatar, { AvatarShape, AvatarSize, AvatarStatus } from "./avatar";

const SIZES: Array<AvatarSize> = ["xs", "sm", "md", "lg", "xl"];
const SHAPES: Array<AvatarShape> = ["circle", "square"];
const STATUSES: Array<AvatarStatus> = ["online", "away", "busy", "offline"];
const NAMES = ["Aria Stark", "Bran Wyld", "Cassia Vex", "Devon Ray", "Eliza"];
const USER_IDS = [1, 156, 261, 469, 8];

const Story = CreateReactStory(
	{
		summary: "Avatar — circle/square with status dot and fallback initials",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			userId: EnumList({ Roblox: 1, Builderman: 156, Shedletsky: 261 }, "Roblox"),
			size: EnumList({ xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }, "md"),
			shape: EnumList({ circle: "circle", square: "square" }, "circle"),
			status: EnumList(
				{ none: "none", online: "online", away: "away", busy: "busy", offline: "offline" },
				"online",
			),
		},
	},
	(props) => (
		<StoryShell title="Avatar" subtitle="Circle / square avatar — userId thumbnail, fallback initials, status dot">
			<Section title="Interactive">
				<Avatar
					userId={props.controls.userId}
					fallback="Player"
					size={props.controls.size}
					shape={props.controls.shape}
					status={props.controls.status === "none" ? undefined : (props.controls.status as AvatarStatus)}
				/>
			</Section>

			<Section title="Sizes">
				<Row align="end">
					{SIZES.map((s) => (
						<Avatar userId={1} fallback="Roblox" size={s} />
					))}
				</Row>
			</Section>

			<Section title="Shapes">
				<Row>
					{SHAPES.map((sh) => (
						<Avatar userId={156} fallback="Builder" size="lg" shape={sh} />
					))}
				</Row>
			</Section>

			<Section title="Status">
				<Row>
					{STATUSES.map((st) => (
						<Avatar userId={261} fallback="Shed" size="lg" status={st} />
					))}
				</Row>
			</Section>

			<Section title="Fallback initials (no image)">
				<Row>
					{NAMES.map((n) => (
						<Avatar fallback={n} size="md" />
					))}
				</Row>
			</Section>

			<Section title="Stack of users">
				<Row>
					{USER_IDS.map((id, i) => (
						<Avatar userId={id} fallback={NAMES[i] ?? "?"} size="md" status="online" />
					))}
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
