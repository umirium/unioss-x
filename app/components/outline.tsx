import type { ReactElement } from "react";
import { useRef, useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  useScrollTrigger,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TopButton from "./outline/topButton";
import FlexDrawer from "./outline/flexDrawer";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "@remix-run/react";
import SettingsButton from "./outline/settingsButton";
import type { SettingsHandler } from "~/types/outline";

interface Props {
  children: ReactElement;
  drawerWidth?: number;
}

const HideAppbarOnScroll = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default function Outline(props: Props) {
  const { children, drawerWidth } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const childCompRef = useRef({} as SettingsHandler);
  const location = useLocation();

  const { t } = useTranslation();

  const handleToggleMenu = () => {
    // close settings drawer
    childCompRef?.current.closeSettings();

    setMobileOpen(!mobileOpen);
  };

  const handleCloseMenu = () => {
    setMobileOpen(false);
  };

  const handleClickSignin = () => {
    // close menu and settings drawers
    setMobileOpen(false);
    childCompRef?.current.closeSettings();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <HideAppbarOnScroll {...props}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleToggleMenu}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {t("front:title")}
            </Typography>
            <SettingsButton
              ref={childCompRef}
              onClose={handleCloseMenu}
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              component={Link}
              onClick={handleClickSignin}
              disabled={location.pathname === "/front/signin"}
              to={`/front/signin${
                location.pathname && `?r=${location.pathname}`
              }`}
            >
              {t("common:signin")}
            </Button>
          </Toolbar>
        </AppBar>
      </HideAppbarOnScroll>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth || 240 }, flexShrink: { md: 0 } }}
        aria-label="menu"
      >
        {/* for mobile */}
        <FlexDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleToggleMenu}
        />

        {/* for PC */}
        <FlexDrawer variant="permanent" open />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: 1000 }}>
        <Toolbar />
        {children}
      </Box>

      <TopButton />
    </Box>
  );
}
