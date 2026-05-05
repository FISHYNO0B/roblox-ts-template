import React from "@rbxts/react";
import { ColorToken } from "../../core/resolve-color";
import { useTheme } from "../../theme/provider";
import { palette } from "../../theme/colors";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

interface SizeStyle {
	box: number;
	font: number;
	dot: number;
}

const sizeStyles: Record<AvatarSize, SizeStyle> = {
	xs: { box: 24, font: 10, dot: 8 },
	sm: { box: 32, font: 12, dot: 10 },
	md: { box: 48, font: 16, dot: 12 },
	lg: { box: 64, font: 20, dot: 14 },
	xl: { box: 96, font: 28, dot: 18 },
};

const statusToToken: Record<AvatarStatus, ColorToken> = {
	online: "success",
	offline: "mutedForeground",
	away: "warning",
	busy: "destructive",
};

function imageUrl(props: { src?: string; userId?: number }, size: number): string | undefined {
	if (props.src !== undefined) return props.src;
	if (props.userId !== undefined) {
		const dim = size >= 100 ? 150 : size >= 50 ? 100 : 48;
		return `rbxthumb://type=AvatarHeadShot&id=${props.userId}&w=${dim}&h=${dim}`;
	}
	return undefined;
}

function initials(text: string): string {
	const parts: Array<string> = [];
	for (const part of text.split(" ")) {
		if (part.size() > 0) parts.push(part);
	}
	if (parts.size() === 0) return "?";
	if (parts.size() >= 2) {
		const a = parts[0].sub(1, 1);
		const b = parts[parts.size() - 1].sub(1, 1);
		return (a + b).upper();
	}
	return parts[0].sub(1, 2).upper();
}

function fallbackBg(text: string): Color3 {
	const colors = [palette.blue[500], palette.violet[500], palette.emerald[500], palette.amber[500], palette.red[500]];
	let hash = 0;
	for (let i = 1; i <= text.size(); i++) {
		hash = (hash + text.byte(i)[0]) % 1000;
	}
	return colors[hash % colors.size()];
}

export interface AvatarProps {
	src?: string;
	userId?: number;
	fallback?: string;
	size?: AvatarSize;
	shape?: AvatarShape;
	status?: AvatarStatus;
	layoutOrder?: number;
	position?: UDim2;
	anchorPoint?: Vector2;
}

export default function Avatar(props: AvatarProps) {
	const theme = useTheme();
	const size = props.size ?? "md";
	const shape = props.shape ?? "circle";
	const s = sizeStyles[size];
	const url = imageUrl(props, s.box);

	const showFallback = url === undefined;
	const fallbackText = props.fallback ?? "";
	const init = initials(fallbackText);
	const bg = fallbackText.size() > 0 ? fallbackBg(fallbackText) : theme.colors.muted;

	const cornerRadius = shape === "circle" ? new UDim(1, 0) : theme.radius.lg;

	return (
		<frame
			BackgroundColor3={bg}
			BorderSizePixel={0}
			Size={new UDim2(0, s.box, 0, s.box)}
			LayoutOrder={props.layoutOrder}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
		>
			<uicorner CornerRadius={cornerRadius} />

			{showFallback && (
				<textlabel
					BackgroundTransparency={1}
					FontFace={theme.typography.fontFace}
					Text={init}
					TextColor3={theme.colors.foreground}
					TextSize={s.font}
					Size={new UDim2(1, 0, 1, 0)}
					TextXAlignment={Enum.TextXAlignment.Center}
					TextYAlignment={Enum.TextYAlignment.Center}
				/>
			)}

			{url !== undefined && (
				<imagelabel BackgroundTransparency={1} Image={url} Size={new UDim2(1, 0, 1, 0)}>
					<uicorner CornerRadius={cornerRadius} />
				</imagelabel>
			)}

			{props.status !== undefined && (
				<frame
					BackgroundColor3={theme.colors[statusToToken[props.status]]}
					BorderSizePixel={0}
					AnchorPoint={new Vector2(1, 1)}
					Position={new UDim2(1, 0, 1, 0)}
					Size={new UDim2(0, s.dot, 0, s.dot)}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<uistroke Color={theme.colors.background} Thickness={2} />
				</frame>
			)}
		</frame>
	);
}
