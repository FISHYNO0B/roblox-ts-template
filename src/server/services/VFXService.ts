import { OnInit, Service } from "@flamework/core";
import { HttpService, RunService, Workspace } from "@rbxts/services";
import { serverStore } from "server/infra/store";
import { VFX, VFXKey } from "shared/domain/assets/VFX";

const CLEANUP_INTERVAL_S = 0.5;

interface PlayOptions {
	ttl?: number;
}

@Service({})
export class VFXService implements OnInit {
	private accumulator = 0;

	onInit() {
		RunService.Heartbeat.Connect((dt) => {
			this.accumulator += dt;
			if (this.accumulator < CLEANUP_INTERVAL_S) return;
			this.accumulator = 0;
			serverStore.expireEffects(Workspace.GetServerTimeNow());
		});
	}

	public play(kind: VFXKey, cframe: CFrame, options?: PlayOptions): string {
		const id = HttpService.GenerateGUID(false);
		serverStore.playEffect({
			id,
			kind,
			cframe,
			startedAt: Workspace.GetServerTimeNow(),
			ttl: options?.ttl ?? VFX[kind].ttl,
		});
		return id;
	}

	public stop(id: string) {
		serverStore.removeEffect(id);
	}
}
