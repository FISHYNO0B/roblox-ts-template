const rgb = Color3.fromRGB;

export const palette = {
	slate: {
		50: rgb(248, 250, 252),
		100: rgb(241, 245, 249),
		200: rgb(226, 232, 240),
		300: rgb(203, 213, 225),
		400: rgb(148, 163, 184),
		500: rgb(100, 116, 139),
		600: rgb(71, 85, 105),
		700: rgb(51, 65, 85),
		800: rgb(30, 41, 59),
		900: rgb(15, 23, 42),
		950: rgb(2, 6, 23),
	},
	blue: {
		50: rgb(239, 246, 255),
		100: rgb(219, 234, 254),
		200: rgb(191, 219, 254),
		300: rgb(147, 197, 253),
		400: rgb(96, 165, 250),
		500: rgb(59, 130, 246),
		600: rgb(37, 99, 235),
		700: rgb(29, 78, 216),
		800: rgb(30, 64, 175),
		900: rgb(30, 58, 138),
		950: rgb(23, 37, 84),
	},
	red: {
		50: rgb(254, 242, 242),
		100: rgb(254, 226, 226),
		200: rgb(254, 202, 202),
		300: rgb(252, 165, 165),
		400: rgb(248, 113, 113),
		500: rgb(239, 68, 68),
		600: rgb(220, 38, 38),
		700: rgb(185, 28, 28),
		800: rgb(153, 27, 27),
		900: rgb(127, 29, 29),
		950: rgb(69, 10, 10),
	},
	emerald: {
		50: rgb(236, 253, 245),
		100: rgb(209, 250, 229),
		200: rgb(167, 243, 208),
		300: rgb(110, 231, 183),
		400: rgb(52, 211, 153),
		500: rgb(16, 185, 129),
		600: rgb(5, 150, 105),
		700: rgb(4, 120, 87),
		800: rgb(6, 95, 70),
		900: rgb(6, 78, 59),
		950: rgb(2, 44, 34),
	},
	amber: {
		50: rgb(255, 251, 235),
		100: rgb(254, 243, 199),
		200: rgb(253, 230, 138),
		300: rgb(252, 211, 77),
		400: rgb(251, 191, 36),
		500: rgb(245, 158, 11),
		600: rgb(217, 119, 6),
		700: rgb(180, 83, 9),
		800: rgb(146, 64, 14),
		900: rgb(120, 53, 15),
		950: rgb(69, 26, 3),
	},
	violet: {
		50: rgb(245, 243, 255),
		100: rgb(237, 233, 254),
		200: rgb(221, 214, 254),
		300: rgb(196, 181, 253),
		400: rgb(167, 139, 250),
		500: rgb(139, 92, 246),
		600: rgb(124, 58, 237),
		700: rgb(109, 40, 217),
		800: rgb(91, 33, 182),
		900: rgb(76, 29, 149),
		950: rgb(46, 16, 101),
	},
	white: rgb(255, 255, 255),
	black: rgb(0, 0, 0),
} as const;

export type Palette = typeof palette;

export interface SemanticColors {
	background: Color3;
	foreground: Color3;

	card: Color3;
	cardForeground: Color3;

	popover: Color3;
	popoverForeground: Color3;

	primary: Color3;
	primaryForeground: Color3;

	secondary: Color3;
	secondaryForeground: Color3;

	muted: Color3;
	mutedForeground: Color3;

	accent: Color3;
	accentForeground: Color3;

	destructive: Color3;
	destructiveForeground: Color3;

	success: Color3;
	successForeground: Color3;

	warning: Color3;
	warningForeground: Color3;

	border: Color3;
	input: Color3;
	ring: Color3;
}

export const semanticDark: SemanticColors = {
	background: palette.slate[950],
	foreground: palette.slate[50],

	card: palette.slate[900],
	cardForeground: palette.slate[50],

	popover: palette.slate[900],
	popoverForeground: palette.slate[50],

	primary: palette.blue[500],
	primaryForeground: palette.slate[50],

	secondary: palette.slate[800],
	secondaryForeground: palette.slate[50],

	muted: palette.slate[800],
	mutedForeground: palette.slate[400],

	accent: palette.violet[500],
	accentForeground: palette.slate[50],

	destructive: palette.red[500],
	destructiveForeground: palette.slate[50],

	success: palette.emerald[500],
	successForeground: palette.slate[50],

	warning: palette.amber[500],
	warningForeground: palette.slate[950],

	border: palette.slate[600],
	input: palette.slate[800],
	ring: palette.blue[500],
};
