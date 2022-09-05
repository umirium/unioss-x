import type { IconButtonProps } from "@mui/material";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Box, Drawer, List, ListItem, Toolbar } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { Divider, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import type { MouseEvent } from "react";
import { useState } from "react";
import { useDarkThemeContext } from "~/providers/darkThemeProvider";

export default function SettingButton(props: IconButtonProps) {
  const [state, setState] = useState(false);
  const { mode, setMode } = useDarkThemeContext();

  const toggleDrawer = () => {
    setState(!state);
  };

  const handleChangeMode = (_event: MouseEvent<HTMLElement>, mode: string) => {
    if (mode === "light" || mode === "dark") {
      setMode(mode);
    } else {
      setMode(undefined);
    }
  };

  const list = () => (
    <Box sx={{ width: "auto" }} role="presentation">
      <List>
        <ListItem>
          <Box>Settings</Box>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <Typography variant="subtitle2">mode</Typography>
        </ListItem>
        <ListItem>
          <ToggleButtonGroup
            color="primary"
            value={mode === undefined ? "system" : mode}
            exclusive
            onChange={handleChangeMode}
            aria-label="Platform"
          >
            <ToggleButton value="light">
              <LightModeIcon sx={{ mr: 1 }} />
              Light
            </ToggleButton>
            <ToggleButton value="system">
              <SettingsBrightnessIcon sx={{ mr: 1 }} />
              System
            </ToggleButton>
            <ToggleButton value="dark">
              <DarkModeIcon sx={{ mr: 1 }} />
              Dark
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItem>
      </List>
      <List>
        <ListItem>
          <Typography variant="subtitle2">language</Typography>
        </ListItem>
        <ListItem>
          <ToggleButtonGroup
            orientation="vertical"
            color="primary"
            value={mode}
            exclusive
            onChange={handleChangeMode}
            aria-label="Platform"
            sx={{ width: "100%" }}
          >
            <ToggleButton value="web">English</ToggleButton>
            <ToggleButton value="android">Japanese</ToggleButton>
          </ToggleButtonGroup>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <IconButton onClick={toggleDrawer} {...props}>
        <SettingsIcon />
      </IconButton>
      <Drawer anchor="right" open={state} onClose={toggleDrawer}>
        <Toolbar />
        {list()}
      </Drawer>
    </>
  );
}
