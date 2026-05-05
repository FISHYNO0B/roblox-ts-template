import React from "@rbxts/react";
import { Icons, IconKey } from "shared/domain/assets/Icons";
import { ColorValue, resolveColor } from "../../core/resolve-color";
import { useTheme } from "../../theme/provider";

export interface IconProps {
	icon: IconKey;
	size?: number;
	color?: ColorValue;
	transparency?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
	layoutOrder?: number;
	zIndex?: number;
}

export default function Icon(props: IconProps) {
	const theme = useTheme();
	const tint = resolveColor(props.color, theme);
	const size = props.size ?? 24;

	return (
		<imagelabel
			BackgroundTransparency={1}
			Image={Icons[props.icon]}
			ImageColor3={tint}
			ImageTransparency={props.transparency}
			Size={new UDim2(0, size, 0, size)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			LayoutOrder={props.layoutOrder}
			ZIndex={props.zIndex}
			ScaleType={Enum.ScaleType.Fit}
		/>
	);
}
