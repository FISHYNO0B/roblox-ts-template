import React from "@rbxts/react";
import { Box, Icon, Text, Stack, ScaleFromCenter } from "client/ui/kit";
import { usePressScale } from "client/ui/kit";
import { ImageName, IMAGES } from "shared/domain/Gui";

interface Props {
	button: string;
	image: ImageName;
	click: () => void;
}

export default function Button(props: Props) {
	const [scale, events] = usePressScale({ hoverScale: 1.06, pressScale: 0.94 });

	return (
		<textbutton
			AutoButtonColor={false}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Text=""
			Size={new UDim2(0, 70, 0, 90)}
			Event={{
				MouseButton1Click: props.click,
				MouseEnter: events.MouseEnter,
				MouseLeave: events.MouseLeave,
				MouseButton1Down: events.MouseButton1Down,
				MouseButton1Up: events.MouseButton1Up,
			}}
		>
			<ScaleFromCenter scale={scale}>
				<Stack
					direction="vertical"
					spacing={1}
					align="center"
					size={new UDim2(1, 0, 1, 0)}
					automaticSize={Enum.AutomaticSize.None}
				>
					<Box bg="card" border="border" radius="lg" size={new UDim2(0, 64, 0, 64)} layoutOrder={0}>
						<Icon
							asset={IMAGES[props.image]}
							size={40}
							color="foreground"
							position={new UDim2(0.5, 0, 0.5, 0)}
							anchorPoint={new Vector2(0.5, 0.5)}
						/>
					</Box>
					<Text
						text={props.button}
						size="xs"
						color="mutedForeground"
						align="center"
						frameSize={new UDim2(1, 0, 0, 16)}
						layoutOrder={1}
					/>
				</Stack>
			</ScaleFromCenter>
		</textbutton>
	);
}
