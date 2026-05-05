import React, { useEffect, useRef, useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
import { useSpring } from "../../motion/use-spring";
import { spring } from "../../theme/motion";
import { useTheme } from "../../theme/provider";

export type SliderSize = "sm" | "md" | "lg";

interface SizeStyle {
	track: number;
	thumb: number;
}

const sizeStyles: Record<SliderSize, SizeStyle> = {
	sm: { track: 4, thumb: 14 },
	md: { track: 6, thumb: 18 },
	lg: { track: 8, thumb: 22 },
};

export interface SliderProps {
	value: number;
	onChange?: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	size?: SliderSize;
	disabled?: boolean;
	frameSize?: UDim2;
	layoutOrder?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
}

function clamp(n: number, min: number, max: number): number {
	if (n < min) return min;
	if (n > max) return max;
	return n;
}

function snap(value: number, step: number, min: number): number {
	if (step <= 0) return value;
	return min + math.round((value - min) / step) * step;
}

export default function Slider(props: SliderProps) {
	const theme = useTheme();
	const min = props.min ?? 0;
	const max = props.max ?? 100;
	const step = props.step ?? 0;
	const size = props.size ?? "md";
	const disabled = props.disabled ?? false;
	const s = sizeStyles[size];

	const value = clamp(props.value, min, max);
	const ratio = max === min ? 0 : (value - min) / (max - min);
	const animatedRatio = useSpring(ratio, spring.snappy);

	const containerRef = useRef<Frame>();
	const [dragging, setDragging] = useState(false);

	function applyMouseX(mouseX: number) {
		const frame = containerRef.current;
		if (!frame) return;
		const absPos = frame.AbsolutePosition;
		const absSize = frame.AbsoluteSize;
		if (absSize.X <= 0) return;
		const r = clamp((mouseX - absPos.X) / absSize.X, 0, 1);
		let raw = min + r * (max - min);
		raw = snap(raw, step, min);
		raw = clamp(raw, min, max);
		if (raw !== value) props.onChange?.(raw);
	}

	useEffect(() => {
		if (!dragging) return;
		const movedConn = UserInputService.InputChanged.Connect((input) => {
			if (
				input.UserInputType === Enum.UserInputType.MouseMovement ||
				input.UserInputType === Enum.UserInputType.Touch
			) {
				applyMouseX(input.Position.X);
			}
		});
		const endedConn = UserInputService.InputEnded.Connect((input) => {
			if (
				input.UserInputType === Enum.UserInputType.MouseButton1 ||
				input.UserInputType === Enum.UserInputType.Touch
			) {
				setDragging(false);
			}
		});
		return () => {
			movedConn.Disconnect();
			endedConn.Disconnect();
		};
	}, [dragging, value, min, max, step]);

	const totalHeight = math.max(s.track, s.thumb);

	return (
		<frame
			ref={containerRef}
			BackgroundTransparency={1}
			Size={props.frameSize ?? new UDim2(1, 0, 0, totalHeight)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			LayoutOrder={props.layoutOrder}
		>
			<frame
				BackgroundColor3={theme.colors.muted}
				BackgroundTransparency={disabled ? 0.5 : 0}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 0.5)}
				Position={new UDim2(0, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 0, s.track)}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
				<frame
					BackgroundColor3={theme.colors.primary}
					BackgroundTransparency={disabled ? 0.5 : 0}
					BorderSizePixel={0}
					Size={animatedRatio.map((r) => new UDim2(r, 0, 1, 0))}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
				</frame>
			</frame>

			<frame
				BackgroundColor3={theme.colors.primary}
				BackgroundTransparency={disabled ? 0.5 : 0}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={animatedRatio.map((r) => new UDim2(r, 0, 0.5, 0))}
				Size={new UDim2(0, s.thumb, 0, s.thumb)}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
				<uistroke Color={theme.colors.background} Thickness={2} />
			</frame>

			<textbutton
				AutoButtonColor={false}
				BackgroundTransparency={1}
				Text=""
				Size={new UDim2(1, 0, 1, 0)}
				Active={!disabled}
				Selectable={!disabled}
				Event={{
					InputBegan: disabled
						? undefined
						: (_rbx, input) => {
								if (
									input.UserInputType === Enum.UserInputType.MouseButton1 ||
									input.UserInputType === Enum.UserInputType.Touch
								) {
									setDragging(true);
									applyMouseX(input.Position.X);
								}
							},
				}}
			/>
		</frame>
	);
}
