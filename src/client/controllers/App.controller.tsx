import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { clientStore } from "client/infra/store";
import { KitRoot, ToastProvider } from "client/ui/kit";
import HolderApp from "client/ui/shell/holder-app";

@Controller({})
export class App implements OnStart {
	onStart() {
		const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
		const root = createRoot(new Instance("Folder"));
		root.render(
			createPortal(
				<ReflexProvider producer={clientStore}>
					<KitRoot>
						<ToastProvider>
							<HolderApp />
						</ToastProvider>
					</KitRoot>
				</ReflexProvider>,
				playerGui,
			),
		);
	}
}
