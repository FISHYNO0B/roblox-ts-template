import React, { useEffect } from "@rbxts/react";
import { useMotion } from "../../motion/use-motion";
import { spring } from "../../theme/motion";
import { useTheme } from "../../theme/provider";
import { SpacingToken } from "../../theme/spacing";
import Stack from "../stack/stack";
import Text from "../text/text";

export type DialogSize = "sm" | "md" | "lg" | "xl";

const DIALOG_WIDTHS: Record<DialogSize, number> = {
	sm: 320,
	md: 480,
	lg: 640,
	xl: 800,
};

export interface DialogProps extends React.PropsWithChildren {
	open: boolean;
	onOpenChange?: (open: boolean) => void;
	closeOnBackdrop?: boolean;
	size?: DialogSize;
	padding?: SpacingToken;
	zIndex?: number;
}

export default function Dialog(props: DialogProps) {
	const theme = useTheme();
	const size = props.size ?? "md";
	const closeOnBackdrop = props.closeOnBackdrop ?? true;

	const [opacity, opacityMotion] = useMotion<number>(0);
	const [scale, scaleMotion] = useMotion<number>(0.95);

	useEffect(() => {
		if (props.open) {
			opacityMotion.spring(1, spring.snappy);
			scaleMotion.spring(1, spring.snappy);
		} else {
			opacityMotion.spring(0, spring.snappy);
			scaleMotion.spring(0.95, spring.snappy);
		}
	}, [props.open]);

	if (!props.open) return undefined;

	return (
		<frame BackgroundTransparency={1} BorderSizePixel={0} Size={new UDim2(1, 0, 1, 0)} ZIndex={props.zIndex ?? 100}>
			<textbutton
				AutoButtonColor={false}
				BackgroundColor3={theme.colors.background}
				BackgroundTransparency={opacity.map((o) => 1 - 0.7 * o)}
				BorderSizePixel={0}
				Text=""
				Size={new UDim2(1, 0, 1, 0)}
				ZIndex={1}
				Event={{
					MouseButton1Click: closeOnBackdrop ? () => props.onOpenChange?.(false) : undefined,
				}}
			/>

			<frame
				BackgroundColor3={theme.colors.card}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(0, DIALOG_WIDTHS[size], 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				ZIndex={2}
			>
				<uiscale Scale={scale} />
				<uicorner CornerRadius={theme.radius.lg} />
				<uistroke Color={theme.colors.border} Thickness={1} />
				<uipadding
					PaddingTop={new UDim(0, theme.spacing[props.padding ?? 6])}
					PaddingBottom={new UDim(0, theme.spacing[props.padding ?? 6])}
					PaddingLeft={new UDim(0, theme.spacing[props.padding ?? 6])}
					PaddingRight={new UDim(0, theme.spacing[props.padding ?? 6])}
				/>
				<Stack direction="vertical" spacing={4} automaticSize={Enum.AutomaticSize.Y}>
					{props.children}
				</Stack>
			</frame>
		</frame>
	);
}

export interface DialogSlotProps extends React.PropsWithChildren {
	layoutOrder?: number;
}

export function DialogHeader(props: DialogSlotProps) {
	return (
		<Stack
			direction="vertical"
			spacing={1}
			automaticSize={Enum.AutomaticSize.Y}
			layoutOrder={props.layoutOrder ?? 0}
		>
			{props.children}
		</Stack>
	);
}

export function DialogContent(props: DialogSlotProps) {
	return (
		<Stack
			direction="vertical"
			spacing={2}
			automaticSize={Enum.AutomaticSize.Y}
			layoutOrder={props.layoutOrder ?? 1}
		>
			{props.children}
		</Stack>
	);
}

export function DialogFooter(props: DialogSlotProps) {
	return (
		<Stack
			direction="horizontal"
			spacing={2}
			align="center"
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
			layoutOrder={props.layoutOrder ?? 2}
		>
			{props.children}
		</Stack>
	);
}

export interface DialogTextProps {
	text: string;
	layoutOrder?: number;
}

export function DialogTitle(props: DialogTextProps) {
	return <Text text={props.text} size="xl" color="cardForeground" layoutOrder={props.layoutOrder} />;
}

export function DialogDescription(props: DialogTextProps) {
	return (
		<Text
			text={props.text}
			size="sm"
			color="mutedForeground"
			wrap={true}
			frameSize={new UDim2(1, 0, 0, 0)}
			automaticSize={Enum.AutomaticSize.Y}
			layoutOrder={props.layoutOrder}
		/>
	);
}
