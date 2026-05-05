import { Controller, OnInit } from "@flamework/core";
import { ContentProvider, Debris, Players, SoundService, Workspace } from "@rbxts/services";
import { ClientEvents } from "client/infra/network";
import { clientStore } from "client/infra/store";
import { SoundEntry, SoundKey, Sounds } from "shared/domain/assets/Sounds";
import { selectPlayerVolumes } from "shared/infra/store/selectors/players";

const GROUP_NAMES = ["UI", "SFX", "Music", "Ambience"] as const;
type GroupName = (typeof GROUP_NAMES)[number];

const POSITIONAL_FALLBACK_TTL = 30;

interface PlayOptions {
	volume?: number;
}

interface VolumeState {
	master: number;
	sfx: number;
	music: number;
	ambience: number;
}

@Controller()
export class SoundController implements OnInit {
	private groups = new Map<GroupName, SoundGroup>();
	private cache = new Map<SoundKey, Sound>();

	onInit() {
		this.bootstrapGroups();

		const playerId = tostring(Players.LocalPlayer.UserId);
		const selectVolumes = selectPlayerVolumes(playerId);

		this.applyVolumes(clientStore.getState(selectVolumes));
		clientStore.subscribe(selectVolumes, (volumes) => this.applyVolumes(volumes));

		ClientEvents.playSoundAt.connect((key, position) => this.playAt(key, position));
	}

	private bootstrapGroups() {
		for (const name of GROUP_NAMES) {
			let group = SoundService.FindFirstChild(name) as SoundGroup | undefined;
			if (!group) {
				group = new Instance("SoundGroup");
				group.Name = name;
				group.Parent = SoundService;
			}
			this.groups.set(name, group);
		}
	}

	private applyVolumes(volumes: VolumeState | undefined) {
		if (!volumes) return;
		const master = volumes.master;
		this.groupOrThrow("UI").Volume = master;
		this.groupOrThrow("SFX").Volume = master * volumes.sfx;
		this.groupOrThrow("Music").Volume = master * volumes.music;
		this.groupOrThrow("Ambience").Volume = master * volumes.ambience;
	}

	private groupOrThrow(name: GroupName): SoundGroup {
		const group = this.groups.get(name);
		assert(group, `SoundGroup ${name} not bootstrapped`);
		return group;
	}

	private groupFor(entry: SoundEntry): SoundGroup {
		return this.groupOrThrow(entry.group === "ui" ? "UI" : "SFX");
	}

	private getOrCreate(key: SoundKey): Sound {
		const existing = this.cache.get(key);
		if (existing) return existing;

		const entry = Sounds[key];
		const sound = new Instance("Sound");
		sound.Name = key;
		sound.SoundId = entry.id;
		sound.Volume = entry.volume;
		sound.SoundGroup = this.groupFor(entry);
		sound.Parent = SoundService;
		this.cache.set(key, sound);
		return sound;
	}

	public play(key: SoundKey, options?: PlayOptions): Sound {
		const entry = Sounds[key];
		const sound = this.getOrCreate(key);
		sound.Volume = options?.volume !== undefined ? entry.volume * options.volume : entry.volume;
		sound.Play();
		return sound;
	}

	public playAt(key: SoundKey, position: Vector3 | CFrame, options?: PlayOptions) {
		const entry = Sounds[key];

		const part = new Instance("Part");
		part.Name = `SoundAt_${key}`;
		part.Anchored = true;
		part.CanCollide = false;
		part.CanQuery = false;
		part.CanTouch = false;
		part.Transparency = 1;
		part.Size = new Vector3(0.1, 0.1, 0.1);
		part.CFrame = typeIs(position, "CFrame") ? position : new CFrame(position);
		part.Parent = Workspace;

		const sound = new Instance("Sound");
		sound.SoundId = entry.id;
		sound.Volume = options?.volume !== undefined ? entry.volume * options.volume : entry.volume;
		sound.SoundGroup = this.groupFor(entry);
		sound.Parent = part;

		sound.Ended.Once(() => part.Destroy());
		sound.Play();
		Debris.AddItem(part, POSITIONAL_FALLBACK_TTL);
	}

	public stop(key: SoundKey) {
		this.cache.get(key)?.Stop();
	}

	public preload() {
		const ids = new Array<string>();
		for (const [, entry] of pairs(Sounds)) {
			ids.push(entry.id);
		}
		ContentProvider.PreloadAsync(ids);
	}
}
