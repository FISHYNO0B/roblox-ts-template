import React from "@rbxts/react";
import Object from "@rbxts/object-utils";
import { Box, Icon, Stack, Text, usePressScale } from "client/ui/kit";
import { clientStore } from "client/infra/store";
import { selectHolderPage } from "shared/infra/store/selectors/client";
import { HolderPage } from "shared/domain/Gui";
import { IconKey } from "shared/domain/assets/Icons";

const BUTTONS: Partial<Record<HolderPage, IconKey>> = {
	Settings: "settings",
};

interface HolderButtonProps {
	label: string;
	icon: IconKey;
	onClick: () => void;
}

function HolderButton(props: HolderButtonProps) {
	const [scale, events] = usePressScale({ hoverScale: 1.06, pressScale: 0.94 });

	return (
		<textbutton
			AutoButtonColor={false}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Text=""
			Size={new UDim2(0, 70, 0, 90)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Event={{
				MouseButton1Click: props.onClick,
				MouseEnter: events.MouseEnter,
				MouseLeave: events.MouseLeave,
				MouseButton1Down: events.MouseButton1Down,
				MouseButton1Up: events.MouseButton1Up,
			}}
		>
			<uiscale Scale={scale} />
			<Stack
				direction="vertical"
				spacing={1}
				align="center"
				size={new UDim2(1, 0, 1, 0)}
				automaticSize={Enum.AutomaticSize.None}
			>
				<Box bg="card" border="border" radius="lg" size={new UDim2(0, 64, 0, 64)} layoutOrder={0}>
					<Icon
						icon={props.icon}
						size={40}
						color="foreground"
						position={new UDim2(0.5, 0, 0.5, 0)}
						anchorPoint={new Vector2(0.5, 0.5)}
					/>
				</Box>
				<Text
					text={props.label}
					size="xs"
					color="mutedForeground"
					align="center"
					frameSize={new UDim2(1, 0, 0, 16)}
					layoutOrder={1}
				/>
			</Stack>
		</textbutton>
	);
}

export default function ButtonsApp() {
	return (
		<Stack
			direction="horizontal"
			spacing={3}
			automaticSize={Enum.AutomaticSize.XY}
			size={new UDim2(0, 0, 0, 0)}
			layoutOrder={1}
		>
			{Object.keys(BUTTONS).map((name) => (
				<HolderButton
					label={name}
					icon={BUTTONS[name]!}
					onClick={() => {
						const isCurrentPage = clientStore.getState(selectHolderPage) === name;
						clientStore.setHolderPage(isCurrentPage ? undefined : name);
					}}
				/>
			))}
		</Stack>
	);
}
