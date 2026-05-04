import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { clientStore } from "client/infra/store";
import HolderApp from "client/ui/shell/holder-app";
import ScreenGui from "client/ui/primitives/scaledGui";

@Controller({})
export class App implements OnStart {
	onStart() {
		const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
		const root = createRoot(new Instance("Folder"));
		root.render(
			createPortal(
				<ReflexProvider producer={clientStore}>
					<ScreenGui>
						<HolderApp />
					</ScreenGui>
				</ReflexProvider>,
				playerGui,
			),
		);
	}
}
