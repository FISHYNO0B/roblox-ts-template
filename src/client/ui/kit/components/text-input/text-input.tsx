import React, { useState } from "@rbxts/react";
import { useSpring } from "../../motion/use-spring";
import { spring } from "../../theme/motion";
import { useTheme } from "../../theme/provider";
import { FontSizeToken } from "../../theme/typography";
import { RadiusToken } from "../../theme/radius";
import { SpacingToken } from "../../theme/spacing";

export type TextInputSize = "sm" | "md" | "lg";
export type TextInputVariant = "default" | "outline" | "ghost";

interface SizeStyle {
	height: number;
	paddingX: SpacingToken;
	paddingY: SpacingToken;
	fontSize: FontSizeToken;
	radius: RadiusToken;
}

const sizeStyles: Record<TextInputSize, SizeStyle> = {
	sm: { height: 32, paddingX: 3, paddingY: 1, fontSize: "sm", radius: "md" },
	md: { height: 40, paddingX: 3, paddingY: 2, fontSize: "base", radius: "md" },
	lg: { height: 48, paddingX: 4, paddingY: 3, fontSize: "lg", radius: "lg" },
};

export interface TextInputProps {
	value?: string;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	placeholder?: string;
	size?: TextInputSize;
	variant?: TextInputVariant;
	disabled?: boolean;
	multiline?: boolean;
	clearOnFocus?: boolean;
	maxLength?: number;
	frameSize?: UDim2;
	layoutOrder?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
}

export default function TextInput(props: TextInputProps) {
	const theme = useTheme();
	const size = props.size ?? "md";
	const variant = props.variant ?? "outline";
	const disabled = props.disabled ?? false;
	const s = sizeStyles[size];

	const [focused, setFocused] = useState(false);

	const borderColor = useSpring(focused ? theme.colors.ring : theme.colors.border, spring.snappy);
	const borderTransparency = variant === "ghost" ? (focused ? 0 : 1) : 0;

	const bgColor = variant === "default" ? theme.colors.input : theme.colors.background;
	const bgTransparency = variant === "default" ? (disabled ? 0.5 : 0) : variant === "ghost" ? 1 : disabled ? 0.5 : 1;

	const fitHeight = props.multiline ? new UDim2(1, 0, 0, s.height * 3) : new UDim2(1, 0, 0, s.height);

	return (
		<frame
			BackgroundColor3={bgColor}
			BackgroundTransparency={bgTransparency}
			BorderSizePixel={0}
			Size={props.frameSize ?? fitHeight}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			LayoutOrder={props.layoutOrder}
		>
			<uicorner CornerRadius={theme.radius[s.radius]} />
			<uistroke Color={borderColor} Thickness={1} Transparency={borderTransparency} />
			<uipadding
				PaddingTop={new UDim(0, theme.spacing[s.paddingY])}
				PaddingBottom={new UDim(0, theme.spacing[s.paddingY])}
				PaddingLeft={new UDim(0, theme.spacing[s.paddingX])}
				PaddingRight={new UDim(0, theme.spacing[s.paddingX])}
			/>
			<textbox
				BackgroundTransparency={1}
				Text={props.value ?? ""}
				PlaceholderText={props.placeholder ?? ""}
				PlaceholderColor3={theme.colors.mutedForeground}
				TextColor3={theme.colors.foreground}
				TextTransparency={disabled ? 0.5 : 0}
				FontFace={theme.typography.fontFace}
				TextSize={theme.typography.size[s.fontSize]}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={props.multiline ? Enum.TextYAlignment.Top : Enum.TextYAlignment.Center}
				MultiLine={props.multiline}
				ClearTextOnFocus={props.clearOnFocus ?? false}
				TextEditable={!disabled}
				ClipsDescendants={true}
				Size={new UDim2(1, 0, 1, 0)}
				Event={{
					Focused: () => setFocused(true),
					FocusLost: (rbx, enterPressed) => {
						setFocused(false);
						if (enterPressed) props.onSubmit?.(rbx.Text);
					},
				}}
				Change={{
					Text: (rbx) => {
						let updated = rbx.Text;
						if (props.maxLength !== undefined && updated.size() > props.maxLength) {
							updated = updated.sub(1, props.maxLength);
							rbx.Text = updated;
						}
						props.onChange?.(updated);
					},
				}}
			/>
		</frame>
	);
}
