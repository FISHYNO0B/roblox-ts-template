import { useBinding, useEffect, useMemo } from "@rbxts/react";
import { Animatable, createMotion, Motion, MotionOptions } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";

export function useMotion<T extends Animatable>(initial: T, options?: MotionOptions<T>): [React.Binding<T>, Motion<T>] {
	const motion = useMemo(() => createMotion(initial, options), []);
	const [binding, setBinding] = useBinding(initial);

	useEffect(() => {
		const connection = RunService.Heartbeat.Connect((dt) => {
			const value = motion.step(dt);
			if (!motion.idle()) {
				setBinding(value);
			}
		});

		return () => {
			connection.Disconnect();
			motion.destroy();
		};
	}, []);

	return [binding, motion];
}
