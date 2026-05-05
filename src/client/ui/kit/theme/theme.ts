import { palette, semanticDark, SemanticColors } from "./colors";
import { gradients } from "./gradients";
import { motion } from "./motion";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { typography } from "./typography";

export interface Theme {
	name: string;
	scheme: "dark";
	colors: SemanticColors;
	palette: typeof palette;
	radius: typeof radius;
	spacing: typeof spacing;
	typography: typeof typography;
	motion: typeof motion;
	gradients: typeof gradients;
}

export const darkTheme: Theme = {
	name: "dark",
	scheme: "dark",
	colors: semanticDark,
	palette,
	radius,
	spacing,
	typography,
	motion,
	gradients,
};

export const defaultTheme = darkTheme;
