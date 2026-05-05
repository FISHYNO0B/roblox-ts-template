import React from "@rbxts/react";
import { IconKey } from "shared/domain/assets/Icons";
import { ColorToken } from "../../core/resolve-color";
import { usePressScale } from "../../motion/use-press-scale";
import { useTheme } from "../../theme/provider";
import { FontSizeToken } from "../../theme/typography";
import { RadiusToken } from "../../theme/radius";
import { SpacingToken } from "../../theme/spacing";
import Icon from "../icon/icon";

export type ButtonVariant = "solid" | "outline" | "ghost" | "destructive" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

interface VariantStyle {
	bg: ColorToken | "transparent";
	bgHover: ColorToken | "transparent";
	fg: ColorToken;
	border?: ColorToken;
}

const variantStyles: Record<ButtonVariant, VariantStyle> = {
	solid: { bg: "primary", bgHover: "primary", fg: "primaryForeground" },
	secondary: { bg: "secondary", bgHover: "secondary", fg: "secondaryForeground" },
	outline: { bg: "transparent", bgHover: "secondary", fg: "foreground", border: "mutedForeground" },
	ghost: { bg: "transparent", bgHover: "secondary", fg: "foreground" },
	destructive: { bg: "destructive", bgHover: "destructive", fg: "destructiveForeground" },
};

interface SizeStyle {
	height: number;
	paddingX: SpacingToken;
	gap: SpacingToken;
	fontSize: FontSizeToken;
	radius: RadiusToken;
	iconSize: number;
}

const sizeStyles: Record<ButtonSize, SizeStyle> = {
	sm: { height: 32, paddingX: 3, gap: 2, fontSize: "sm", radius: "md", iconSize: 14 },
	md: { height: 40, paddingX: 4, gap: 2, fontSize: "base", radius: "md", iconSize: 16 },
	lg: { height: 48, paddingX: 6, gap: 3, fontSize: "lg", radius: "lg", iconSize: 20 },
};

export interface ButtonProps extends React.PropsWithChildren {
	text?: string;
	onClick?: () => void;
	variant?: ButtonVariant;
	size?: ButtonSize;
	disabled?: boolean;
	fullWidth?: boolean;
	leftIcon?: IconKey;
	rightIcon?: IconKey;

	position?: UDim2;
	anchorPoint?: Vector2;
	frameSize?: UDim2;
	automaticSize?: Enum.AutomaticSize;
	layoutOrder?: number;
}

export default function Button(props: ButtonProps) {
	const theme = useTheme();
	const variant = props.variant ?? "solid";
	const size = props.size ?? "md";
	const disabled = props.disabled ?? false;
	const v = variantStyles[variant];
	const s = sizeStyles[size];

	const [scale, events] = usePressScale({
		hoverScale: 1.03,
		pressScale: 0.97,
		disabled,
	});

	const bgColor = v.bg === "transparent" ? theme.colors.background : theme.colors[v.bg];
	const bgTransparency = v.bg === "transparent" ? 1 : disabled ? 0.5 : 0;
	const fgColor = theme.colors[v.fg];
	const fgTransparency = disabled ? 0.5 : 0;
	const borderColor = v.border !== undefined ? theme.colors[v.border] : undefined;

	const automaticSize = props.frameSize ? Enum.AutomaticSize.None : (props.automaticSize ?? Enum.AutomaticSize.X);

	const frameSize =
		props.frameSize ?? (props.fullWidth ? new UDim2(1, 0, 0, s.height) : new UDim2(0, 0, 0, s.height));

	return (
		<textbutton
			AutoButtonColor={false}
			BackgroundColor3={bgColor}
			BackgroundTransparency={bgTransparency}
			BorderSizePixel={0}
			Text=""
			AutomaticSize={automaticSize}
			Size={frameSize}
			Position={props.position}
			AnchorPoint={props.anchorPoint ?? new Vector2(0.5, 0.5)}
			LayoutOrder={props.layoutOrder}
			Active={!disabled}
			Selectable={!disabled}
			Event={{
				MouseButton1Click: disabled ? undefined : props.onClick,
				MouseEnter: events.MouseEnter,
				MouseLeave: events.MouseLeave,
				MouseButton1Down: events.MouseButton1Down,
				MouseButton1Up: events.MouseButton1Up,
			}}
		>
			<uiscale Scale={scale} />
			<uicorner CornerRadius={theme.radius[s.radius]} />
			{borderColor !== undefined && (
				<uistroke Color={borderColor} Thickness={1} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
			)}
			<uipadding
				PaddingLeft={new UDim(0, theme.spacing[s.paddingX])}
				PaddingRight={new UDim(0, theme.spacing[s.paddingX])}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, theme.spacing[s.gap])}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>

			{props.leftIcon !== undefined && (
				<Icon icon={props.leftIcon} size={s.iconSize} color={v.fg} layoutOrder={0} />
			)}
			{props.text !== undefined && (
				<textlabel
					BackgroundTransparency={1}
					FontFace={theme.typography.fontFace}
					Text={props.text}
					TextColor3={fgColor}
					TextTransparency={fgTransparency}
					TextSize={theme.typography.size[s.fontSize]}
					AutomaticSize={Enum.AutomaticSize.XY}
					Size={new UDim2(0, 0, 0, 0)}
					LayoutOrder={1}
				/>
			)}
			{props.children}
			{props.rightIcon !== undefined && (
				<Icon icon={props.rightIcon} size={s.iconSize} color={v.fg} layoutOrder={2} />
			)}
		</textbutton>
	);
}
