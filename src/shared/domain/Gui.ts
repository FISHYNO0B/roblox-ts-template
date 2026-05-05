export const HOLDER_PAGES = ["Settings"] as const;
export type HolderPage = (typeof HOLDER_PAGES)[number];

export const IMAGES = {
	Coins: "15416676802",
	Gems: "15416675953",
	Settings: "16545611198",
} as const;

export type ImageName = keyof typeof IMAGES;
