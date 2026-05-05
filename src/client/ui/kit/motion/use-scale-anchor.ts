import { useEffect, useRef } from "@rbxts/react";

// AbsoluteSize is post-UIScale (physical pixels); Position.Offset is design space.
// Walk up and divide out every ancestor UIScale so the shift we add is in the
// units Position is later rendered in.
function cumulativeAncestorScale(start: Instance | undefined): number {
	let scale = 1;
	let node = start;
	while (node) {
		const s = node.FindFirstChildOfClass("UIScale");
		if (s) scale *= s.Scale;
		if (node.IsA("LayerCollector")) break;
		node = node.Parent;
	}
	return scale;
}

export function useScaleAnchor<T extends GuiObject>(): React.MutableRefObject<T | undefined> {
	const ref = useRef<T>();

	useEffect(() => {
		const target = ref.current;
		if (!target) return;

		const apply = () => {
			const oldAnchor = target.AnchorPoint;
			if (oldAnchor.X === 0.5 && oldAnchor.Y === 0.5) return true;
			const size = target.AbsoluteSize;
			if (size.X <= 0 || size.Y <= 0) return false;
			let k = cumulativeAncestorScale(target.Parent);
			if (k <= 0) k = 1;
			const designSize = size.div(k);
			const dx = (0.5 - oldAnchor.X) * designSize.X;
			const dy = (0.5 - oldAnchor.Y) * designSize.Y;
			const pos = target.Position;
			target.AnchorPoint = new Vector2(0.5, 0.5);
			target.Position = new UDim2(pos.X.Scale, pos.X.Offset + dx, pos.Y.Scale, pos.Y.Offset + dy);
			return true;
		};

		if (apply()) return;

		const conn = (target as GuiObject).GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			if (apply()) conn.Disconnect();
		});

		return () => conn.Disconnect();
	}, []);

	return ref;
}
