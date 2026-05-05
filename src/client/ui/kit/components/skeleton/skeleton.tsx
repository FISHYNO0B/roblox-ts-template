import React, { useBinding, useEffect } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { useTheme } from "../../theme/provider";
import { RadiusToken } from "../../theme/radius";

export type SkeletonShape = "rect" | "circle" | "text";

export interface SkeletonProps {
	width?: UDim;
	height?: UDim;
	radius?: RadiusToken;
	shape?: SkeletonShape;
	layoutOrder?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
}

const shapeDefaults: Record<SkeletonShape, { width: UDim; height: UDim; radius: RadiusToken }> = {
	rect: { width: new UDim(1, 0), height: new UDim(0, 64), radius: "md" },
	circle: { width: new UDim(0, 48), height: new UDim(0, 48), radius: "full" },
	text: { width: new UDim(1, 0), height: new UDim(0, 14), radius: "sm" },
};

const PULSE_PERIOD = 1.4;
const MIN_TRANSPARENCY = 0.55;
const MAX_TRANSPARENCY = 0.85;

export default function Skeleton(props: SkeletonProps) {
	const theme = useTheme();
	const shape = props.shape ?? "rect";
	const def = shapeDefaults[shape];
	const width = props.width ?? def.width;
	const height = props.height ?? def.height;
	const radiusToken = props.radius ?? def.radius;

	const [transparency, setTransparency] = useBinding(MIN_TRANSPARENCY);

	useEffect(() => {
		const start = tick();
		const conn = RunService.Heartbeat.Connect(() => {
			const phase = ((tick() - start) % PULSE_PERIOD) / PULSE_PERIOD;
			const wave = (1 - math.cos(phase * math.pi * 2)) / 2;
			setTransparency(MIN_TRANSPARENCY + (MAX_TRANSPARENCY - MIN_TRANSPARENCY) * wave);
		});
		return () => conn.Disconnect();
	}, []);

	return (
		<frame
			BackgroundColor3={theme.colors.muted}
			BackgroundTransparency={transparency}
			BorderSizePixel={0}
			Size={new UDim2(width.Scale, width.Offset, height.Scale, height.Offset)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			LayoutOrder={props.layoutOrder}
		>
			<uicorner CornerRadius={theme.radius[radiusToken]} />
		</frame>
	);
}
