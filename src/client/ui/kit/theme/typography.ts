export const FONT_ASSET_ID = 16658237174;

export const fontFace = Font.fromId(FONT_ASSET_ID, Enum.FontWeight.ExtraBold, Enum.FontStyle.Normal);

export const fontSize = {
	xs: 12,
	sm: 14,
	base: 16,
	lg: 18,
	xl: 20,
	"2xl": 24,
	"3xl": 30,
	"4xl": 36,
	"5xl": 48,
	"6xl": 60,
} as const;

export type FontSizeToken = keyof typeof fontSize;

export const lineHeight = {
	tight: 1,
	snug: 1.15,
	normal: 1.25,
	relaxed: 1.5,
} as const;

export type LineHeightToken = keyof typeof lineHeight;

export const typography = {
	fontFace,
	size: fontSize,
	lineHeight,
};
