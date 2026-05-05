export const SETTINGS = ["PvP"] as const;
export type Setting = (typeof SETTINGS)[number];

export const VOLUME_GROUPS = ["master", "sfx", "music", "ambience"] as const;
export type VolumeGroup = (typeof VOLUME_GROUPS)[number];

export const DEFAULT_VOLUME = 1;
