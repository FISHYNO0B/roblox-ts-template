import React from "@rbxts/react";
import Object from "@rbxts/object-utils";
import { Stack } from "client/ui/kit";
import Button from "./components/button";
import { clientStore } from "client/infra/store";
import { selectHolderPage } from "shared/infra/store/selectors/client";
import { HolderPage, ImageName } from "shared/domain/Gui";

const BUTTONS: Partial<Record<HolderPage, ImageName>> = {
	Settings: "Settings",
};

export default function ButtonsApp() {
	return (
		<Stack
			direction="horizontal"
			spacing={3}
			automaticSize={Enum.AutomaticSize.XY}
			size={new UDim2(0, 0, 0, 0)}
			layoutOrder={1}
		>
			{Object.keys(BUTTONS).map((name) => (
				<Button
					button={name}
					image={BUTTONS[name]!}
					click={() => {
						const isCurrentPage = clientStore.getState(selectHolderPage) === name;
						clientStore.setHolderPage(isCurrentPage ? undefined : name);
					}}
				/>
			))}
		</Stack>
	);
}
