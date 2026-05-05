export interface VFXEntry {
	folder: string;
	name: string;
	ttl: number;
}

export const VFX = {
	hit: { folder: "Combat", name: "Hit", ttl: 1.5 },
} as const satisfies Record<string, VFXEntry>;

export type VFXKey = keyof typeof VFX;
