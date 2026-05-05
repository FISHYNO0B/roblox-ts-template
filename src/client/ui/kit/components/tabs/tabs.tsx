import React, { createContext, useContext } from "@rbxts/react";
import { useSpring } from "../../motion/use-spring";
import { spring } from "../../theme/motion";
import { useTheme } from "../../theme/provider";
import { FontSizeToken } from "../../theme/typography";
import { SpacingToken } from "../../theme/spacing";

export type TabsVariant = "pills" | "underline";
export type TabsSize = "sm" | "md" | "lg";

interface SizeStyle {
	height: number;
	paddingX: SpacingToken;
	gap: SpacingToken;
	fontSize: FontSizeToken;
}

const sizeStyles: Record<TabsSize, SizeStyle> = {
	sm: { height: 28, paddingX: 3, gap: 1, fontSize: "sm" },
	md: { height: 36, paddingX: 4, gap: 1, fontSize: "base" },
	lg: { height: 44, paddingX: 5, gap: 2, fontSize: "lg" },
};

interface TabsContextValue {
	value: string;
	onChange?: (value: string) => void;
	variant: TabsVariant;
	size: TabsSize;
}

const TabsContext = createContext<TabsContextValue>({
	value: "",
	variant: "pills",
	size: "md",
});

export interface TabsProps extends React.PropsWithChildren {
	value: string;
	onChange?: (value: string) => void;
	variant?: TabsVariant;
	size?: TabsSize;
	frameSize?: UDim2;
	layoutOrder?: number;
}

export default function Tabs(props: TabsProps) {
	return (
		<TabsContext.Provider
			value={{
				value: props.value,
				onChange: props.onChange,
				variant: props.variant ?? "pills",
				size: props.size ?? "md",
			}}
		>
			<frame
				BackgroundTransparency={1}
				Size={props.frameSize ?? new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				LayoutOrder={props.layoutOrder}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					Padding={new UDim(0, 12)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{props.children}
			</frame>
		</TabsContext.Provider>
	);
}

export interface TabsListProps extends React.PropsWithChildren {
	layoutOrder?: number;
}

export function TabsList(props: TabsListProps) {
	const theme = useTheme();
	const ctx = useContext(TabsContext);
	const s = sizeStyles[ctx.size];
	const variant = ctx.variant;

	if (variant === "pills") {
		return (
			<frame
				BackgroundColor3={theme.colors.muted}
				BorderSizePixel={0}
				Size={new UDim2(0, 0, 0, s.height + 8)}
				AutomaticSize={Enum.AutomaticSize.X}
				LayoutOrder={props.layoutOrder ?? 0}
			>
				<uicorner CornerRadius={theme.radius.md} />
				<uipadding
					PaddingTop={new UDim(0, 4)}
					PaddingBottom={new UDim(0, 4)}
					PaddingLeft={new UDim(0, 4)}
					PaddingRight={new UDim(0, 4)}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					Padding={new UDim(0, theme.spacing[s.gap])}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				{props.children}
			</frame>
		);
	}

	return (
		<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 0, s.height + 1)} LayoutOrder={props.layoutOrder ?? 0}>
			<frame
				BackgroundColor3={theme.colors.border}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 1)}
				Position={new UDim2(0, 0, 1, 0)}
				Size={new UDim2(1, 0, 0, 1)}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, theme.spacing[s.gap])}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{props.children}
		</frame>
	);
}

export interface TabsTriggerProps {
	value: string;
	text: string;
	disabled?: boolean;
	layoutOrder?: number;
}

export function TabsTrigger(props: TabsTriggerProps) {
	const theme = useTheme();
	const ctx = useContext(TabsContext);
	const s = sizeStyles[ctx.size];
	const active = ctx.value === props.value;
	const disabled = props.disabled ?? false;

	const fgColor = useSpring(active ? theme.colors.foreground : theme.colors.mutedForeground, spring.snappy);
	const bgColor = useSpring(active ? theme.colors.background : theme.colors.muted, spring.snappy);

	if (ctx.variant === "pills") {
		return (
			<textbutton
				AutoButtonColor={false}
				BackgroundColor3={bgColor}
				BackgroundTransparency={active ? 0 : 1}
				BorderSizePixel={0}
				Text=""
				AutomaticSize={Enum.AutomaticSize.X}
				Size={new UDim2(0, 0, 0, s.height)}
				LayoutOrder={props.layoutOrder}
				Active={!disabled}
				Selectable={!disabled}
				Event={{
					MouseButton1Click: disabled || active ? undefined : () => ctx.onChange?.(props.value),
				}}
			>
				<uicorner CornerRadius={theme.radius.sm} />
				<uipadding
					PaddingLeft={new UDim(0, theme.spacing[s.paddingX])}
					PaddingRight={new UDim(0, theme.spacing[s.paddingX])}
				/>
				<textlabel
					BackgroundTransparency={1}
					FontFace={theme.typography.fontFace}
					Text={props.text}
					TextColor3={fgColor}
					TextTransparency={disabled ? 0.5 : 0}
					TextSize={theme.typography.size[s.fontSize]}
					AutomaticSize={Enum.AutomaticSize.XY}
					Size={new UDim2(0, 0, 1, 0)}
					TextYAlignment={Enum.TextYAlignment.Center}
				/>
			</textbutton>
		);
	}

	return (
		<textbutton
			AutoButtonColor={false}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Text=""
			AutomaticSize={Enum.AutomaticSize.X}
			Size={new UDim2(0, 0, 1, 0)}
			LayoutOrder={props.layoutOrder}
			Active={!disabled}
			Selectable={!disabled}
			Event={{
				MouseButton1Click: disabled || active ? undefined : () => ctx.onChange?.(props.value),
			}}
		>
			<uipadding
				PaddingLeft={new UDim(0, theme.spacing[s.paddingX])}
				PaddingRight={new UDim(0, theme.spacing[s.paddingX])}
			/>
			<textlabel
				BackgroundTransparency={1}
				FontFace={theme.typography.fontFace}
				Text={props.text}
				TextColor3={fgColor}
				TextTransparency={disabled ? 0.5 : 0}
				TextSize={theme.typography.size[s.fontSize]}
				AutomaticSize={Enum.AutomaticSize.XY}
				Size={new UDim2(0, 0, 1, 0)}
				TextYAlignment={Enum.TextYAlignment.Center}
			/>
			{active && (
				<frame
					BackgroundColor3={theme.colors.primary}
					BorderSizePixel={0}
					AnchorPoint={new Vector2(0.5, 1)}
					Position={new UDim2(0.5, 0, 1, 0)}
					Size={new UDim2(1, -8, 0, 2)}
				/>
			)}
		</textbutton>
	);
}

export interface TabsContentProps extends React.PropsWithChildren {
	value: string;
	layoutOrder?: number;
}

export function TabsContent(props: TabsContentProps) {
	const ctx = useContext(TabsContext);
	if (ctx.value !== props.value) return undefined;
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			LayoutOrder={props.layoutOrder ?? 1}
		>
			{props.children}
		</frame>
	);
}
