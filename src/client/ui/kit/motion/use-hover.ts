import { useState } from "@rbxts/react";

export interface HoverEvents {
	MouseEnter: () => void;
	MouseLeave: () => void;
}

export function useHover(): [boolean, HoverEvents] {
	const [hovered, setHovered] = useState(false);

	return [
		hovered,
		{
			MouseEnter: () => setHovered(true),
			MouseLeave: () => setHovered(false),
		},
	];
}
