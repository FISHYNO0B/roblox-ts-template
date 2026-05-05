import React from "@rbxts/react";
import { useTheme } from "../../theme/provider";
import { SpacingToken } from "../../theme/spacing";
import Box from "../box/box";
import Stack from "../stack/stack";
import Text from "../text/text";

export type CardVariant = "default" | "elevated" | "outline";

export interface CardProps extends React.PropsWithChildren {
	variant?: CardVariant;
	padding?: SpacingToken;
	spacing?: SpacingToken;
	size?: UDim2;
	position?: UDim2;
	anchorPoint?: Vector2;
	automaticSize?: Enum.AutomaticSize;
	layoutOrder?: number;
}

export default function Card(props: CardProps) {
	const variant = props.variant ?? "default";
	const padding = props.padding ?? 5;
	const spacing = props.spacing ?? 3;

	return (
		<Box
			bg={variant === "outline" ? undefined : "card"}
			border={variant !== "elevated" ? "border" : undefined}
			radius="lg"
			padding={padding}
			size={props.size ?? new UDim2(1, 0, 0, 0)}
			position={props.position}
			anchorPoint={props.anchorPoint}
			automaticSize={props.automaticSize ?? Enum.AutomaticSize.Y}
			layoutOrder={props.layoutOrder}
		>
			<Stack direction="vertical" spacing={spacing} automaticSize={Enum.AutomaticSize.Y}>
				{props.children}
			</Stack>
		</Box>
	);
}

export interface CardSlotProps extends React.PropsWithChildren {
	layoutOrder?: number;
	spacing?: SpacingToken;
}

export function CardHeader(props: CardSlotProps) {
	return (
		<Stack
			direction="vertical"
			spacing={props.spacing ?? 1}
			automaticSize={Enum.AutomaticSize.Y}
			layoutOrder={props.layoutOrder ?? 0}
		>
			{props.children}
		</Stack>
	);
}

export function CardContent(props: CardSlotProps) {
	return (
		<Stack
			direction="vertical"
			spacing={props.spacing ?? 2}
			automaticSize={Enum.AutomaticSize.Y}
			layoutOrder={props.layoutOrder ?? 1}
		>
			{props.children}
		</Stack>
	);
}

export function CardFooter(props: CardSlotProps) {
	return (
		<Stack
			direction="horizontal"
			spacing={props.spacing ?? 2}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
			layoutOrder={props.layoutOrder ?? 2}
		>
			{props.children}
		</Stack>
	);
}

export interface CardTitleProps {
	text: string;
	layoutOrder?: number;
}

export function CardTitle(props: CardTitleProps) {
	return <Text text={props.text} size="xl" color="cardForeground" layoutOrder={props.layoutOrder} />;
}

export function CardDescription(props: CardTitleProps) {
	const theme = useTheme();
	return (
		<Text
			text={props.text}
			size="sm"
			color="mutedForeground"
			wrap={true}
			layoutOrder={props.layoutOrder}
			frameSize={new UDim2(1, 0, 0, theme.typography.size.sm + 4)}
			automaticSize={Enum.AutomaticSize.Y}
		/>
	);
}
