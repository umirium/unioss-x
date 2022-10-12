import type { ReactElement, MouseEvent } from "react";
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
  Badge,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TopButton from "./outline/topButton";
import FlexDrawer from "./outline/flexDrawer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@remix-run/react";
import type { SettingsHandler } from "~/types/outline";
import type { definitions } from "~/types/tables";
import type { SnakeToCamel } from "snake-camel-types";
import AccountAvatar from "./outline/accountAvatar";

interface Props {
  children: ReactElement;
  authUser: SnakeToCamel<definitions["users"]> | null;
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
  const { children, authUser, drawerWidth } = props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settingsButtonRef = useRef({} as SettingsHandler);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const darkTheme = useTheme();

  const handleToggleMobileMenu = () => {
    // close settings drawer
    settingsButtonRef?.current.closeSettingsDrawer();

    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleClickLogo = (
    event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    // close menu and settings drawers
    setMobileMenuOpen(false);
    settingsButtonRef?.current.closeSettingsDrawer();

    navigate("/front");
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
              edge="start"
              onClick={handleToggleMobileMenu}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1, display: "flex" }}>
              <Typography
                variant="h6"
                sx={{ cursor: "pointer" }}
                onClick={handleClickLogo}
              >
                {t("front:title")}
              </Typography>
            </Box>

            <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
              <Badge
                badgeContent={100}
                color={
                  darkTheme.palette.mode === "light" ? "secondary" : "primary"
                }
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <AccountAvatar
              authUser={authUser}
              ref={settingsButtonRef}
              onClick={handleCloseMobileMenu}
            />
          </Toolbar>
        </AppBar>
      </HideAppbarOnScroll>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth || 240 }, flexShrink: { md: 0 } }}
      >
        {/* for mobile */}
        <FlexDrawer
          variant="temporary"
          open={mobileMenuOpen}
          onClose={handleToggleMobileMenu}
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
