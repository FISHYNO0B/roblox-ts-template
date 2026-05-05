import { Controller, OnInit, OnStart } from "@flamework/core";
import { SoundService, TweenService } from "@rbxts/services";
import { ClientEvents } from "client/infra/network";
import { Music, MusicKey } from "shared/domain/assets/Music";
import { applyMusicStackOp, topOfMusicStack } from "shared/domain/music/stack";

const DEFAULT_MUSIC: MusicKey | undefined = "menu";
const DEFAULT_FADE_MS = 1000;

interface PlayOptions {
	fadeMs?: number;
}

@Controller()
export class MusicController implements OnInit, OnStart {
	private stack: ReadonlyArray<MusicKey> = [];
	private currentSound?: Sound;
	private musicGroup?: SoundGroup;

	onInit() {
		this.musicGroup = SoundService.FindFirstChild("Music") as SoundGroup | undefined;
		ClientEvents.playMusic.connect((key) => this.replace(key));
	}

	onStart() {
		if (DEFAULT_MUSIC !== undefined) {
			this.push(DEFAULT_MUSIC);
		}
	}

	public push(key: MusicKey, options?: PlayOptions) {
		this.stack = applyMusicStackOp(this.stack, { kind: "push", key });
		this.transitionTo(key, options?.fadeMs ?? DEFAULT_FADE_MS);
	}

	public pop(options?: PlayOptions) {
		this.stack = applyMusicStackOp(this.stack, { kind: "pop" });
		this.transitionTo(topOfMusicStack(this.stack), options?.fadeMs ?? DEFAULT_FADE_MS);
	}

	public replace(key: MusicKey, options?: PlayOptions) {
		this.stack = applyMusicStackOp(this.stack, { kind: "replace", key });
		this.transitionTo(key, options?.fadeMs ?? DEFAULT_FADE_MS);
	}

	public stop(options?: PlayOptions) {
		this.stack = applyMusicStackOp(this.stack, { kind: "stop" });
		this.transitionTo(undefined, options?.fadeMs ?? DEFAULT_FADE_MS);
	}

	public current(): MusicKey | undefined {
		return topOfMusicStack(this.stack);
	}

	private transitionTo(key: MusicKey | undefined, fadeMs: number) {
		const fadeSeconds = math.max(fadeMs, 0) / 1000;
		const fadeInfo = new TweenInfo(fadeSeconds, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);

		const previous = this.currentSound;
		if (previous) {
			const fadeOut = TweenService.Create(previous, fadeInfo, { Volume: 0 });
			fadeOut.Completed.Once(() => previous.Destroy());
			fadeOut.Play();
		}

		if (key === undefined) {
			this.currentSound = undefined;
			return;
		}

		const entry = Music[key];
		const sound = new Instance("Sound");
		sound.Name = `Music_${key}`;
		sound.SoundId = entry.id;
		sound.Looped = entry.looped;
		sound.SoundGroup = this.musicGroup;
		sound.Volume = 0;
		sound.Parent = SoundService;
		sound.Play();

		const fadeIn = TweenService.Create(sound, fadeInfo, { Volume: entry.volume });
		fadeIn.Play();

		this.currentSound = sound;
	}
}
