import React from "@rbxts/react";
import Text, { TextAlign } from "../text/text";
import { ColorValue } from "../../core/resolve-color";
import { FontSizeToken } from "../../theme/typography";

export type HeadingLevel = "display" | "title" | "subtitle" | "section" | "label";

const levelToSize: Record<HeadingLevel, FontSizeToken> = {
	display: "5xl",
	title: "3xl",
	subtitle: "2xl",
	section: "xl",
	label: "sm",
};

const levelToColor: Record<HeadingLevel, ColorValue> = {
	display: "foreground",
	title: "foreground",
	subtitle: "foreground",
	section: "foreground",
	label: "mutedForeground",
};

export interface HeadingProps {
	text: string;
	level?: HeadingLevel;
	color?: ColorValue;
	align?: TextAlign;
	frameSize?: UDim2;
	position?: UDim2;
	anchorPoint?: Vector2;
	automaticSize?: Enum.AutomaticSize;
	layoutOrder?: number;
}

export default function Heading(props: HeadingProps) {
	const level = props.level ?? "title";
	return (
		<Text
			text={props.text}
			size={levelToSize[level]}
			color={props.color ?? levelToColor[level]}
			align={props.align}
			frameSize={props.frameSize}
			position={props.position}
			anchorPoint={props.anchorPoint}
			automaticSize={props.automaticSize}
			layoutOrder={props.layoutOrder}
		/>
	);
}
