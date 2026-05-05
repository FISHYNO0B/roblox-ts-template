import React, { useEffect, useState } from "@rbxts/react";
import { useSpring } from "../../motion/use-spring";
import { spring } from "../../theme/motion";
import { useTheme } from "../../theme/provider";

export type TooltipSide = "top" | "bottom" | "left" | "right";

interface SideStyle {
	anchor: Vector2;
	position: UDim2;
}

const sideStyles: Record<TooltipSide, SideStyle> = {
	top: { anchor: new Vector2(0.5, 1), position: new UDim2(0.5, 0, 0, -8) },
	bottom: { anchor: new Vector2(0.5, 0), position: new UDim2(0.5, 0, 1, 8) },
	left: { anchor: new Vector2(1, 0.5), position: new UDim2(0, -8, 0.5, 0) },
	right: { anchor: new Vector2(0, 0.5), position: new UDim2(1, 8, 0.5, 0) },
};

export interface TooltipProps extends React.PropsWithChildren {
	content: string;
	side?: TooltipSide;
	delay?: number;
}

export default function Tooltip(props: TooltipProps) {
	const theme = useTheme();
	const side = props.side ?? "top";
	const sideStyle = sideStyles[side];

	const [hovered, setHovered] = useState(false);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!hovered) {
			setVisible(false);
			return;
		}
		const handle = task.delay(props.delay ?? 0.4, () => setVisible(true));
		return () => task.cancel(handle);
	}, [hovered, props.delay]);

	const opacity = useSpring(visible ? 1 : 0, spring.snappy);

	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0, 0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
			Event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
			}}
		>
			{props.children}

			{visible && (
				<frame
					BackgroundColor3={theme.colors.popover}
					BackgroundTransparency={opacity.map((o) => 1 - o)}
					BorderSizePixel={0}
					AnchorPoint={sideStyle.anchor}
					Position={sideStyle.position}
					Size={new UDim2(0, 0, 0, 0)}
					AutomaticSize={Enum.AutomaticSize.XY}
					ZIndex={50}
				>
					<uicorner CornerRadius={theme.radius.sm} />
					<uistroke Color={theme.colors.border} Thickness={1} Transparency={opacity.map((o) => 1 - o)} />
					<uipadding
						PaddingTop={new UDim(0, theme.spacing[2])}
						PaddingBottom={new UDim(0, theme.spacing[2])}
						PaddingLeft={new UDim(0, theme.spacing[3])}
						PaddingRight={new UDim(0, theme.spacing[3])}
					/>
					<textlabel
						BackgroundTransparency={1}
						FontFace={theme.typography.fontFace}
						Text={props.content}
						TextColor3={theme.colors.popoverForeground}
						TextTransparency={opacity.map((o) => 1 - o)}
						TextSize={theme.typography.size.sm}
						AutomaticSize={Enum.AutomaticSize.XY}
						Size={new UDim2(0, 0, 0, 0)}
					/>
				</frame>
			)}
		</frame>
	);
}
