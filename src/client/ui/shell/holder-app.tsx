import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { Button, Stack } from "client/ui/kit";
import ButtonsApp from "client/ui/features/buttons/buttons-app";
import CurrencyApp from "client/ui/features/currency/currency-app";
import SettingsApp from "client/ui/features/settings/settings-app";
import { clientStore } from "client/infra/store";
import { HOLDER_PAGES } from "shared/domain/Gui";
import { selectHolderPage } from "shared/infra/store/selectors/client";

export default function HolderApp() {
	const page = useSelector(selectHolderPage);
	const isStudioEdit = RunService.IsStudio() && !RunService.IsRunMode();

	function getApp() {
		if (page === "Settings") return <SettingsApp />;
	}

	function getCyclePage(direction: "next" | "previous") {
		if (!page) return HOLDER_PAGES[0];
		const len = HOLDER_PAGES.size();
		const index = HOLDER_PAGES.indexOf(page);
		const offset = direction === "next" ? 1 : -1;
		return HOLDER_PAGES[(index + offset + len) % len];
	}

	function cyclePage(direction: "next" | "previous") {
		if (!page) return;
		clientStore.setHolderPage(getCyclePage(direction));
	}

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Size={new UDim2(1, 0, 1, 0)}
			BackgroundTransparency={1}
		>
			{getApp()}

			<Stack
				direction="vertical"
				spacing={4}
				align="end"
				anchorPoint={new Vector2(1, 0.5)}
				position={new UDim2(1, -16, 0.5, 0)}
				size={new UDim2(0, 240, 0, 0)}
				automaticSize={Enum.AutomaticSize.Y}
			>
				<CurrencyApp />
				<ButtonsApp />
			</Stack>

			{isStudioEdit && (
				<Stack
					direction="vertical"
					spacing={2}
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 16, 0, 16)}
					size={new UDim2(0, 220, 0, 0)}
					automaticSize={Enum.AutomaticSize.Y}
				>
					<Button
						text={`Previous: ${getCyclePage("previous")}`}
						variant="outline"
						size="sm"
						onClick={() => cyclePage("previous")}
						fullWidth={true}
					/>
					<Button
						text={`Next: ${getCyclePage("next")}`}
						variant="outline"
						size="sm"
						onClick={() => cyclePage("next")}
						fullWidth={true}
					/>
				</Stack>
			)}
		</frame>
	);
}
