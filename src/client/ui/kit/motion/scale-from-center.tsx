import React from "@rbxts/react";

export interface ScaleFromCenterProps extends React.PropsWithChildren {
	scale: React.Binding<number>;
	size?: UDim2;
	automaticSize?: Enum.AutomaticSize;
}

export default function ScaleFromCenter(props: ScaleFromCenterProps) {
	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Size={props.size ?? new UDim2(1, 0, 1, 0)}
			AutomaticSize={props.automaticSize ?? Enum.AutomaticSize.None}
		>
			<uiscale Scale={props.scale} />
			{props.children}
		</frame>
	);
}
