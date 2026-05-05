import React from "@rbxts/react";
import { useTheme } from "../../theme/provider";
import { SpacingToken } from "../../theme/spacing";

export type ScrollDirection = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps extends React.PropsWithChildren {
	direction?: ScrollDirection;
	padding?: SpacingToken;
	spacing?: SpacingToken;
	size?: UDim2;
	position?: UDim2;
	anchorPoint?: Vector2;
	scrollBarThickness?: number;
	layoutOrder?: number;
}

export default function ScrollArea(props: ScrollAreaProps) {
	const theme = useTheme();
	const direction = props.direction ?? "vertical";

	const automaticCanvas =
		direction === "vertical"
			? Enum.AutomaticSize.Y
			: direction === "horizontal"
				? Enum.AutomaticSize.X
				: Enum.AutomaticSize.XY;

	const scrollingDirection =
		direction === "vertical"
			? Enum.ScrollingDirection.Y
			: direction === "horizontal"
				? Enum.ScrollingDirection.X
				: Enum.ScrollingDirection.XY;

	const fillDirection = direction === "horizontal" ? Enum.FillDirection.Horizontal : Enum.FillDirection.Vertical;

	const padValue = props.padding !== undefined ? new UDim(0, theme.spacing[props.padding]) : undefined;

	return (
		<scrollingframe
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={props.size ?? new UDim2(1, 0, 1, 0)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			AutomaticCanvasSize={automaticCanvas}
			CanvasSize={new UDim2(0, 0, 0, 0)}
			ScrollingDirection={scrollingDirection}
			ScrollBarThickness={props.scrollBarThickness ?? 6}
			ScrollBarImageColor3={theme.colors.border}
			VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
			HorizontalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
			LayoutOrder={props.layoutOrder}
		>
			{padValue !== undefined && (
				<uipadding
					PaddingTop={padValue}
					PaddingBottom={padValue}
					PaddingLeft={padValue}
					PaddingRight={padValue}
				/>
			)}
			<uilistlayout
				FillDirection={fillDirection}
				Padding={props.spacing !== undefined ? new UDim(0, theme.spacing[props.spacing]) : undefined}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{props.children}
		</scrollingframe>
	);
}
