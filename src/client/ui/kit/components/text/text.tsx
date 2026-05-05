import React from "@rbxts/react";
import { ColorValue, resolveColor } from "../../core/resolve-color";
import { useTheme } from "../../theme/provider";
import { FontSizeToken } from "../../theme/typography";

export type TextAlign = "left" | "center" | "right";
export type TextAlignY = "top" | "center" | "bottom";

const alignMap: Record<TextAlign, Enum.TextXAlignment> = {
	left: Enum.TextXAlignment.Left,
	center: Enum.TextXAlignment.Center,
	right: Enum.TextXAlignment.Right,
};

const alignYMap: Record<TextAlignY, Enum.TextYAlignment> = {
	top: Enum.TextYAlignment.Top,
	center: Enum.TextYAlignment.Center,
	bottom: Enum.TextYAlignment.Bottom,
};

export interface TextProps {
	text: string;
	size?: FontSizeToken | number;
	color?: ColorValue;
	align?: TextAlign;
	alignY?: TextAlignY;
	wrap?: boolean;
	scaled?: boolean;
	richText?: boolean;
	font?: Font;

	frameSize?: UDim2;
	position?: UDim2;
	anchorPoint?: Vector2;
	automaticSize?: Enum.AutomaticSize;
	layoutOrder?: number;
	zIndex?: number;
}

function resolveSize(
	size: FontSizeToken | number | undefined,
	defaultSize: number,
	sizes: Record<FontSizeToken, number>,
): number {
	if (size === undefined) return defaultSize;
	if (typeIs(size, "number")) return size;
	return sizes[size];
}

export default function Text(props: TextProps) {
	const theme = useTheme();
	const color = resolveColor(props.color ?? "foreground", theme) ?? theme.colors.foreground;
	const textSize = resolveSize(props.size, theme.typography.size.base, theme.typography.size);
	const automaticSize = props.automaticSize ?? (props.frameSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY);

	return (
		<textlabel
			BackgroundTransparency={1}
			FontFace={props.font ?? theme.typography.fontFace}
			Text={props.text}
			TextColor3={color}
			TextSize={textSize}
			TextScaled={props.scaled}
			TextWrapped={props.wrap}
			RichText={props.richText}
			TextXAlignment={props.align !== undefined ? alignMap[props.align] : Enum.TextXAlignment.Left}
			TextYAlignment={props.alignY !== undefined ? alignYMap[props.alignY] : Enum.TextYAlignment.Center}
			Size={props.frameSize ?? new UDim2(0, 0, 0, 0)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			AutomaticSize={automaticSize}
			LayoutOrder={props.layoutOrder}
			ZIndex={props.zIndex}
		/>
	);
}
