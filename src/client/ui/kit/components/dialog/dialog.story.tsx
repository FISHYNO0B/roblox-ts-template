import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList } from "@rbxts/ui-labs";
import { Section, StoryShell } from "../../stories/story-shell";
import Button from "../button/button";
import Stack from "../stack/stack";
import Dialog, {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogSize,
	DialogTitle,
} from "./dialog";

const SIZES: Array<DialogSize> = ["sm", "md", "lg", "xl"];

function StatefulDialog(props: { size?: DialogSize; trigger?: string; closeOnBackdrop?: boolean }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button text={props.trigger ?? "Open dialog"} onClick={() => setOpen(true)} />
			<Dialog open={open} onOpenChange={setOpen} size={props.size} closeOnBackdrop={props.closeOnBackdrop}>
				<DialogHeader>
					<DialogTitle text="Confirm action" />
					<DialogDescription text="This action will permanently delete the selected items. You can't undo this." />
				</DialogHeader>
				<DialogContent>
					<DialogDescription text="Items affected: 12 saves, 4 cosmetics, 2 friends." />
				</DialogContent>
				<DialogFooter>
					<Button text="Cancel" variant="ghost" onClick={() => setOpen(false)} />
					<Button text="Delete" variant="destructive" onClick={() => setOpen(false)} />
				</DialogFooter>
			</Dialog>
		</>
	);
}

const Story = CreateReactStory(
	{
		summary: "Dialog — modal overlay with backdrop, animated open/close",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			size: EnumList({ sm: "sm", md: "md", lg: "lg", xl: "xl" }, "md"),
			closeOnBackdrop: true,
		},
	},
	(props) => (
		<StoryShell title="Dialog" subtitle="Modal overlay — backdrop click-to-dismiss, spring scale + fade entrance">
			<Section title="Interactive">
				<StatefulDialog size={props.controls.size} closeOnBackdrop={props.controls.closeOnBackdrop} />
			</Section>

			<Section title="Sizes">
				<Stack
					direction="horizontal"
					spacing={2}
					wrap={true}
					automaticSize={Enum.AutomaticSize.Y}
					size={new UDim2(1, 0, 0, 0)}
				>
					{SIZES.map((s) => (
						<StatefulDialog size={s} trigger={`Open ${s}`} />
					))}
				</Stack>
			</Section>
		</StoryShell>
	),
);

export = Story;
