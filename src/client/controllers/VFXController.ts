import { Controller, OnInit, OnStart } from "@flamework/core";
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { clientStore } from "client/infra/store";
import { VFX, VFXKey } from "shared/domain/assets/VFX";
import { Effect } from "shared/infra/store/slices/effects";
import { selectEffects } from "shared/infra/store/selectors/effects";

interface ShakeOptions {
	intensity: number;
	duration: number;
}

interface ActiveShake {
	intensity: number;
	endsAt: number;
}

const SHAKE_MAX_OFFSET_STUDS = 0.5;
const SHAKE_MAX_TILT_RAD = math.rad(2);

@Controller()
export class VFXController implements OnInit, OnStart {
	private templatesRoot?: Folder;
	private poolRoot?: Folder;
	private active = new Map<string, Instance>();
	private pool = new Map<VFXKey, Array<Instance>>();
	private shakes = new Array<ActiveShake>();

	onInit() {
		let templatesRoot = ReplicatedStorage.FindFirstChild("VFX") as Folder | undefined;
		if (!templatesRoot) {
			templatesRoot = new Instance("Folder");
			templatesRoot.Name = "VFX";
			templatesRoot.Parent = ReplicatedStorage;
		}
		this.templatesRoot = templatesRoot;

		const poolRoot = new Instance("Folder");
		poolRoot.Name = "VFXPool";
		poolRoot.Parent = ReplicatedStorage;
		this.poolRoot = poolRoot;
	}

	onStart() {
		clientStore.subscribe(selectEffects, (current, previous) => {
			this.diff(current, previous);
		});

		RunService.RenderStepped.Connect(() => this.applyShake());
	}

	public shake(options: ShakeOptions) {
		this.shakes.push({
			intensity: math.max(options.intensity, 0),
			endsAt: os.clock() + math.max(options.duration, 0),
		});
	}

	public shakeFromExplosion(position: Vector3, radius: number) {
		const camera = Workspace.CurrentCamera;
		if (!camera) return;
		const distance = camera.CFrame.Position.sub(position).Magnitude;
		const falloff = math.clamp(1 - distance / math.max(radius, 0.001), 0, 1);
		if (falloff <= 0) return;
		this.shake({ intensity: falloff, duration: 0.4 });
	}

	private diff(current: ReadonlyArray<Effect>, previous: ReadonlyArray<Effect>) {
		const currentIds = new Set<string>();
		for (const effect of current) {
			currentIds.add(effect.id);
			if (!this.active.has(effect.id)) this.spawn(effect);
		}
		for (const effect of previous) {
			if (!currentIds.has(effect.id)) this.despawn(effect);
		}
	}

	private spawn(effect: Effect) {
		const instance = this.acquire(effect.kind);
		if (!instance) return;
		if (instance.IsA("PVInstance")) instance.PivotTo(effect.cframe);
		instance.Parent = Workspace;
		this.active.set(effect.id, instance);
	}

	private despawn(effect: Effect) {
		const instance = this.active.get(effect.id);
		if (!instance) return;
		this.active.delete(effect.id);
		this.release(effect.kind, instance);
	}

	private acquire(kind: VFXKey): Instance | undefined {
		const pool = this.pool.get(kind);
		const reused = pool?.pop();
		if (reused) return reused;

		const template = this.findTemplate(kind);
		if (!template) {
			warn(`[VFXController] missing template for "${kind}"`);
			return undefined;
		}
		return template.Clone();
	}

	private release(kind: VFXKey, instance: Instance) {
		instance.Parent = this.poolRoot;
		let pool = this.pool.get(kind);
		if (!pool) {
			pool = [];
			this.pool.set(kind, pool);
		}
		pool.push(instance);
	}

	private findTemplate(kind: VFXKey): Instance | undefined {
		const entry = VFX[kind];
		const folder = this.templatesRoot?.FindFirstChild(entry.folder) as Folder | undefined;
		return folder?.FindFirstChild(entry.name);
	}

	private applyShake() {
		const camera = Workspace.CurrentCamera;
		if (!camera) return;

		const now = os.clock();
		this.shakes = this.shakes.filter((shake) => shake.endsAt > now);

		if (this.shakes.size() === 0) return;

		let intensity = 0;
		for (const shake of this.shakes) {
			if (shake.intensity > intensity) intensity = shake.intensity;
		}

		const offsetX = (math.random() - 0.5) * 2 * SHAKE_MAX_OFFSET_STUDS * intensity;
		const offsetY = (math.random() - 0.5) * 2 * SHAKE_MAX_OFFSET_STUDS * intensity;
		const tiltX = (math.random() - 0.5) * 2 * SHAKE_MAX_TILT_RAD * intensity;
		const tiltZ = (math.random() - 0.5) * 2 * SHAKE_MAX_TILT_RAD * intensity;

		camera.CFrame = camera.CFrame.mul(new CFrame(offsetX, offsetY, 0).mul(CFrame.Angles(tiltX, 0, tiltZ)));
	}
}
