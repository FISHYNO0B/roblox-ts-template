import React from "@rbxts/react";
import { ColorValue, resolveColor } from "../../core/resolve-color";
import { GradientToken } from "../../theme/gradients";
import { RadiusToken } from "../../theme/radius";
import { SpacingToken } from "../../theme/spacing";
import { useTheme } from "../../theme/provider";

export interface BoxProps extends React.PropsWithChildren {
	bg?: ColorValue;
	bgTransparency?: number;
	border?: ColorValue;
	borderThickness?: number;
	radius?: RadiusToken;
	gradient?: GradientToken;

	padding?: SpacingToken;
	paddingX?: SpacingToken;
	paddingY?: SpacingToken;
	paddingTop?: SpacingToken;
	paddingBottom?: SpacingToken;
	paddingLeft?: SpacingToken;
	paddingRight?: SpacingToken;

	size?: UDim2;
	position?: UDim2;
	anchorPoint?: Vector2;
	automaticSize?: Enum.AutomaticSize;
	layoutOrder?: number;
	zIndex?: number;
	clipsDescendants?: boolean;
}

export default function Box(props: BoxProps) {
	const theme = useTheme();
	const bgColor = resolveColor(props.bg, theme);
	const borderColor = resolveColor(props.border, theme);
	const gradient = props.gradient !== undefined ? theme.gradients[props.gradient] : undefined;

	const padTop = props.paddingTop ?? props.paddingY ?? props.padding;
	const padBottom = props.paddingBottom ?? props.paddingY ?? props.padding;
	const padLeft = props.paddingLeft ?? props.paddingX ?? props.padding;
	const padRight = props.paddingRight ?? props.paddingX ?? props.padding;

	const hasPadding =
		padTop !== undefined || padBottom !== undefined || padLeft !== undefined || padRight !== undefined;

	const cornerRadius = props.radius !== undefined ? theme.radius[props.radius] : undefined;

	return (
		<frame
			BackgroundColor3={bgColor ?? theme.colors.background}
			BackgroundTransparency={props.bgTransparency ?? (bgColor !== undefined ? 0 : 1)}
			BorderSizePixel={0}
			Size={props.size ?? new UDim2(0, 0, 0, 0)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			AutomaticSize={props.automaticSize ?? Enum.AutomaticSize.None}
			LayoutOrder={props.layoutOrder}
			ZIndex={props.zIndex}
			ClipsDescendants={props.clipsDescendants}
		>
			{cornerRadius !== undefined && <uicorner CornerRadius={cornerRadius} />}
			{borderColor !== undefined && <uistroke Color={borderColor} Thickness={props.borderThickness ?? 1} />}
			{gradient !== undefined && (
				<uigradient Color={gradient.color} Transparency={gradient.transparency} Rotation={gradient.rotation} />
			)}
			{hasPadding && (
				<uipadding
					PaddingTop={padTop !== undefined ? new UDim(0, theme.spacing[padTop]) : undefined}
					PaddingBottom={padBottom !== undefined ? new UDim(0, theme.spacing[padBottom]) : undefined}
					PaddingLeft={padLeft !== undefined ? new UDim(0, theme.spacing[padLeft]) : undefined}
					PaddingRight={padRight !== undefined ? new UDim(0, theme.spacing[padRight]) : undefined}
				/>
			)}
			{props.children}
		</frame>
	);
}
