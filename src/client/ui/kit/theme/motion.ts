import { config, SpringOptions, TweenOptions } from "@rbxts/ripple";

export const duration = {
	instant: 0,
	fast: 0.12,
	base: 0.2,
	slow: 0.35,
	slower: 0.6,
} as const;

export type DurationToken = keyof typeof duration;

export const spring = {
	gentle: config.gentle,
	snappy: config.figmaQuick,
	bouncy: config.figmaBouncy,
	stiff: config.stiff,
	wobbly: config.wobbly,
	slow: config.slow,
	default: config.default,
} as const satisfies Record<string, SpringOptions>;

export type SpringPreset = keyof typeof spring;

export const tween = {
	fast: { duration: duration.fast, easing: "quadOut" } satisfies TweenOptions,
	base: { duration: duration.base, easing: "quadOut" } satisfies TweenOptions,
	slow: { duration: duration.slow, easing: "quadOut" } satisfies TweenOptions,
} as const;

export type TweenPreset = keyof typeof tween;

export const motion = {
	duration,
	spring,
	tween,
};
