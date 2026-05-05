import { serverStore } from "server/infra/store";
import { selectEffects } from "shared/infra/store/selectors/effects";
import { resetStore } from "../utils/resetStore";

export = () => {
	describe("effects slice", () => {
		beforeEach(() => resetStore());

		it("playEffect appends to the list", () => {
			serverStore.playEffect({
				id: "a",
				kind: "hit",
				cframe: new CFrame(),
				startedAt: 0,
				ttl: 1,
			});
			expect(serverStore.getState(selectEffects).size()).to.equal(1);
		});

		it("removeEffect drops the matching id", () => {
			serverStore.playEffect({ id: "a", kind: "hit", cframe: new CFrame(), startedAt: 0, ttl: 1 });
			serverStore.playEffect({ id: "b", kind: "hit", cframe: new CFrame(), startedAt: 0, ttl: 1 });
			serverStore.removeEffect("a");
			const list = serverStore.getState(selectEffects);
			expect(list.size()).to.equal(1);
			expect(list[0].id).to.equal("b");
		});

		it("expireEffects removes effects with startedAt + ttl < now", () => {
			serverStore.playEffect({ id: "old", kind: "hit", cframe: new CFrame(), startedAt: 0, ttl: 1 });
			serverStore.playEffect({ id: "fresh", kind: "hit", cframe: new CFrame(), startedAt: 10, ttl: 5 });
			serverStore.expireEffects(11);
			const list = serverStore.getState(selectEffects);
			expect(list.size()).to.equal(1);
			expect(list[0].id).to.equal("fresh");
		});

		it("expireEffects keeps effects whose deadline equals now", () => {
			serverStore.playEffect({ id: "edge", kind: "hit", cframe: new CFrame(), startedAt: 0, ttl: 1 });
			serverStore.expireEffects(1);
			expect(serverStore.getState(selectEffects).size()).to.equal(1);
		});

		resetStore();
	});
};
