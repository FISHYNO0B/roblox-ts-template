import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Box from "../box/box";
import Text from "../text/text";
import Heading from "../heading/heading";
import Tabs, { TabsContent, TabsList, TabsTrigger, TabsSize, TabsVariant } from "./tabs";

const VARIANTS: Array<TabsVariant> = ["pills", "underline"];
const SIZES: Array<TabsSize> = ["sm", "md", "lg"];

function StatefulTabs(props: { variant?: TabsVariant; size?: TabsSize }) {
	const [tab, setTab] = useState("overview");
	return (
		<Tabs value={tab} onChange={setTab} variant={props.variant} size={props.size}>
			<TabsList>
				<TabsTrigger value="overview" text="Overview" layoutOrder={0} />
				<TabsTrigger value="stats" text="Stats" layoutOrder={1} />
				<TabsTrigger value="inventory" text="Inventory" layoutOrder={2} />
				<TabsTrigger value="locked" text="Locked" disabled={true} layoutOrder={3} />
			</TabsList>
			<TabsContent value="overview">
				<Box bg="card" radius="md" padding={4} automaticSize={Enum.AutomaticSize.Y}>
					<Heading text="Overview" level="section" />
					<Text
						text="Top-level summary of your hero — level, gold, and active quests."
						color="mutedForeground"
					/>
				</Box>
			</TabsContent>
			<TabsContent value="stats">
				<Box bg="card" radius="md" padding={4} automaticSize={Enum.AutomaticSize.Y}>
					<Heading text="Stats" level="section" />
					<Text text="STR 14 · DEX 12 · INT 18 · CHA 10" color="mutedForeground" />
				</Box>
			</TabsContent>
			<TabsContent value="inventory">
				<Box bg="card" radius="md" padding={4} automaticSize={Enum.AutomaticSize.Y}>
					<Heading text="Inventory" level="section" />
					<Text text="Sword of Embers, Cloak of Shadows, 12× Health Potion" color="mutedForeground" />
				</Box>
			</TabsContent>
		</Tabs>
	);
}

const Story = CreateReactStory(
	{
		summary: "Tabs — pills or underline, animated active state",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			variant: EnumList({ pills: "pills", underline: "underline" }, "pills"),
			size: EnumList({ sm: "sm", md: "md", lg: "lg" }, "md"),
		},
	},
	(props) => (
		<StoryShell title="Tabs" subtitle="Tabbed navigation — pills / underline, sm / md / lg, disabled triggers">
			<Section title="Interactive">
				<StatefulTabs variant={props.controls.variant} size={props.controls.size} />
			</Section>

			{VARIANTS.map((v) => (
				<Section title={`Variant: ${v}`}>
					<StatefulTabs variant={v} size="md" />
				</Section>
			))}

			{SIZES.map((s) => (
				<Section title={`Size: ${s}`}>
					<StatefulTabs variant="pills" size={s} />
				</Section>
			))}
		</StoryShell>
	),
);

export = Story;
