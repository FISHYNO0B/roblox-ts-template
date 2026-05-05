import { useEffect } from "@rbxts/react";
import { Animatable, PartialGoal, SpringOptions } from "@rbxts/ripple";
import { useMotion } from "./use-motion";

export function useSpring<T extends Animatable>(goal: T, options?: SpringOptions<T>): React.Binding<T> {
	const [binding, motion] = useMotion<T>(goal);

	useEffect(() => {
		motion.setGoal(goal as PartialGoal<T>, options);
	}, [goal]);

	return binding;
}
