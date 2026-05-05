import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Badge from "../badge/badge";
import Button from "../button/button";
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardVariant } from "./card";

const VARIANTS: Array<CardVariant> = ["default", "elevated", "outline"];

const Story = CreateReactStory(
	{
		summary: "Card — composable container with header / content / footer",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			variant: EnumList({ default: "default", elevated: "elevated", outline: "outline" }, "default"),
		},
	},
	(props) => (
		<StoryShell
			title="Card"
			subtitle="Composable container — Card / CardHeader / CardTitle / CardContent / CardFooter"
		>
			<Section title="Interactive">
				<Card
					variant={props.controls.variant}
					size={new UDim2(0, 360, 0, 0)}
					automaticSize={Enum.AutomaticSize.Y}
				>
					<CardHeader>
						<CardTitle text="Welcome back, hero" />
						<CardDescription text="Pick up where you left off — your kingdom awaits." />
					</CardHeader>
					<CardContent>
						<Row>
							<Badge text="Online" variant="success" />
							<Badge text="Lvl 42" variant="secondary" />
							<Badge text="Beta" variant="accent" />
						</Row>
					</CardContent>
					<CardFooter>
						<Button text="Resume" variant="solid" />
						<Button text="Settings" variant="outline" />
					</CardFooter>
				</Card>
			</Section>

			<Section title="All variants">
				<Row wrap={true}>
					{VARIANTS.map((v) => (
						<Card variant={v} size={new UDim2(0, 240, 0, 0)} automaticSize={Enum.AutomaticSize.Y}>
							<CardHeader>
								<CardTitle text={v} />
								<CardDescription text="A short description of this card." />
							</CardHeader>
							<CardFooter>
								<Button text="Action" variant="solid" size="sm" />
							</CardFooter>
						</Card>
					))}
				</Row>
			</Section>
		</StoryShell>
	),
);

export = Story;
