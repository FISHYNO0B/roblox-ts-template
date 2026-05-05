import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Heading, { HeadingLevel } from "./heading";

const LEVELS: Array<HeadingLevel> = ["display", "title", "subtitle", "section", "label"];

const Story = CreateReactStory(
	{
		summary: "Heading — preset typographic levels",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			text: "The kingdom rises at dawn",
			level: EnumList(
				{ display: "display", title: "title", subtitle: "subtitle", section: "section", label: "label" },
				"title",
			),
		},
	},
	(props) => (
		<StoryShell title="Heading" subtitle="Semantic heading levels — display / title / subtitle / section / label">
			<Section title="Interactive">
				<Heading text={props.controls.text} level={props.controls.level} />
			</Section>

			<Section title="All levels">
				{LEVELS.map((l) => (
					<Heading text={`${l.upper()} — ${props.controls.text}`} level={l} />
				))}
			</Section>
		</StoryShell>
	),
);

export = Story;
