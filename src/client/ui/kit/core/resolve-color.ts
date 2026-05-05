import type { SemanticColors } from "../theme/colors";
import type { Theme } from "../theme/theme";

export type ColorToken = keyof SemanticColors;
export type ColorValue = ColorToken | Color3;

export function resolveColor(value: ColorValue | undefined, theme: Theme): Color3 | undefined {
	if (value === undefined) return undefined;
	if (typeIs(value, "Color3")) return value;
	return theme.colors[value];
}
