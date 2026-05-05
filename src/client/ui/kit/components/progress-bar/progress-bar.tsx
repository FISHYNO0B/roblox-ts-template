import React, { useBinding, useEffect } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { ColorToken } from "../../core/resolve-color";
import { useSpring } from "../../motion/use-spring";
import { spring } from "../../theme/motion";
import { useTheme } from "../../theme/provider";

export type ProgressBarSize = "sm" | "md" | "lg";
export type ProgressBarVariant = "default" | "success" | "warning" | "destructive" | "accent";

const variantToToken: Record<ProgressBarVariant, ColorToken> = {
	default: "primary",
	success: "success",
	warning: "warning",
	destructive: "destructive",
	accent: "accent",
};

interface SizeStyle {
	height: number;
}

const sizeStyles: Record<ProgressBarSize, SizeStyle> = {
	sm: { height: 4 },
	md: { height: 8 },
	lg: { height: 14 },
};

export interface ProgressBarProps {
	value?: number;
	max?: number;
	size?: ProgressBarSize;
	variant?: ProgressBarVariant;
	indeterminate?: boolean;
	frameSize?: UDim2;
	layoutOrder?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
}

const SHIMMER_PERIOD = 1.4;

export default function ProgressBar(props: ProgressBarProps) {
	const theme = useTheme();
	const size = props.size ?? "md";
	const variant = props.variant ?? "default";
	const s = sizeStyles[size];
	const max = props.max ?? 1;
	const value = props.value ?? 0;
	const ratio = max <= 0 ? 0 : math.clamp(value / max, 0, 1);

	const animatedRatio = useSpring(ratio, spring.snappy);

	const fillColor = theme.colors[variantToToken[variant]];

	const [shimmerPos, setShimmerPos] = useBinding(-0.4);

	useEffect(() => {
		if (!props.indeterminate) return;
		const start = tick();
		const conn = RunService.Heartbeat.Connect(() => {
			const t = ((tick() - start) % SHIMMER_PERIOD) / SHIMMER_PERIOD;
			setShimmerPos(-0.4 + t * 1.8);
		});
		return () => conn.Disconnect();
	}, [props.indeterminate]);

	return (
		<frame
			BackgroundColor3={theme.colors.muted}
			BorderSizePixel={0}
			Size={props.frameSize ?? new UDim2(1, 0, 0, s.height)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			LayoutOrder={props.layoutOrder}
			ClipsDescendants={true}
		>
			<uicorner CornerRadius={new UDim(1, 0)} />

			{!props.indeterminate && (
				<frame
					BackgroundColor3={fillColor}
					BorderSizePixel={0}
					Size={animatedRatio.map((r) => new UDim2(r, 0, 1, 0))}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
				</frame>
			)}

			{props.indeterminate && (
				<frame
					BackgroundColor3={fillColor}
					BorderSizePixel={0}
					AnchorPoint={new Vector2(0, 0)}
					Position={shimmerPos.map((p) => new UDim2(p, 0, 0, 0))}
					Size={new UDim2(0.4, 0, 1, 0)}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
				</frame>
			)}
		</frame>
	);
}
