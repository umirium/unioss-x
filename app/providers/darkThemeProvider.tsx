import type { Theme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material";
import type { Dispatch, ReactElement, SetStateAction } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { SettingsType } from "~/types/outline";

interface Props {
  darkMode: SettingsType["darkMode"];
  children: ReactElement;
}

interface ContextInterface {
  mode: SettingsType["darkMode"];
  setMode: Dispatch<SetStateAction<SettingsType["darkMode"]>>;
  theme: Theme;
}

const ThemeContext = createContext<ContextInterface | undefined>(undefined);

export function useDarkThemeContext() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useDarkThemeContext must be used within a DarkThemeProvider"
    );
  }

  return context;
}

export function DarkThemeProvider(props: Props) {
  // NOTE: type error: useState<Pick<SettingsType, "darkMode">>
  // cf. https://stackoverflow.com/questions/71472835/having-issues-using-pick-utility-type-with-react-usestate-hook
  const [mode, setMode] = useState<SettingsType["darkMode"]>(props.darkMode);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode === "system" ? (prefersDarkMode ? "dark" : "light") : mode,
        },
      }),
    [mode, prefersDarkMode]
  );

  const value: ContextInterface = { mode, setMode, theme };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
}
