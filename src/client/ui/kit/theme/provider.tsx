import React, { createContext, useContext } from "@rbxts/react";
import { darkTheme, Theme } from "./theme";

const ThemeContext = createContext<Theme>(darkTheme);

interface ThemeProviderProps extends React.PropsWithChildren {
	theme?: Theme;
}

export function ThemeProvider(props: ThemeProviderProps) {
	return <ThemeContext.Provider value={props.theme ?? darkTheme}>{props.children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
	return useContext(ThemeContext);
}
