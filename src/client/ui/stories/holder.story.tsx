import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { ReflexProvider } from "@rbxts/react-reflex";
import { clientStore } from "client/infra/store";
import { ThemeProvider, ToastProvider, darkTheme } from "client/ui/kit";
import HolderApp from "client/ui/shell/holder-app";
import { GetStatePlayerId } from "client/ui/utils/GetStatePlayerId";
import { HOLDER_PAGES } from "shared/domain/Gui";
import { getDefaultPlayerData } from "shared/infra/store/slices/players/utils";

const Story = {
	summary: "Holder — full game UI shell",
	react: React,
	reactRoblox: ReactRoblox,
	story: () => {
		const latestPage = HOLDER_PAGES[HOLDER_PAGES.size() - 1];
		clientStore.loadPlayerData(GetStatePlayerId(), getDefaultPlayerData());
		clientStore.setHolderPage(latestPage);
		clientStore.toggleSetting(GetStatePlayerId(), "PvP");

		return (
			<ReflexProvider producer={clientStore}>
				<ThemeProvider theme={darkTheme}>
					<ToastProvider>
						<frame
							BackgroundColor3={darkTheme.colors.background}
							BorderSizePixel={0}
							Size={new UDim2(1, 0, 1, 0)}
						>
							<HolderApp />
						</frame>
					</ToastProvider>
				</ThemeProvider>
			</ReflexProvider>
		);
	},
};

export = Story;
