import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { Row, Section, StoryShell } from "../../stories/story-shell";
import Button from "../button/button";
import { ToastProvider, useToast } from "./toast";

function ToastButtons() {
	const { toast } = useToast();
	return (
		<>
			<Section title="Trigger toasts">
				<Row wrap={true}>
					<Button
						text="Default"
						variant="solid"
						onClick={() => toast({ title: "Saved", description: "Your changes were saved successfully." })}
					/>
					<Button
						text="Success"
						variant="solid"
						onClick={() =>
							toast({
								title: "Quest complete",
								description: "+250 gold awarded.",
								variant: "success",
							})
						}
					/>
					<Button
						text="Warning"
						variant="solid"
						onClick={() =>
							toast({
								title: "Connection unstable",
								description: "We'll keep retrying in the background.",
								variant: "warning",
							})
						}
					/>
					<Button
						text="Destructive"
						variant="destructive"
						onClick={() =>
							toast({
								title: "Save failed",
								description: "Could not reach the server. Try again in a moment.",
								variant: "destructive",
							})
						}
					/>
					<Button
						text="Accent"
						variant="solid"
						onClick={() =>
							toast({
								title: "New friend request",
								description: "Aria Stark wants to be your friend.",
								variant: "accent",
							})
						}
					/>
				</Row>
			</Section>
			<Section title="Variations">
				<Row wrap={true}>
					<Button text="Title only" variant="outline" onClick={() => toast({ title: "Synced." })} />
					<Button
						text="No auto-dismiss"
						variant="outline"
						onClick={() =>
							toast({
								title: "Sticky toast",
								description: "Click × to close.",
								duration: 0,
							})
						}
					/>
					<Button
						text="Burst (5×)"
						variant="outline"
						onClick={() => {
							for (let i = 1; i <= 5; i++) {
								toast({ title: `Toast ${i}`, description: `Burst test ${i}/5`, variant: "accent" });
							}
						}}
					/>
				</Row>
			</Section>
		</>
	);
}

const Story = CreateReactStory(
	{
		summary: "Toast — top-right notifications via useToast()",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {},
	},
	() => (
		<ToastProvider>
			<StoryShell
				title="Toast"
				subtitle="Click buttons to push toasts — useToast() context, auto-dismiss, animated entrance"
			>
				<ToastButtons />
			</StoryShell>
		</ToastProvider>
	),
);

export = Story;
