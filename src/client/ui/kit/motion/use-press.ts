import { useState } from "@rbxts/react";

export interface PressEvents {
	MouseButton1Down: () => void;
	MouseButton1Up: () => void;
	MouseLeave: () => void;
}

export function usePress(): [boolean, PressEvents] {
	const [pressed, setPressed] = useState(false);

	return [
		pressed,
		{
			MouseButton1Down: () => setPressed(true),
			MouseButton1Up: () => setPressed(false),
			MouseLeave: () => setPressed(false),
		},
	];
}
