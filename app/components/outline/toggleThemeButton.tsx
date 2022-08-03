import { IconButton, useTheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useDarkThemeContext } from "~/providers/darkThemeProvider";

export default function ToggleThemeButton() {
  const theme = useTheme();
  const { darkMode } = useDarkThemeContext();

  return (
    <IconButton sx={{ ml: 1 }} onClick={darkMode.toggle}>
      {theme.palette.mode == "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
