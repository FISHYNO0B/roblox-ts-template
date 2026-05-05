import { Dependency } from "@flamework/core";
import { SoundService } from "server/services/SoundService";
import { serverStore } from "server/infra/store";
import { selectPlayerVolume } from "shared/infra/store/selectors/players";
import { getDefaultPlayerData } from "shared/infra/store/slices/players/utils";
import { resetStore } from "../utils/resetStore";

export = () => {
	const playerId = "TEST";

	describe("volume slice", () => {
		it("loads default volumes at 1.0", () => {
			serverStore.loadPlayerData(playerId, getDefaultPlayerData());
			serverStore.flush();
			expect(serverStore.getState(selectPlayerVolume(playerId, "master"))).to.equal(1);
			expect(serverStore.getState(selectPlayerVolume(playerId, "sfx"))).to.equal(1);
			expect(serverStore.getState(selectPlayerVolume(playerId, "music"))).to.equal(1);
			expect(serverStore.getState(selectPlayerVolume(playerId, "ambience"))).to.equal(1);
		});

		it("setVolume updates the slice", () => {
			serverStore.setVolume(playerId, "sfx", 0.25);
			expect(serverStore.getState(selectPlayerVolume(playerId, "sfx"))).to.equal(0.25);
		});

		it("setVolume clamps to 0..1", () => {
			serverStore.setVolume(playerId, "music", -1);
			expect(serverStore.getState(selectPlayerVolume(playerId, "music"))).to.equal(0);
			serverStore.setVolume(playerId, "music", 5);
			expect(serverStore.getState(selectPlayerVolume(playerId, "music"))).to.equal(1);
		});

		resetStore();
	});

	describe("SoundService.replicate", () => {
		it("broadcasts without throwing when no players are connected", () => {
			const service = Dependency<SoundService>();
			expect(() => service.replicate("click", new Vector3(0, 0, 0))).never.to.throw();
		});
	});
};
