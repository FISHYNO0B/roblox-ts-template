import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "@rbxts/react";
import { HttpService } from "@rbxts/services";
import { ColorToken } from "../../core/resolve-color";
import { useMotion } from "../../motion/use-motion";
import { spring } from "../../theme/motion";
import { useTheme } from "../../theme/provider";

export type ToastVariant = "default" | "success" | "warning" | "destructive" | "accent";

export interface ToastInput {
	title?: string;
	description?: string;
	variant?: ToastVariant;
	duration?: number;
}

interface InternalToast extends ToastInput {
	id: string;
}

interface ToastContextValue {
	toast: (input: ToastInput) => string;
	dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
	toast: () => "",
	dismiss: () => undefined,
});

const variantToToken: Record<ToastVariant, ColorToken | undefined> = {
	default: undefined,
	success: "success",
	warning: "warning",
	destructive: "destructive",
	accent: "accent",
};

export interface ToastProviderProps extends React.PropsWithChildren {
	max?: number;
}

export function ToastProvider(props: ToastProviderProps) {
	const [toasts, setToasts] = useState<Array<InternalToast>>([]);
	const max = props.max ?? 4;

	const dismiss = useCallback((id: string) => {
		setToasts((cur) => cur.filter((t) => t.id !== id));
	}, []);

	const toast = useCallback(
		(input: ToastInput) => {
			const id = HttpService.GenerateGUID(false);
			const item: InternalToast = { ...input, id };
			setToasts((cur) => {
				const updated = [...cur, item];
				if (updated.size() > max) updated.shift();
				return updated;
			});
			const duration = input.duration ?? 4;
			if (duration > 0) {
				task.delay(duration, () => dismiss(id));
			}
			return id;
		},
		[dismiss, max],
	);

	const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

	return (
		<ToastContext.Provider value={value}>
			{props.children}
			<ToastViewport toasts={toasts} dismiss={dismiss} />
		</ToastContext.Provider>
	);
}

export function useToast(): ToastContextValue {
	return useContext(ToastContext);
}

interface ViewportProps {
	toasts: Array<InternalToast>;
	dismiss: (id: string) => void;
}

function ToastViewport(props: ViewportProps) {
	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			AnchorPoint={new Vector2(1, 0)}
			Position={new UDim2(1, -16, 0, 16)}
			Size={new UDim2(0, 360, 1, -32)}
			ZIndex={1000}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				Padding={new UDim(0, 8)}
				HorizontalAlignment={Enum.HorizontalAlignment.Right}
				VerticalAlignment={Enum.VerticalAlignment.Top}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{props.toasts.map((t, i) => (
				<ToastItem key={t.id} toast={t} layoutOrder={i} onClose={() => props.dismiss(t.id)} />
			))}
		</frame>
	);
}

interface ToastItemProps {
	toast: InternalToast;
	layoutOrder: number;
	onClose: () => void;
}

function ToastItem(props: ToastItemProps) {
	const theme = useTheme();
	const variant = props.toast.variant ?? "default";
	const accentToken = variantToToken[variant];
	const accentColor = accentToken !== undefined ? theme.colors[accentToken] : theme.colors.border;

	const [opacity, opacityMotion] = useMotion<number>(0);
	const [offsetX, offsetMotion] = useMotion<number>(40);

	useEffect(() => {
		opacityMotion.spring(1, spring.snappy);
		offsetMotion.spring(0, spring.snappy);
	}, []);

	return (
		<frame
			BackgroundColor3={theme.colors.popover}
			BackgroundTransparency={opacity.map((o) => 1 - o)}
			BorderSizePixel={0}
			Position={offsetX.map((x) => new UDim2(0, x, 0, 0))}
			Size={new UDim2(1, 0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			LayoutOrder={props.layoutOrder}
		>
			<uicorner CornerRadius={theme.radius.md} />
			<uistroke Color={accentColor} Thickness={1} Transparency={opacity.map((o) => 1 - o)} />
			<uipadding
				PaddingTop={new UDim(0, theme.spacing[3])}
				PaddingBottom={new UDim(0, theme.spacing[3])}
				PaddingLeft={new UDim(0, theme.spacing[4])}
				PaddingRight={new UDim(0, theme.spacing[4])}
			/>
			<frame
				BackgroundColor3={accentColor}
				BackgroundTransparency={opacity.map((o) => 1 - o)}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 0.5)}
				Size={new UDim2(0, 1, 1, -theme.spacing[1] * 2)}
				Position={new UDim2(0, -theme.spacing[4] + theme.spacing[2], 0.5, 0)}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
			</frame>

			<frame BackgroundTransparency={1} Size={new UDim2(1, -28, 0, 0)} AutomaticSize={Enum.AutomaticSize.Y}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					Padding={new UDim(0, 4)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{props.toast.title !== undefined && (
					<textlabel
						BackgroundTransparency={1}
						FontFace={theme.typography.fontFace}
						Text={props.toast.title}
						TextColor3={theme.colors.popoverForeground}
						TextTransparency={opacity.map((o) => 1 - o)}
						TextSize={theme.typography.size.base}
						TextXAlignment={Enum.TextXAlignment.Left}
						Size={new UDim2(1, 0, 0, theme.typography.size.base + 4)}
						AutomaticSize={Enum.AutomaticSize.Y}
						LayoutOrder={0}
					/>
				)}
				{props.toast.description !== undefined && (
					<textlabel
						BackgroundTransparency={1}
						FontFace={theme.typography.fontFace}
						Text={props.toast.description}
						TextColor3={theme.colors.mutedForeground}
						TextTransparency={opacity.map((o) => 1 - o)}
						TextSize={theme.typography.size.sm}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextWrapped={true}
						Size={new UDim2(1, 0, 0, theme.typography.size.sm + 4)}
						AutomaticSize={Enum.AutomaticSize.Y}
						LayoutOrder={1}
					/>
				)}
			</frame>

			<textbutton
				AutoButtonColor={false}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Text="×"
				FontFace={theme.typography.fontFace}
				TextColor3={theme.colors.mutedForeground}
				TextTransparency={opacity.map((o) => 1 - o)}
				TextSize={theme.typography.size.xl}
				AnchorPoint={new Vector2(1, 0)}
				Position={new UDim2(1, 0, 0, 0)}
				Size={new UDim2(0, 20, 0, 20)}
				Event={{
					MouseButton1Click: props.onClose,
				}}
			/>
		</frame>
	);
}
