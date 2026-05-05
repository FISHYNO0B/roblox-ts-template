import React from "@rbxts/react";
import { ColorValue, resolveColor } from "../../core/resolve-color";
import { useTheme } from "../../theme/provider";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps {
	orientation?: SeparatorOrientation;
	color?: ColorValue;
	thickness?: number;
	length?: UDim;
	layoutOrder?: number;
}

export default function Separator(props: SeparatorProps) {
	const theme = useTheme();
	const orientation = props.orientation ?? "horizontal";
	const color = resolveColor(props.color ?? "border", theme) ?? theme.colors.border;
	const thickness = props.thickness ?? 1;
	const length = props.length ?? new UDim(1, 0);

	const size =
		orientation === "horizontal"
			? new UDim2(length.Scale, length.Offset, 0, thickness)
			: new UDim2(0, thickness, length.Scale, length.Offset);

	return <frame BackgroundColor3={color} BorderSizePixel={0} Size={size} LayoutOrder={props.layoutOrder} />;
}
