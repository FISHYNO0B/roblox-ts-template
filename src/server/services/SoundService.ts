import { Service } from "@flamework/core";
import { ServerEvents } from "server/infra/network";
import { MusicKey } from "shared/domain/assets/Music";
import { SoundKey } from "shared/domain/assets/Sounds";

@Service({})
export class SoundService {
	public replicate(key: SoundKey, position: Vector3) {
		ServerEvents.playSoundAt.broadcast(key, position);
	}

	public replicateTo(player: Player, key: SoundKey, position: Vector3) {
		ServerEvents.playSoundAt(player, key, position);
	}

	public playMusicFor(player: Player, key: MusicKey) {
		ServerEvents.playMusic(player, key);
	}
}
