import React from "@rbxts/react";
import { SpacingToken } from "../../theme/spacing";
import { useTheme } from "../../theme/provider";

export type StackDirection = "vertical" | "horizontal";
export type StackAlign = "start" | "center" | "end";

const horizontalMap: Record<StackAlign, Enum.HorizontalAlignment> = {
	start: Enum.HorizontalAlignment.Left,
	center: Enum.HorizontalAlignment.Center,
	end: Enum.HorizontalAlignment.Right,
};

const verticalMap: Record<StackAlign, Enum.VerticalAlignment> = {
	start: Enum.VerticalAlignment.Top,
	center: Enum.VerticalAlignment.Center,
	end: Enum.VerticalAlignment.Bottom,
};

export interface StackProps extends React.PropsWithChildren {
	direction?: StackDirection;
	spacing?: SpacingToken;
	align?: StackAlign;
	justify?: StackAlign;
	wrap?: boolean;

	size?: UDim2;
	position?: UDim2;
	anchorPoint?: Vector2;
	automaticSize?: Enum.AutomaticSize;
	layoutOrder?: number;
}

export default function Stack(props: StackProps) {
	const theme = useTheme();
	const direction = props.direction ?? "vertical";
	const fillDir = direction === "vertical" ? Enum.FillDirection.Vertical : Enum.FillDirection.Horizontal;

	const padding = props.spacing !== undefined ? new UDim(0, theme.spacing[props.spacing]) : undefined;

	const horizontal =
		direction === "horizontal"
			? props.justify !== undefined
				? horizontalMap[props.justify]
				: undefined
			: props.align !== undefined
				? horizontalMap[props.align]
				: undefined;

	const vertical =
		direction === "vertical"
			? props.justify !== undefined
				? verticalMap[props.justify]
				: undefined
			: props.align !== undefined
				? verticalMap[props.align]
				: undefined;

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={props.size ?? (direction === "vertical" ? new UDim2(1, 0, 0, 0) : new UDim2(0, 0, 1, 0))}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			AutomaticSize={
				props.automaticSize ?? (direction === "vertical" ? Enum.AutomaticSize.Y : Enum.AutomaticSize.X)
			}
			LayoutOrder={props.layoutOrder}
		>
			<uilistlayout
				FillDirection={fillDir}
				Padding={padding}
				HorizontalAlignment={horizontal}
				VerticalAlignment={vertical}
				Wraps={props.wrap}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{props.children}
		</frame>
	);
}

export function VStack(props: Omit<StackProps, "direction">) {
	return <Stack {...props} direction="vertical" />;
}

export function HStack(props: Omit<StackProps, "direction">) {
	return <Stack {...props} direction="horizontal" />;
}
