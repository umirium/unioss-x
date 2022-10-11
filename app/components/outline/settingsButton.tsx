import type { IconButtonProps } from "@mui/material";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import SettingsIcon from "@mui/icons-material/Settings";
import type { MouseEvent } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { useState } from "react";
import { useDarkThemeContext } from "~/providers/darkThemeProvider";
import { useTranslation } from "react-i18next";
import type { SettingsHandler } from "~/types/outline";

interface Props extends IconButtonProps {
  onClose: () => void;
}

const SettingButton = forwardRef<SettingsHandler, Props>(function SettingButton(
  props: Props,
  ref
) {
  const [state, setState] = useState(false);
  const { mode, setMode } = useDarkThemeContext();
  const { t, i18n } = useTranslation();

  useImperativeHandle(ref, () => ({
    closeSettings: () => {
      setState(false);
    },
  }));

  const handleChangeMode = (_event: MouseEvent<HTMLElement>, mode: string) => {
    if (mode === "light" || mode === "dark") {
      setMode(mode);
    } else {
      setMode(undefined);
    }
  };

  const handleToggleDrawer = () => {
    // close setting drawer
    props.onClose();

    setState(!state);
  };

  const handleChangeLanguage = (
    _event: MouseEvent<HTMLElement>,
    language: string
  ) => {
    if (language === "en" || language === "ja") {
      i18n.changeLanguage(language);
    }
  };

  const list = () => (
    <Box sx={{ width: "auto" }} role="presentation">
      <List>
        <ListItem
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>{t("common:settings")}</Box>
          <Box
            sx={{ display: "inline-flex", cursor: "pointer" }}
            onClick={handleToggleDrawer}
          >
            <CloseIcon fontSize="small" />
          </Box>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <Typography variant="subtitle2">{t("mode")}</Typography>
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
              {t("common:light")}
            </ToggleButton>
            <ToggleButton value="system">
              <SettingsBrightnessIcon sx={{ mr: 1 }} />
              {t("common:system")}
            </ToggleButton>
            <ToggleButton value="dark">
              <DarkModeIcon sx={{ mr: 1 }} />
              {t("common:dark")}
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItem>
      </List>
      <List>
        <ListItem>
          <Typography variant="subtitle2">{t("common:language")}</Typography>
        </ListItem>
        <ListItem>
          <ToggleButtonGroup
            orientation="vertical"
            color="primary"
            value={i18n.language}
            exclusive
            onChange={handleChangeLanguage}
            aria-label="Platform"
            sx={{ width: "100%" }}
          >
            <ToggleButton value="en">{t("common:english")}</ToggleButton>
            <ToggleButton value="ja">{t("common:japanese")}</ToggleButton>
          </ToggleButtonGroup>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <IconButton onClick={handleToggleDrawer} {...props}>
        <SettingsIcon />
      </IconButton>
      <Drawer anchor="right" open={state} onClose={handleToggleDrawer}>
        <Toolbar />
        {list()}
      </Drawer>
    </>
  );
});

export default SettingButton;
