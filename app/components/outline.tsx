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
import NavMenuDrawer from "./outline/navMenuDrawer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@remix-run/react";
import type { SettingsHandler } from "~/types/outline";
import type { definitions } from "~/types/tables";
import type { SnakeToCamel } from "snake-camel-types";
import AccountAvatar from "./outline/accountAvatar";
import SearchBox from "./outline/searchBox";

interface Props {
  children: ReactElement;
  authUser: SnakeToCamel<definitions["users"]> | null;
  cart: Array<SnakeToCamel<definitions["carts"]>>;
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
  const { children, authUser, cart, drawerWidth } = props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settingsButtonRef = useRef({} as SettingsHandler);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const darkTheme = useTheme();

  const handleToggleMobileMenu = () => {
    settingsButtonRef?.current.closeSettingsDrawer();

    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleClickLogo = (
    event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    setMobileMenuOpen(false);
    settingsButtonRef?.current.closeSettingsDrawer();

    navigate("/front");
  };

  const handleClickCart = () => {
    setMobileMenuOpen(false);
    settingsButtonRef?.current.closeSettingsDrawer();

    navigate("/front/cart");
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

            {/* title logo */}
            <Typography
              variant="h6"
              sx={{ cursor: "pointer" }}
              onClick={handleClickLogo}
            >
              {t("front:title")}
            </Typography>

            {/* search box */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "row-reverse",
                ml: 2,
                mr: 2,
              }}
            >
              <SearchBox />
            </Box>

            {/* cart */}
            <IconButton
              color="inherit"
              edge="start"
              sx={{ mr: 2 }}
              onClick={handleClickCart}
            >
              <Badge
                badgeContent={cart.reduce((sum, e) => sum + e.quantity, 0)}
                color={
                  darkTheme.palette.mode === "light" ? "secondary" : "primary"
                }
                showZero
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* sign-in avatar */}
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
        <NavMenuDrawer
          variant="temporary"
          open={mobileMenuOpen}
          onClose={handleToggleMobileMenu}
        />

        {/* for PC */}
        <NavMenuDrawer variant="permanent" open />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: 1000 }}>
        <Toolbar />
        {children}
      </Box>

      <TopButton />
    </Box>
  );
}
