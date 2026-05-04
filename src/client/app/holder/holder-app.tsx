import React from "@rbxts/react";
import Frame from "client/system-ui/components/frame";
import SettingsApp from "../../system-ui/apps/settings/settings-app";
import { useSelector } from "@rbxts/react-reflex";
import CurrencyApp from "../../system-ui/apps/currency/currency-app";
import { HOLDER_PAGES } from "shared/domain/Gui";
import { clientStore } from "client/infra/store";
import { RunService } from "@rbxts/services";
import { selectHolderPage } from "shared/infra/store/selectors/client";
import ButtonsApp from "../../system-ui/apps/buttons/buttons-app";
import TextButton from "client/system-ui/components/textButton";

export default function HolderApp() {
	const page = useSelector(selectHolderPage);
	const isStudioEdit = RunService.IsStudio() && !RunService.IsRunMode();

	function getApp() {
		if (page === "Settings") {
			return <SettingsApp />;
		}
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

			<Frame
				anchorPoint={new Vector2(1, 0.5)}
				position={new UDim2(1, -10, 0.5, 0)}
				size={new UDim2(0, 265, 0, 65)}
				backgroundTransparency={1}
				automaticSize={Enum.AutomaticSize.XY}
				uiStrokeSize={0}
			>
				<uilistlayout
					Padding={new UDim(0, 25)}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>

				<CurrencyApp />
				<ButtonsApp />
			</Frame>

			{isStudioEdit && (
				<>
					<TextButton
						text={`Next: ${getCyclePage("next")}`}
						size={new UDim2(0, 200, 0, 65)}
						textSize={24}
						position={new UDim2(0, 0, 0, 70)}
						anchorPoint={new Vector2(0, 0)}
						onClick={() => cyclePage("next")}
					/>
					<TextButton
						text={`Previous: ${getCyclePage("previous")}`}
						size={new UDim2(0, 200, 0, 65)}
						textSize={24}
						position={new UDim2(0, 0, 0, 0)}
						anchorPoint={new Vector2(0, 0)}
						onClick={() => cyclePage("previous")}
					/>
				</>
			)}
		</frame>
	);
}
