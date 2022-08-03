import type { Theme } from "@mui/material";
import { createTheme } from "@mui/material";
import type { Dispatch, ReactElement } from "react";
import { createContext, useContext, useMemo, useState } from "react";

type DarkModeType = "light" | "dark";

interface Props {
  children: ReactElement;
}

interface ContextInterface {
  setMode: Dispatch<React.SetStateAction<DarkModeType>>;
  darkMode: {
    toggle: () => void;
  };
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
  const [mode, setMode] = useState<DarkModeType>("light");

  const darkMode = useMemo(
    () => ({
      toggle: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const value: ContextInterface = { setMode, darkMode, theme };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
}
