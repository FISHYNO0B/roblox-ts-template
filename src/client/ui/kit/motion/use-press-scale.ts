import { SpringOptions } from "@rbxts/ripple";
import { spring as springPresets } from "../theme/motion";
import { useHover } from "./use-hover";
import { usePress } from "./use-press";
import { useSpring } from "./use-spring";

export interface PressScaleOptions {
	hoverScale?: number;
	pressScale?: number;
	disabled?: boolean;
}

export interface PressScaleEvents {
	MouseEnter: () => void;
	MouseLeave: () => void;
	MouseButton1Down: () => void;
	MouseButton1Up: () => void;
}

export function usePressScale(options?: PressScaleOptions): [React.Binding<number>, PressScaleEvents] {
	const hoverScale = options?.hoverScale ?? 1.04;
	const pressScale = options?.pressScale ?? 0.96;
	const disabled = options?.disabled ?? false;

	const [hovered, hoverEvents] = useHover();
	const [pressed, pressEvents] = usePress();

	let target = 1;
	if (!disabled) {
		if (pressed) target = pressScale;
		else if (hovered) target = hoverScale;
	}

	const scale = useSpring<number>(target, springPresets.snappy as SpringOptions<number>);

	const events: PressScaleEvents = {
		MouseEnter: hoverEvents.MouseEnter,
		MouseLeave: () => {
			hoverEvents.MouseLeave();
			pressEvents.MouseLeave();
		},
		MouseButton1Down: pressEvents.MouseButton1Down,
		MouseButton1Up: pressEvents.MouseButton1Up,
	};

	return [scale, events];
}
