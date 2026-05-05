export interface MusicEntry {
	id: string;
	volume: number;
	looped: boolean;
}

export const Music = {
	menu: { id: "rbxassetid://0", volume: 0.6, looped: true },
	combat: { id: "rbxassetid://0", volume: 0.6, looped: true },
	boss: { id: "rbxassetid://0", volume: 0.6, looped: true },
} as const satisfies Record<string, MusicEntry>;

export type MusicKey = keyof typeof Music;
