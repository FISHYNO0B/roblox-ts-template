import React from "@rbxts/react";
import { useSpring } from "../../motion/use-spring";
import { useTheme } from "../../theme/provider";
import { spring } from "../../theme/motion";

export type ToggleSize = "sm" | "md" | "lg";

interface SizeStyle {
	width: number;
	height: number;
	thumb: number;
	pad: number;
}

const sizeStyles: Record<ToggleSize, SizeStyle> = {
	sm: { width: 32, height: 18, thumb: 14, pad: 2 },
	md: { width: 44, height: 24, thumb: 20, pad: 2 },
	lg: { width: 56, height: 30, thumb: 26, pad: 2 },
};

export interface ToggleProps {
	checked: boolean;
	onChange?: (checked: boolean) => void;
	size?: ToggleSize;
	disabled?: boolean;
	layoutOrder?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
}

export default function Toggle(props: ToggleProps) {
	const theme = useTheme();
	const size = props.size ?? "md";
	const disabled = props.disabled ?? false;
	const s = sizeStyles[size];

	const travel = s.width - s.thumb - s.pad * 2;
	const targetX = props.checked ? s.pad + travel : s.pad;
	const thumbX = useSpring(targetX, spring.snappy);

	const trackColor = useSpring(props.checked ? theme.colors.primary : theme.colors.muted, spring.snappy);

	return (
		<textbutton
			AutoButtonColor={false}
			BackgroundColor3={trackColor}
			BackgroundTransparency={disabled ? 0.5 : 0}
			BorderSizePixel={0}
			Text=""
			Size={new UDim2(0, s.width, 0, s.height)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			LayoutOrder={props.layoutOrder}
			Active={!disabled}
			Selectable={!disabled}
			Event={{
				MouseButton1Click: disabled ? undefined : () => props.onChange?.(!props.checked),
			}}
		>
			<uicorner CornerRadius={new UDim(1, 0)} />
			<frame
				BackgroundColor3={theme.colors.background}
				BackgroundTransparency={disabled ? 0.5 : 0}
				BorderSizePixel={0}
				Position={thumbX.map((x) => new UDim2(0, x, 0.5, 0))}
				AnchorPoint={new Vector2(0, 0.5)}
				Size={new UDim2(0, s.thumb, 0, s.thumb)}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
			</frame>
		</textbutton>
	);
}
