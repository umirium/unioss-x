import type { ReactElement } from "react";
import { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleThemeButton from "./outline/toggleThemeButton";
import TopButton from "./outline/topButton";
import FlexDrawer from "./outline/flexDrawer";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  const handleToggleDrawer = () => {
    setMobileOpen(!mobileOpen);
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
              onClick={handleToggleDrawer}
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
              {t("front")}
            </Typography>
            <ToggleThemeButton />
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
          onClose={handleToggleDrawer}
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
