import { createProducer } from "@rbxts/reflex";
import { VFXKey } from "shared/domain/assets/VFX";

export interface Effect {
	id: string;
	kind: VFXKey;
	cframe: CFrame;
	startedAt: number;
	ttl: number;
}

export interface EffectsState {
	list: ReadonlyArray<Effect>;
}

const initialState: EffectsState = {
	list: [],
};

export const effectsSlice = createProducer(initialState, {
	playEffect: (state, effect: Effect) => ({
		...state,
		list: [...state.list, effect],
	}),

	removeEffect: (state, id: string) => ({
		...state,
		list: state.list.filter((effect) => effect.id !== id),
	}),

	expireEffects: (state, now: number) => ({
		...state,
		list: state.list.filter((effect) => effect.startedAt + effect.ttl >= now),
	}),
});
