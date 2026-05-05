export type SoundGroup = "ui" | "sfx";

export interface SoundEntry {
	id: string;
	group: SoundGroup;
	volume: number;
}

export const Sounds = {
	click: { id: "rbxassetid://0", group: "ui", volume: 0.5 },
} as const satisfies Record<string, SoundEntry>;

export type SoundKey = keyof typeof Sounds;
