import React from "@rbxts/react";
import { darkTheme } from "../theme/theme";
import { ThemeProvider, useTheme } from "../theme/provider";
import Box from "../components/box/box";
import Stack from "../components/stack/stack";
import Heading from "../components/heading/heading";
import ScrollArea from "../components/scroll-area/scroll-area";
import { SpacingToken } from "../theme/spacing";

interface StoryShellProps extends React.PropsWithChildren {
	title?: string;
	subtitle?: string;
	padding?: SpacingToken;
	scroll?: boolean;
}

function ShellInner(props: StoryShellProps) {
	const theme = useTheme();
	const padding = props.padding ?? 6;
	const content = (
		<Stack direction="vertical" spacing={5} automaticSize={Enum.AutomaticSize.Y}>
			{props.title !== undefined && (
				<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.Y} layoutOrder={0}>
					<Heading text={props.title} level="title" layoutOrder={0} />
					{props.subtitle !== undefined && <Heading text={props.subtitle} level="label" layoutOrder={1} />}
				</Stack>
			)}
			<Stack direction="vertical" spacing={5} automaticSize={Enum.AutomaticSize.Y} layoutOrder={1}>
				{props.children}
			</Stack>
		</Stack>
	);

	if (props.scroll === false) {
		return (
			<Box bg="background" size={new UDim2(1, 0, 1, 0)} padding={padding}>
				{content}
			</Box>
		);
	}

	return (
		<ScrollArea size={new UDim2(1, 0, 1, 0)} padding={padding} spacing={5}>
			<frame
				BackgroundColor3={theme.colors.background}
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				BorderSizePixel={0}
			>
				{content}
			</frame>
		</ScrollArea>
	);
}

export function StoryShell(props: StoryShellProps) {
	return (
		<ThemeProvider theme={darkTheme}>
			<Box bg="background" size={new UDim2(1, 0, 1, 0)}>
				<ShellInner {...props} />
			</Box>
		</ThemeProvider>
	);
}

interface SectionProps extends React.PropsWithChildren {
	title: string;
	layoutOrder?: number;
}

export function Section(props: SectionProps) {
	return (
		<Stack direction="vertical" spacing={3} automaticSize={Enum.AutomaticSize.Y} layoutOrder={props.layoutOrder}>
			<Heading text={props.title} level="subtitle" layoutOrder={0} />
			<Stack direction="vertical" spacing={3} automaticSize={Enum.AutomaticSize.Y} layoutOrder={1}>
				{props.children}
			</Stack>
		</Stack>
	);
}

interface RowProps extends React.PropsWithChildren {
	spacing?: SpacingToken;
	wrap?: boolean;
	align?: "start" | "center" | "end";
	layoutOrder?: number;
}

export function Row(props: RowProps) {
	return (
		<Stack
			direction="horizontal"
			spacing={props.spacing ?? 3}
			wrap={props.wrap}
			align={props.align ?? "center"}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
			layoutOrder={props.layoutOrder}
		>
			{props.children}
		</Stack>
	);
}
