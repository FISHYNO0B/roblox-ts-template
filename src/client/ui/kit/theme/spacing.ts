export const spacing = {
	0: 0,
	1: 4,
	2: 8,
	3: 12,
	4: 16,
	5: 20,
	6: 24,
	8: 32,
	10: 40,
	12: 48,
	16: 64,
	20: 80,
	24: 96,
} as const;

export type SpacingToken = keyof typeof spacing;

export function space(token: SpacingToken): number {
	return spacing[token];
}

export function spaceUDim(token: SpacingToken): UDim {
	return new UDim(0, spacing[token]);
}
