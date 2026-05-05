import React from "@rbxts/react";
import { useSpring } from "../../motion/use-spring";
import { spring } from "../../theme/motion";
import { useTheme } from "../../theme/provider";
import Stack from "../stack/stack";
import Text from "../text/text";

export type CheckboxSize = "sm" | "md" | "lg";

interface SizeStyle {
	box: number;
	check: number;
	stroke: number;
}

const sizeStyles: Record<CheckboxSize, SizeStyle> = {
	sm: { box: 16, check: 12, stroke: 1 },
	md: { box: 20, check: 14, stroke: 1.5 },
	lg: { box: 24, check: 18, stroke: 2 },
};

export interface CheckboxProps {
	checked: boolean;
	onChange?: (checked: boolean) => void;
	size?: CheckboxSize;
	disabled?: boolean;
	label?: string;
	layoutOrder?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
}

export default function Checkbox(props: CheckboxProps) {
	const theme = useTheme();
	const size = props.size ?? "md";
	const disabled = props.disabled ?? false;
	const s = sizeStyles[size];

	const bg = useSpring(props.checked ? theme.colors.primary : theme.colors.background, spring.snappy);
	const checkScale = useSpring(props.checked ? 1 : 0, spring.bouncy);
	const checkTransparency = useSpring(props.checked ? 0 : 1, spring.snappy);

	const inner = (
		<textbutton
			AutoButtonColor={false}
			BackgroundColor3={bg}
			BackgroundTransparency={disabled ? 0.5 : 0}
			BorderSizePixel={0}
			Text=""
			Size={new UDim2(0, s.box, 0, s.box)}
			Active={!disabled}
			Selectable={!disabled}
			LayoutOrder={0}
			Event={{
				MouseButton1Click: disabled ? undefined : () => props.onChange?.(!props.checked),
			}}
		>
			<uicorner CornerRadius={theme.radius.sm} />
			<uistroke Color={props.checked ? theme.colors.primary : theme.colors.border} Thickness={s.stroke} />
			<textlabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(0, s.check, 0, s.check)}
				BackgroundTransparency={1}
				Text="✓"
				Font={Enum.Font.GothamBold}
				TextColor3={theme.colors.primaryForeground}
				TextTransparency={checkTransparency}
				TextScaled={true}
			>
				<uiscale Scale={checkScale} />
			</textlabel>
		</textbutton>
	);

	if (props.label === undefined) {
		return (
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(0, s.box, 0, s.box)}
				LayoutOrder={props.layoutOrder}
				Position={props.position}
				AnchorPoint={props.anchorPoint}
			>
				{inner}
			</frame>
		);
	}

	return (
		<Stack
			direction="horizontal"
			spacing={2}
			align="center"
			automaticSize={Enum.AutomaticSize.XY}
			layoutOrder={props.layoutOrder}
			position={props.position}
			anchorPoint={props.anchorPoint}
		>
			{inner}
			<Text text={props.label} size="sm" color={disabled ? "mutedForeground" : "foreground"} layoutOrder={1} />
		</Stack>
	);
}
