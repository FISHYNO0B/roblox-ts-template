/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";
import { serverStore } from "server/infra/store";

export = () => {
	afterAll(() => {
		// Skip when the game is actually running (Run mode or Play Solo) so we don't
		// destroy the live store that PlayerDataService is using.
		if (RunService.IsRunning()) {
			return;
		}

		serverStore.destroy();
	});
};
