import { palette } from "./colors";

export interface GradientDef {
	color: ColorSequence;
	transparency?: NumberSequence;
	rotation?: number;
}

const cs = (a: Color3, b: Color3) =>
	new ColorSequence([new ColorSequenceKeypoint(0, a), new ColorSequenceKeypoint(1, b)]);

const cs3 = (a: Color3, b: Color3, c: Color3) =>
	new ColorSequence([
		new ColorSequenceKeypoint(0, a),
		new ColorSequenceKeypoint(0.5, b),
		new ColorSequenceKeypoint(1, c),
	]);

export type GradientToken =
	| "primary"
	| "primarySheen"
	| "accent"
	| "destructive"
	| "success"
	| "warning"
	| "surface"
	| "surfaceTop"
	| "shimmer"
	| "fadeBottom";

export const gradients: Record<GradientToken, GradientDef> = {
	primary: {
		color: cs(palette.blue[400], palette.blue[600]),
		rotation: 90,
	},
	primarySheen: {
		color: cs3(palette.blue[400], palette.blue[500], palette.blue[700]),
		rotation: 90,
	},
	accent: {
		color: cs(palette.violet[400], palette.violet[600]),
		rotation: 90,
	},
	destructive: {
		color: cs(palette.red[400], palette.red[600]),
		rotation: 90,
	},
	success: {
		color: cs(palette.emerald[400], palette.emerald[600]),
		rotation: 90,
	},
	warning: {
		color: cs(palette.amber[300], palette.amber[500]),
		rotation: 90,
	},
	surface: {
		color: cs(palette.slate[800], palette.slate[900]),
		rotation: 90,
	},
	surfaceTop: {
		color: cs(palette.slate[700], palette.slate[900]),
		rotation: 90,
	},
	shimmer: {
		color: new ColorSequence([
			new ColorSequenceKeypoint(0, palette.slate[700]),
			new ColorSequenceKeypoint(0.5, palette.slate[600]),
			new ColorSequenceKeypoint(1, palette.slate[700]),
		]),
		rotation: 0,
	},
	fadeBottom: {
		color: cs(palette.white, palette.white),
		transparency: new NumberSequence([new NumberSequenceKeypoint(0, 0), new NumberSequenceKeypoint(1, 1)]),
		rotation: 90,
	},
};
