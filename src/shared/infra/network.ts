import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
import { MusicKey } from "shared/domain/assets/Music";
import { SoundKey } from "shared/domain/assets/Sounds";
import { Setting, VolumeGroup } from "../domain/Settings";

interface ServerEvents {
	reflex: {
		start: () => void;
	};

	toggleSetting: (setting: Setting) => void;
	setVolume: (group: VolumeGroup, value: number) => void;
}

interface ServerFunctions {}

interface ClientEvents {
	reflex: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		start: () => void;
	};

	playSoundAt: (key: SoundKey, position: Vector3) => void;
	playMusic: (key: MusicKey) => void;
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
