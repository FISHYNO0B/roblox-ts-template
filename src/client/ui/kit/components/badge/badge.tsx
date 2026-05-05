import React from "@rbxts/react";
import { ColorToken } from "../../core/resolve-color";
import { useTheme } from "../../theme/provider";
import { FontSizeToken } from "../../theme/typography";
import { RadiusToken } from "../../theme/radius";
import { SpacingToken } from "../../theme/spacing";

export type BadgeVariant = "default" | "secondary" | "destructive" | "success" | "warning" | "accent" | "outline";
export type BadgeSize = "sm" | "md";

interface VariantStyle {
	bg: ColorToken | "transparent";
	fg: ColorToken;
	border?: ColorToken;
}

const variantStyles: Record<BadgeVariant, VariantStyle> = {
	default: { bg: "primary", fg: "primaryForeground" },
	secondary: { bg: "secondary", fg: "secondaryForeground" },
	destructive: { bg: "destructive", fg: "destructiveForeground" },
	success: { bg: "success", fg: "successForeground" },
	warning: { bg: "warning", fg: "warningForeground" },
	accent: { bg: "accent", fg: "accentForeground" },
	outline: { bg: "transparent", fg: "foreground", border: "border" },
};

interface SizeStyle {
	fontSize: FontSizeToken;
	radius: RadiusToken;
	paddingX: SpacingToken;
	paddingY: SpacingToken;
}

const sizeStyles: Record<BadgeSize, SizeStyle> = {
	sm: { fontSize: "xs", radius: "sm", paddingX: 2, paddingY: 1 },
	md: { fontSize: "sm", radius: "md", paddingX: 3, paddingY: 1 },
};

export interface BadgeProps {
	text: string;
	variant?: BadgeVariant;
	size?: BadgeSize;
	layoutOrder?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
}

export default function Badge(props: BadgeProps) {
	const theme = useTheme();
	const variant = props.variant ?? "default";
	const size = props.size ?? "md";
	const v = variantStyles[variant];
	const s = sizeStyles[size];

	const bgColor = v.bg === "transparent" ? theme.colors.background : theme.colors[v.bg];
	const bgTransparency = v.bg === "transparent" ? 1 : 0;
	const fgColor = theme.colors[v.fg];
	const borderColor = v.border !== undefined ? theme.colors[v.border] : undefined;

	return (
		<frame
			BackgroundColor3={bgColor}
			BackgroundTransparency={bgTransparency}
			BorderSizePixel={0}
			AutomaticSize={Enum.AutomaticSize.XY}
			Size={new UDim2(0, 0, 0, 0)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			LayoutOrder={props.layoutOrder}
		>
			<uicorner CornerRadius={theme.radius[s.radius]} />
			{borderColor !== undefined && <uistroke Color={borderColor} Thickness={1} />}
			<uipadding
				PaddingTop={new UDim(0, theme.spacing[s.paddingY])}
				PaddingBottom={new UDim(0, theme.spacing[s.paddingY])}
				PaddingLeft={new UDim(0, theme.spacing[s.paddingX])}
				PaddingRight={new UDim(0, theme.spacing[s.paddingX])}
			/>
			<textlabel
				BackgroundTransparency={1}
				FontFace={theme.typography.fontFace}
				Text={props.text}
				TextColor3={fgColor}
				TextSize={theme.typography.size[s.fontSize]}
				AutomaticSize={Enum.AutomaticSize.XY}
				Size={new UDim2(0, 0, 0, 0)}
			/>
		</frame>
	);
}
