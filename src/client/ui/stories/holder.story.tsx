import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { clientStore } from "client/infra/store";
import { ReflexProvider } from "@rbxts/react-reflex";
import HolderApp from "client/ui/shell/holder-app";
import { HOLDER_PAGES } from "shared/domain/Gui";
import { getDefaultPlayerData } from "shared/infra/store/slices/players/utils";
import { GetStatePlayerId } from "client/ui/utils/GetStatePlayerId";

const Story = {
	summary: "Holder",
	react: React,
	reactRoblox: ReactRoblox,
	story: () => {
		const latestPage = HOLDER_PAGES[HOLDER_PAGES.size() - 1];
		clientStore.loadPlayerData(GetStatePlayerId(), getDefaultPlayerData());
		clientStore.setHolderPage(latestPage);
		clientStore.toggleSetting(GetStatePlayerId(), "PvP");

		// store.setHolderPage( "Settings" )

		return (
			<ReflexProvider producer={clientStore}>
				<HolderApp />
			</ReflexProvider>
		);
	},
};

export = Story;
